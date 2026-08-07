import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { getAddress, keccak256, toBytes, parseUnits } from "viem";

/**
 * Tests de CrewdFunding.
 *
 * Todas las cantidades están en unidades base de 6 decimales, igual que
 * USDC. `usd(1)` son 1_000_000 unidades. Los números del reparto se
 * comprueban exactos en lugar de con tolerancia: la división entera es
 * parte del contrato y su residuo está documentado, así que un cambio en
 * esa aritmética debe romper el test.
 */

const usd = (n: number | string) => parseUnits(String(n), 6);

/** viem envuelve el error del contrato; basta con buscar el nombre. */
async function expectRevert(promise: Promise<unknown>, errorName: string) {
  try {
    await promise;
  } catch (error) {
    expect((error as Error).message).to.include(errorName);
    return;
  }
  throw new Error(`Se esperaba que revirtiera con ${errorName}, pero no falló`);
}

describe("CrewdFunding", () => {
  async function deployFixture() {
    const [admin, leader, donorA, donorB, stranger] = await hre.viem.getWalletClients();

    const usdc = await hre.viem.deployContract("MockUSDC");
    const funding = await hre.viem.deployContract("CrewdFunding", [
      usdc.address,
      admin.account.address,
    ]);

    // Cada donante reclama del grifo una sola vez (hay enfriamiento de 1h).
    await usdc.write.faucet({ account: donorA.account });
    await usdc.write.faucet({ account: donorB.account });

    return { admin, leader, donorA, donorB, stranger, usdc, funding };
  }

  /** Proyecto con 4 hitos, listo para recibir donaciones. */
  async function projectFixture() {
    const base = await deployFixture();
    await base.funding.write.createProject([
      "agua-limpia",
      base.leader.account.address,
      4,
    ]);
    return { ...base, projectId: 1n };
  }

  async function donate(
    ctx: Awaited<ReturnType<typeof projectFixture>>,
    donor: (typeof ctx)["donorA"],
    amount: bigint
  ) {
    await ctx.usdc.write.approve([ctx.funding.address, amount], { account: donor.account });
    await ctx.funding.write.donate([ctx.projectId, amount], { account: donor.account });
  }

  /* ----------------------------- Despliegue ----------------------------- */

  describe("despliegue", () => {
    it("fija el token y concede los tres roles al admin", async () => {
      const { funding, usdc, admin } = await loadFixture(deployFixture);

      expect(getAddress(await funding.read.token())).to.equal(getAddress(usdc.address));

      const adminRole = await funding.read.DEFAULT_ADMIN_ROLE();
      const curator = await funding.read.CURATOR_ROLE();
      const verifier = await funding.read.VERIFIER_ROLE();

      expect(await funding.read.hasRole([adminRole, admin.account.address])).to.be.true;
      expect(await funding.read.hasRole([curator, admin.account.address])).to.be.true;
      expect(await funding.read.hasRole([verifier, admin.account.address])).to.be.true;
    });

    it("rechaza el token o el admin en dirección cero", async () => {
      const { usdc, admin } = await loadFixture(deployFixture);
      const zero = "0x0000000000000000000000000000000000000000";

      await expectRevert(
        hre.viem.deployContract("CrewdFunding", [zero, admin.account.address]),
        "ZeroAddress"
      );
      await expectRevert(
        hre.viem.deployContract("CrewdFunding", [usdc.address, zero]),
        "ZeroAddress"
      );
    });

    it("MockUSDC usa 6 decimales, como el USDC real", async () => {
      const { usdc } = await loadFixture(deployFixture);
      expect(await usdc.read.decimals()).to.equal(6);
    });
  });

  /* ---------------------------- createProject --------------------------- */

  describe("createProject", () => {
    it("registra el proyecto y lo indexa por hash del slug", async () => {
      const { funding, leader } = await loadFixture(deployFixture);

      await funding.write.createProject(["agua-limpia", leader.account.address, 6]);

      const project = await funding.read.getProject([1n]);
      expect(getAddress(project.leader)).to.equal(getAddress(leader.account.address));
      expect(project.milestoneCount).to.equal(6);
      expect(project.status).to.equal(0); // Active
      expect(project.slugHash).to.equal(keccak256(toBytes("agua-limpia")));

      const slugHash = keccak256(toBytes("agua-limpia"));
      expect(await funding.read.projectIdBySlugHash([slugHash])).to.equal(1n);
      expect(await funding.read.projectCount()).to.equal(1n);
    });

    it("solo el rol CURATOR puede registrar", async () => {
      const { funding, leader, stranger } = await loadFixture(deployFixture);
      await expectRevert(
        funding.write.createProject(["x", leader.account.address, 3], {
          account: stranger.account,
        }),
        "AccessControlUnauthorizedAccount"
      );
    });

    it("rechaza cero hitos o más del máximo", async () => {
      const { funding, leader } = await loadFixture(deployFixture);
      await expectRevert(
        funding.write.createProject(["a", leader.account.address, 0]),
        "InvalidMilestoneCount"
      );
      await expectRevert(
        funding.write.createProject(["b", leader.account.address, 25]),
        "InvalidMilestoneCount"
      );
    });

    it("rechaza el slug vacío y el slug duplicado", async () => {
      const { funding, leader } = await loadFixture(deployFixture);

      await expectRevert(
        funding.write.createProject(["", leader.account.address, 3]),
        "EmptySlugHash"
      );

      await funding.write.createProject(["agua-limpia", leader.account.address, 3]);
      await expectRevert(
        funding.write.createProject(["agua-limpia", leader.account.address, 3]),
        "SlugAlreadyRegistered"
      );
    });
  });

  /* -------------------------------- donate ------------------------------- */

  describe("donate", () => {
    it("registra el aporte y acumula el total recaudado", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, donorA, donorB } = ctx;

      await donate(ctx, donorA, usd(600));
      await donate(ctx, donorB, usd(400));

      expect(await funding.read.contributionOf([1n, donorA.account.address])).to.equal(usd(600));
      expect(await funding.read.contributionOf([1n, donorB.account.address])).to.equal(usd(400));

      const project = await funding.read.getProject([1n]);
      expect(project.totalRaised).to.equal(usd(1000));
      expect(await funding.read.escrowOf([1n])).to.equal(usd(1000));
    });

    it("rechaza importe cero y proyecto inexistente", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, donorA } = ctx;

      await expectRevert(
        funding.write.donate([1n, 0n], { account: donorA.account }),
        "ZeroAmount"
      );
      await expectRevert(
        funding.write.donate([99n, usd(1)], { account: donorA.account }),
        "UnknownProject"
      );
    });

    it("no acepta donaciones a un proyecto fallido", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, donorA } = ctx;

      await donate(ctx, donorA, usd(100));
      await funding.write.markFailed([1n]);

      await ctx.usdc.write.approve([funding.address, usd(50)], { account: donorA.account });
      await expectRevert(
        funding.write.donate([1n, usd(50)], { account: donorA.account }),
        "ProjectNotActive"
      );
    });
  });

  /* --------------------------- submitMilestone --------------------------- */

  describe("submitMilestone", () => {
    it("solo el líder del proyecto puede presentar", async () => {
      const ctx = await loadFixture(projectFixture);
      await expectRevert(
        ctx.funding.write.submitMilestone([1n, 0n, "ipfs://x"], { account: ctx.stranger.account }),
        "NotProjectLeader"
      );
    });

    it("exige evidencia y un índice dentro de rango", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, leader } = ctx;

      await expectRevert(
        funding.write.submitMilestone([1n, 0n, ""], { account: leader.account }),
        "EmptyEvidence"
      );
      await expectRevert(
        funding.write.submitMilestone([1n, 9n, "ipfs://x"], { account: leader.account }),
        "MilestoneOutOfRange"
      );
    });

    it("permite volver a presentar un hito rechazado, pero no uno aprobado", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, leader, donorA } = ctx;
      await donate(ctx, donorA, usd(400));

      await funding.write.submitMilestone([1n, 0n, "ipfs://v1"], { account: leader.account });
      await funding.write.rejectMilestone([1n, 0n, "falta la evidencia de campo"]);

      let milestone = await funding.read.getMilestone([1n, 0n]);
      expect(milestone.status).to.equal(3); // Rejected

      await funding.write.submitMilestone([1n, 0n, "ipfs://v2"], { account: leader.account });
      await funding.write.approveMilestone([1n, 0n]);

      milestone = await funding.read.getMilestone([1n, 0n]);
      expect(milestone.status).to.equal(2); // Approved
      expect(milestone.evidenceURI).to.equal("ipfs://v2");

      await expectRevert(
        funding.write.submitMilestone([1n, 0n, "ipfs://v3"], { account: leader.account }),
        "MilestoneNotSubmittable"
      );
    });
  });

  /* --------------------------- approveMilestone -------------------------- */

  describe("approveMilestone", () => {
    it("solo el rol VERIFIER puede aprobar", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, leader, donorA, stranger } = ctx;
      await donate(ctx, donorA, usd(400));
      await funding.write.submitMilestone([1n, 0n, "ipfs://x"], { account: leader.account });

      await expectRevert(
        funding.write.approveMilestone([1n, 0n], { account: stranger.account }),
        "AccessControlUnauthorizedAccount"
      );
    });

    it("no libera nada si el hito no fue presentado", async () => {
      const ctx = await loadFixture(projectFixture);
      await donate(ctx, ctx.donorA, usd(400));
      await expectRevert(ctx.funding.write.approveMilestone([1n, 0n]), "MilestoneNotSubmitted");
    });

    it("libera el depósito dividido entre los hitos que faltan", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, usdc, leader, donorA, donorB } = ctx;

      await donate(ctx, donorA, usd(600));
      await donate(ctx, donorB, usd(400)); // total 1000, 4 hitos

      await funding.write.submitMilestone([1n, 0n, "ipfs://m0"], { account: leader.account });
      await funding.write.approveMilestone([1n, 0n]);

      // 1000 / 4 hitos restantes = 250
      expect(await usdc.read.balanceOf([leader.account.address])).to.equal(usd(250));
      expect(await funding.read.escrowOf([1n])).to.equal(usd(750));

      // Una donación tardía se reparte entre los hitos que quedan, no queda atrapada.
      await donate(ctx, donorA, usd(200)); // depósito 950, quedan 3 hitos

      await funding.write.submitMilestone([1n, 1n, "ipfs://m1"], { account: leader.account });
      await funding.write.approveMilestone([1n, 1n]);

      // 950 / 3 = 316.666666 → 316666666 unidades
      const expectedSecond = 316_666_666n;
      expect(await usdc.read.balanceOf([leader.account.address])).to.equal(
        usd(250) + expectedSecond
      );

      const project = await funding.read.getProject([1n]);
      expect(project.milestonesApproved).to.equal(2);
      expect(project.totalRaised).to.equal(usd(1200));
    });

    it("marca el proyecto completado y vacía el depósito en el último hito", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, usdc, leader, donorA } = ctx;

      await donate(ctx, donorA, usd(1000));

      for (let i = 0n; i < 4n; i++) {
        await funding.write.submitMilestone([1n, i, `ipfs://m${i}`], { account: leader.account });
        await funding.write.approveMilestone([1n, i]);
      }

      const project = await funding.read.getProject([1n]);
      expect(project.status).to.equal(1); // Completed
      expect(project.milestonesApproved).to.equal(4);

      // El último divisor es 1, así que el residuo de las divisiones se liquida.
      expect(await funding.read.escrowOf([1n])).to.equal(0n);
      expect(await usdc.read.balanceOf([leader.account.address])).to.equal(usd(1000));
      expect(await usdc.read.balanceOf([funding.address])).to.equal(0n);
    });

    it("no deja aprobar más hitos tras completar el proyecto", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, leader, donorA } = ctx;
      await donate(ctx, donorA, usd(400));

      for (let i = 0n; i < 4n; i++) {
        await funding.write.submitMilestone([1n, i, "ipfs://m"], { account: leader.account });
        await funding.write.approveMilestone([1n, i]);
      }

      await expectRevert(
        funding.write.submitMilestone([1n, 0n, "ipfs://otra"], { account: leader.account }),
        "ProjectNotActive"
      );
    });
  });

  /* ------------------------- markFailed / claimRefund -------------------- */

  describe("fallo y reembolso", () => {
    it("reparte lo no liberado en proporción a lo aportado", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, usdc, leader, donorA, donorB } = ctx;

      await donate(ctx, donorA, usd(600));
      await donate(ctx, donorB, usd(400));

      await funding.write.submitMilestone([1n, 0n, "ipfs://m0"], { account: leader.account });
      await funding.write.approveMilestone([1n, 0n]); // libera 250, quedan 750

      await donate(ctx, donorA, usd(200)); // A aporta 800 en total, recaudado 1200

      await funding.write.submitMilestone([1n, 1n, "ipfs://m1"], { account: leader.account });
      await funding.write.approveMilestone([1n, 1n]); // libera 316.666666

      const escrowBefore = await funding.read.escrowOf([1n]);
      await funding.write.markFailed([1n]);

      const project = await funding.read.getProject([1n]);
      expect(project.status).to.equal(2); // Failed
      expect(project.refundPool).to.equal(escrowBefore);

      // refundPool * aportado / recaudado
      const expectedA = (escrowBefore * usd(800)) / usd(1200);
      const expectedB = (escrowBefore * usd(400)) / usd(1200);

      expect(await funding.read.refundableOf([1n, donorA.account.address])).to.equal(expectedA);
      expect(await funding.read.refundableOf([1n, donorB.account.address])).to.equal(expectedB);

      const balanceABefore = await usdc.read.balanceOf([donorA.account.address]);
      await funding.write.claimRefund([1n], { account: donorA.account });
      expect(await usdc.read.balanceOf([donorA.account.address])).to.equal(
        balanceABefore + expectedA
      );

      await funding.write.claimRefund([1n], { account: donorB.account });

      // El residuo documentado: la suma de reembolsos queda como mucho unas
      // pocas unidades base por debajo del pool, por las divisiones enteras.
      // Se compara con `<` porque chai no ordena bigint.
      const leftover = await usdc.read.balanceOf([funding.address]);
      expect(leftover < 10n, `residuo inesperado: ${leftover}`).to.be.true;
    });

    it("no permite reclamar dos veces ni a quien no aportó", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, donorA, stranger } = ctx;

      await donate(ctx, donorA, usd(500));
      await funding.write.markFailed([1n]);

      await funding.write.claimRefund([1n], { account: donorA.account });
      await expectRevert(
        funding.write.claimRefund([1n], { account: donorA.account }),
        "RefundAlreadyClaimed"
      );
      await expectRevert(
        funding.write.claimRefund([1n], { account: stranger.account }),
        "NothingToRefund"
      );
    });

    it("no deja reclamar si el proyecto sigue activo", async () => {
      const ctx = await loadFixture(projectFixture);
      await donate(ctx, ctx.donorA, usd(100));
      await expectRevert(
        ctx.funding.write.claimRefund([1n], { account: ctx.donorA.account }),
        "ProjectNotFailed"
      );
    });

    it("solo el rol VERIFIER puede declarar el fallo", async () => {
      const ctx = await loadFixture(projectFixture);
      await expectRevert(
        ctx.funding.write.markFailed([1n], { account: ctx.stranger.account }),
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  /* -------------------------------- pausa -------------------------------- */

  describe("pausa", () => {
    it("frena las donaciones pero nunca los reembolsos", async () => {
      const ctx = await loadFixture(projectFixture);
      const { funding, usdc, donorA } = ctx;

      await donate(ctx, donorA, usd(500));
      await funding.write.markFailed([1n]);
      await funding.write.pause();

      await usdc.write.approve([funding.address, usd(10)], { account: donorA.account });
      await expectRevert(
        funding.write.donate([1n, usd(10)], { account: donorA.account }),
        "EnforcedPause"
      );

      // El dinero que ya está dentro debe poder salir aunque esté pausado.
      const before = await usdc.read.balanceOf([donorA.account.address]);
      await funding.write.claimRefund([1n], { account: donorA.account });
      const after = await usdc.read.balanceOf([donorA.account.address]);
      expect(after - before).to.equal(usd(500));
    });

    it("solo el admin puede pausar", async () => {
      const ctx = await loadFixture(projectFixture);
      await expectRevert(
        ctx.funding.write.pause({ account: ctx.stranger.account }),
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  /* ------------------------------ seguridad ------------------------------ */

  describe("seguridad", () => {
    it("bloquea la reentrada en claimRefund", async () => {
      const [admin, leader] = await hre.viem.getWalletClients();

      const token = await hre.viem.deployContract("HookToken");
      const funding = await hre.viem.deployContract("CrewdFunding", [
        token.address,
        admin.account.address,
      ]);
      await funding.write.createProject(["reentrante", leader.account.address, 2]);

      const attacker = await hre.viem.deployContract("ReentrantDonor");
      await attacker.write.configure([funding.address, token.address, 1n]);
      await token.write.setHookTarget([attacker.address]);

      await token.write.mint([attacker.address, usd(1000)]);
      await attacker.write.donate([usd(1000)]);

      await funding.write.markFailed([1n]);
      await attacker.write.claim();

      expect(await attacker.read.reentryAttempted()).to.be.true;
      expect(await attacker.read.reentryReverted()).to.be.true;

      // El atacante recupera lo suyo una sola vez, no más.
      expect(await token.read.balanceOf([attacker.address])).to.equal(usd(1000));
      expect(await token.read.balanceOf([funding.address])).to.equal(0n);
    });

    it("contabiliza por diferencia de saldo con un token que cobra comisión", async () => {
      const [admin, leader, donor] = await hre.viem.getWalletClients();

      const token = await hre.viem.deployContract("FeeOnTransferToken");
      const funding = await hre.viem.deployContract("CrewdFunding", [
        token.address,
        admin.account.address,
      ]);
      await funding.write.createProject(["comision", leader.account.address, 1]);

      await token.write.mint([donor.account.address, usd(1000)]);
      await token.write.approve([funding.address, usd(1000)], { account: donor.account });
      await funding.write.donate([1n, usd(1000)], { account: donor.account });

      // El token se queda el 1%: se anotan 990, no los 1000 nominales.
      const project = await funding.read.getProject([1n]);
      expect(project.totalRaised).to.equal(usd(990));
      expect(await funding.read.contributionOf([1n, donor.account.address])).to.equal(usd(990));
      expect(await token.read.balanceOf([funding.address])).to.equal(usd(990));
    });
  });
});
