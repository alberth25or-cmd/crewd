# Contratos

Referencia de la capa on-chain. Dos contratos: la tesorería y una stablecoin
de prueba.

> **Estos contratos no han sido auditados.** Son un MVP de testnet. No los
> uses con dinero real.

---

## CrewdFunding

Tesorería por proyecto. Recibe donaciones en una stablecoin, las retiene y las
libera al equipo solo contra hitos verificados. Si el proyecto muere, lo no
liberado vuelve a los donantes en proporción a lo que aportó cada uno.

### El problema que resuelve

Una caja de donaciones normal le da la llave al líder. El donante tiene que
confiar en que no se irá con el dinero, que es exactamente la desconfianza que
hace que nadie financie proyectos de desconocidos.

Aquí el líder **no puede retirar solo**. Firma un hito con evidencia y un
verificador lo aprueba. Sin esa segunda firma no se mueve nada.

### Máquina de estados

```
                    createProject
                          │
                          ▼
                     ┌─────────┐
        donate ─────▶│ Activo  │◀───── submitMilestone
                     └────┬────┘         (líder)
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
  approveMilestone × N                  markFailed
  (verificador)                        (verificador)
        │                                    │
        ▼                                    ▼
   ┌────────────┐                      ┌──────────┐
   │ Completado │                      │ Fallido  │
   └────────────┘                      └────┬─────┘
   depósito vacío                           │
                                       claimRefund
                                        (donantes)
```

Los hitos tienen su propio ciclo: `Pendiente → Presentado → Aprobado`, con
`Rechazado` como vuelta atrás. Un hito rechazado se puede volver a presentar;
uno aprobado no.

### Roles

| Rol | Puede |
|---|---|
| `DEFAULT_ADMIN_ROLE` | Pausar, reanudar, conceder y revocar roles |
| `CURATOR_ROLE` | Registrar proyectos |
| `VERIFIER_ROLE` | Aprobar y rechazar hitos, declarar fallido un proyecto |
| — (líder del proyecto) | Presentar hitos con evidencia |
| — (cualquiera) | Donar, reclamar reembolso de lo que aportó |

El constructor concede los tres roles a la dirección `admin`. **En cualquier
despliegue que no sea de prueba, `admin` debe ser un multisig.**

### Funciones

#### Escritura

```solidity
createProject(string slug, address leader, uint32 milestoneCount) → uint256
```
Registra un proyecto y abre su tesorería. `slug` es el identificador del
catálogo fuera de la cadena; se guarda su `keccak256` y se emite el texto en
el evento, para que un indexador pueda enlazar sin consultar la API. Rechaza
slugs duplicados. `milestoneCount` normalmente es el número de sprints del
roadmap. Máximo 24.

```solidity
donate(uint256 projectId, uint256 amount)
```
Requiere `approve` previo sobre el token. Contabiliza **por diferencia de
saldo**, no por el nominal pedido — ver [Tokens con comisión](#tokens-con-comisión).

```solidity
submitMilestone(uint256 projectId, uint256 index, string evidenceURI)
```
Solo el líder. `evidenceURI` no puede estar vacío y no debe contener datos
personales.

```solidity
approveMilestone(uint256 projectId, uint256 index)
```
Solo `VERIFIER_ROLE`. Libera fondos al líder y, si era el último hito, marca
el proyecto como completado.

```solidity
rejectMilestone(uint256 projectId, uint256 index, string reason)
claimRefund(uint256 projectId) → uint256
markFailed(uint256 projectId)
pause() / unpause()
```

#### Lectura

```solidity
getProject(uint256) → Project
getMilestone(uint256, uint256) → Milestone
getMilestones(uint256) → Milestone[]
escrowOf(uint256) → uint256            // recaudado − liberado
refundableOf(uint256, address) → uint256
contributionOf(uint256, address) → uint256
projectIdBySlugHash(bytes32) → uint256
projectCount() → uint256
```

---

## Las matemáticas

### Liberación por hito

Cada aprobación libera **el depósito dividido entre los hitos que faltan**, no
una fracción fija del total:

```
importe = (totalRecaudado − totalLiberado) / (hitos − hitosAprobados)
```

Esto tiene dos propiedades que la fracción fija no tiene:

1. **Las donaciones tardías se reparten entre los hitos restantes** en vez de
   quedar atrapadas o inflar un único pago.
2. **En el último hito el divisor es 1**, así que se lleva el residuo de todas
   las divisiones enteras anteriores. El depósito acaba exactamente en cero.

**Ejemplo trabajado** (el del test `libera el depósito dividido entre los hitos que faltan`):

| Paso | Recaudado | Depósito antes | Divisor | Se libera | Depósito después |
|---|---|---|---|---|---|
| Donan 600 + 400 | 1.000 | 1.000 | — | — | 1.000 |
| Aprueban hito 1 | 1.000 | 1.000 | 4 | **250** | 750 |
| Donan 200 más | 1.200 | 950 | — | — | 950 |
| Aprueban hito 2 | 1.200 | 950 | 3 | **316,666666** | 633,333334 |

La donación tardía de 200 no se pierde: engorda el depósito y se reparte entre
los tres hitos que quedaban.

### Reembolso

Al declarar el fallo se congela `refundPool = depósito actual`. Cada donante
reclama:

```
reembolso = refundPool × aportado / totalRecaudado
```

La foto es imprescindible. Sin ella, `refundPool` bajaría con cada reclamo y
quien llegara primero se llevaría de más.

Siguiendo el ejemplo anterior, si el proyecto falla ahí:

| Donante | Aportado | Cálculo | Recibe |
|---|---|---|---|
| A | 800 | 633,333334 × 800/1200 | 422,222222 |
| B | 400 | 633,333334 × 400/1200 | 211,111111 |
| | | | **633,333333** |

Queda **1 unidad base** (0,000001 USDC) atrapada en el contrato por las
divisiones enteras. Es un residuo conocido y documentado; no se barre para no
añadir una función privilegiada capaz de mover fondos.

---

## Decisiones de seguridad

### Checks-Efectos-Interacciones, y además `nonReentrant`

Todas las funciones que transfieren tokens escriben el estado completo antes
de la llamada externa, y llevan el guardia de reentrada. El cinturón y los
tirantes: el patrón CEI ya basta, pero el guardia protege de un futuro cambio
que reordene las líneas sin querer.

`claimRefund` marca `hasClaimedRefund = true` **antes** de transferir. Un token
con ganchos de transferencia que devuelva el control al donante en medio del
pago encuentra la bandera ya puesta.

Cubierto por el test `bloquea la reentrada en claimRefund`, que despliega un
token con gancho y un donante malicioso que intenta reentrar de verdad.

### Reembolsos en modo pull

El contrato nunca recorre una lista de direcciones empujando dinero. Un solo
receptor que revierta bloquearía a todos los demás. Cada donante reclama lo
suyo cuando quiere.

### La pausa no atrapa el dinero

`pause()` frena `donate`, `createProject`, `submitMilestone` y
`approveMilestone`. **No frena `claimRefund`.** Pausar debe cortar la entrada
de dinero, no encerrar el que ya está dentro.

### Tokens con comisión

`donate` mide el saldo antes y después de la transferencia y anota lo
realmente recibido:

```solidity
uint256 balanceBefore = token.balanceOf(address(this));
token.safeTransferFrom(msg.sender, address(this), amount);
uint256 received = token.balanceOf(address(this)) - balanceBefore;
```

Si se anotara el nominal, un token que cobra comisión dejaría al contrato
debiendo dinero que nunca recibió, y los últimos en reclamar se quedarían sin
nada. Cubierto por el test con `FeeOnTransferToken` (1% de comisión).

### Conversiones de tipo

Solidity 0.8 comprueba los desbordamientos aritméticos pero **no** las
conversiones explícitas: `uint128(x)` trunca en silencio. Se usa
`SafeCast.toUint128` en todas.

### Sin datos personales

En la cadena solo viven el hash del slug, direcciones y URIs de evidencia. La
identidad vive fuera.

---

## Limitaciones conocidas

| Limitación | Por qué está y cómo se resuelve |
|---|---|
| **El verificador está centralizado** | Es el punto de confianza pendiente. La vía natural es que los donantes voten la aprobación del hito, con quórum ponderado por aporte. |
| **Residuo de 1 unidad por división entera** | Despreciable (10⁻⁶ USDC). Barrerlo exigiría una función privilegiada que mueva fondos, que es peor. |
| **El líder puede no presentar nunca un hito** | El dinero queda bloqueado hasta que el verificador declare el fallo. Falta un vencimiento automático. |
| **Sin reparto automático entre integrantes** | El líder recibe la liberación y reparte fuera de la cadena. Está en el roadmap de la fase 2. |
| **Sin anti-sybil** | No hace falta mientras no haya *matching* de fondos. Es obligatorio antes de introducir quadratic funding. |
| **No auditado** | MVP de testnet. |

---

## Cobertura de tests

26 casos en `contracts/test/CrewdFunding.test.ts`:

| Grupo | Cubre |
|---|---|
| Despliegue | Token, roles iniciales, rechazo de dirección cero, decimales del token |
| `createProject` | Registro, índice por slug, control de acceso, validación de hitos, slug vacío y duplicado |
| `donate` | Contabilidad, importe cero, proyecto inexistente, proyecto fallido |
| `submitMilestone` | Solo el líder, evidencia vacía, índice fuera de rango, reenvío tras rechazo, bloqueo tras aprobación |
| `approveMilestone` | Control de acceso, hito no presentado, **matemáticas del reparto**, donación tardía, completado y depósito en cero |
| Fallo y reembolso | Reparto proporcional exacto, doble reclamo, no donante, proyecto activo, control de acceso |
| Pausa | Bloquea donaciones, **nunca bloquea reembolsos**, control de acceso |
| Seguridad | **Reentrada con token con gancho**, **contabilidad con token con comisión** |

Los importes se comprueban exactos, no con tolerancia: la división entera es
parte del contrato y su residuo está documentado, así que cualquier cambio en
esa aritmética debe romper el test.

```bash
cd contracts && npm test
```

---

## MockUSDC

Stablecoin de prueba. **Solo testnet.**

- **6 decimales**, igual que el USDC real. La mayoría de los tokens de ejemplo
  usan 18 y eso esconde la clase de bug más común al integrar stablecoins:
  multiplicar por `1e18` en vez de `1e6` y mover un billón de veces la
  cantidad correcta, sin que nada lance un error.
- **Grifo público**: `faucet()` entrega 1.000 mUSDC, una vez por hora y por
  dirección. Sin control de acceso a propósito — el objetivo es que cualquiera
  pueda probar el flujo sin depender de un grifo externo que puede estar caído
  el día de la demo.

En producción se apunta al USDC real (`0xaf88d065e77c8cC2239327C5EDb3A432268e5831`
en Arbitrum One) mediante la variable `STABLECOIN_ADDRESS` del script de
despliegue.
