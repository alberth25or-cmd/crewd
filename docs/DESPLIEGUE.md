# Despliegue

De cero a una demo funcionando en Arbitrum Sepolia y Vercel.

---

## Requisitos

- Node.js 20 o superior
- Una wallet de navegador (MetaMask u otra inyectada)
- Una cuenta desechable con ETH de testnet en Arbitrum Sepolia

> **Nunca uses una clave privada con fondos reales.** Crea una cuenta nueva
> solo para desplegar.

Faucets de Arbitrum Sepolia:
- https://faucet.quicknode.com/arbitrum/sepolia
- https://www.alchemy.com/faucets/arbitrum-sepolia

---

## 1 · Contratos

```bash
cd contracts
npm install
npm test              # 26 casos, deben pasar todos
```

Configura el entorno:

```bash
cp .env.example .env
```

Rellena `.env`:

```ini
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
DEPLOYER_PRIVATE_KEY=tu_clave_sin_el_prefijo_0x
ARBISCAN_API_KEY=opcional_pero_recomendado
```

Despliega:

```bash
npm run deploy:sepolia
```

Salida esperada:

```
Red         arbitrumSepolia (chainId 421614)
Desplegando 0x1234…
Saldo       0.05 ETH

MockUSDC    0xAAAA…
CrewdFunding 0xBBBB…

Registro    deployments/arbitrumSepolia.json
ABIs        lib/chain/abis.ts

--- Pega esto en el .env.local de la app de Next ---
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_CREWD_FUNDING_ADDRESS=0xBBBB…
NEXT_PUBLIC_STABLECOIN_ADDRESS=0xAAAA…
NEXT_PUBLIC_DEPLOY_BLOCK=123456789
----------------------------------------------------
```

El script hace tres cosas: despliega, escribe
`deployments/arbitrumSepolia.json` (que **sí se versiona** — es la única
fuente de verdad de qué hay corriendo en cada red) y copia los ABIs a
`lib/chain/abis.ts` para que la aplicación no pueda desincronizarse del
bytecode desplegado.

### Registrar los proyectos del catálogo

```bash
npm run seed:sepolia
```

Registra los cuatro proyectos semilla con su número de sprints como número de
hitos. Es idempotente: si vuelves a ejecutarlo, salta los que ya existen.

La cuenta que firma queda como líder de los cuatro, que es lo cómodo para una
demo. En un despliegue real cada proyecto se registraría con la dirección de
su propio líder.

### Verificar en Arbiscan

Opcional pero muy recomendable: sin verificar, nadie puede leer el contrato al
que le está confiando dinero.

```bash
npm run verify:sepolia -- 0xAAAA…
npm run verify:sepolia -- 0xBBBB… 0xAAAA… 0xTU_DIRECCION_ADMIN
```

Los argumentos del segundo comando son los del constructor: la stablecoin y el
administrador.

---

## 2 · Aplicación en local

Desde la raíz del repositorio:

```bash
npm install
cp .env.example .env.local
```

Pega en `.env.local` las cuatro variables que imprimió el script de despliegue.

```bash
npm run dev
```

Abre http://localhost:3000/proyectos/agua-limpia. La sección de financiamiento
debe mostrar las cifras en cero y el botón **Aportar al proyecto**.

### Probar el flujo completo

1. Pulsa **Aportar al proyecto** → **Conectar**.
2. Si tu wallet está en otra red, el diálogo ofrece cambiarla.
3. Pulsa **Consigue mUSDC de prueba** — el grifo entrega 1.000, una vez por hora.
4. Elige un importe y pulsa **Aportar**. Se firman dos transacciones: primero
   la autorización del token, después la donación.
5. Al confirmarse, la página se recarga y el aporte aparece en **Movimientos
   verificables** con enlace a Arbiscan.

Para probar la liberación por hitos hace falta llamar al contrato como
verificador. Desde `contracts/`:

```bash
npx hardhat console --network arbitrumSepolia
```

```js
const f = await hre.viem.getContractAt("CrewdFunding", "0xBBBB…");
await f.write.submitMilestone([1n, 0n, "ipfs://evidencia"]);  // como líder
await f.write.approveMilestone([1n, 0n]);                      // como verificador
```

---

## 3 · Vercel

### Importar

1. Sube el repositorio a GitHub.
2. En Vercel, **Add New → Project** e importa el repositorio.
3. Vercel detecta Next.js solo. **No cambies el directorio raíz**: `contracts/`
   es un paquete npm aparte y Vercel lo ignora.

### Variables de entorno

En **Settings → Environment Variables**, añade las cuatro para *Production*,
*Preview* y *Development*:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_CHAIN_ID` | `421614` |
| `NEXT_PUBLIC_CREWD_FUNDING_ADDRESS` | Dirección del despliegue |
| `NEXT_PUBLIC_STABLECOIN_ADDRESS` | Dirección de MockUSDC |
| `NEXT_PUBLIC_DEPLOY_BLOCK` | Bloque del despliegue |
| `NEXT_PUBLIC_RPC_URL` | *(opcional)* RPC propio |

Todas llevan el prefijo `NEXT_PUBLIC_` porque son direcciones públicas de una
testnet: no hay nada que ocultar en ellas. `NEXT_PUBLIC_RPC_URL` es la
excepción a vigilar — si algún día usas un RPC con clave, muévelo a una
variable sin prefijo y léelo solo desde el servidor.

> Si despliegas **sin** configurar nada, la aplicación funciona igual: la
> sección de financiamiento muestra su estado "próximamente". Es útil para
> tener la interfaz en línea antes que los contratos.

### Desplegar

`git push` a la rama principal. Vercel construye y publica.

---

## Solución de problemas

**`La cuenta no tiene ETH`**
La cuenta desplegadora está vacía. Pide en un faucet de Arbitrum Sepolia.

**El panel dice "todavía no tiene tesorería abierta"**
El proyecto no está registrado en la cadena. Ejecuta `npm run seed:sepolia`.
Verifica también que `NEXT_PUBLIC_CREWD_FUNDING_ADDRESS` apunta al contrato
donde se registró.

**Los movimientos aparecen vacíos aunque haya donaciones**
`NEXT_PUBLIC_DEPLOY_BLOCK` falta o es posterior a las transacciones. Ponlo en
el bloque del despliegue, que está en `deployments/arbitrumSepolia.json`.

**`Red equivocada` y el botón de cambiar no funciona**
Algunas wallets no permiten cambiar a una red que no tienen dada de alta.
Añade Arbitrum Sepolia manualmente: chainId `421614`, RPC
`https://sepolia-rollup.arbitrum.io/rpc`, explorador
`https://sepolia.arbiscan.io`.

**`No tienes suficiente ETH para pagar el gas`**
El donante también necesita ETH de testnet, no solo mUSDC.

**El build de Vercel falla con errores de tipos en `contracts/`**
`contracts` está excluido en `tsconfig.json`. Si lo quitaste, vuelve a
añadirlo: tiene su propio tsconfig y su propio runner.

---

## Volver a desplegar

Cada despliegue crea contratos nuevos con direcciones nuevas y **el estado
anterior no se migra**. Después de redesplegar hay que:

1. Actualizar las cuatro variables en Vercel.
2. Volver a ejecutar `npm run seed:sepolia`.
3. Volver a verificar en Arbiscan.

El archivo `deployments/arbitrumSepolia.json` se sobrescribe. Consérvalo en el
historial de git: es el registro de qué dirección estuvo viva en cada momento.
