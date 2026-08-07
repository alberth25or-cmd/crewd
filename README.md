# Crewd

> Encuentra tu equipo. Termina lo que empiezas. Que quede probado.

Plataforma donde cualquiera puede proponer un proyecto real, reclutar el equipo
que necesita y llevarlo hasta el final — construyendo en el camino una
reputación verificable de lo que efectivamente entregó.

**Estado:** prototipo. La interfaz está completa; la capa on-chain es un MVP
desplegable en Arbitrum Sepolia. Nada de esto ha sido auditado ni debe manejar
dinero real.

---

## Qué resuelve

Existe muchísima gente con habilidades reales y sin forma de demostrarlas.
Cuando intentan resolverlo por su cuenta chocan con tres muros: no encuentran
equipo, los proyectos colaborativos se desintegran, y nada de lo que hacen
queda registrado.

Crewd ataca el tercero de forma verificable y el segundo de forma estructural:

- **La reputación se gana durante el proyecto, no al final.** Se evalúa al
  cierre de cada sprint, en dos ejes independientes (confiabilidad y
  habilidad), a ciegas y con revelación simultánea.
- **El dinero también se libera por tramos.** Los aportes quedan en un
  contrato que solo suelta fondos cuando un hito se verifica. Si el proyecto
  se detiene, lo no liberado vuelve a quien aportó.

---

## Stack

| Capa | Tecnología |
|---|---|
| Interfaz | Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion |
| Lectura on-chain | viem, desde componentes de servidor |
| Escritura on-chain | viem + wallet inyectada, solo en el flujo de donación |
| Contratos | Solidity 0.8.28, OpenZeppelin 5, Hardhat |
| Red | Arbitrum Sepolia (`chainId` 421614) |
| Despliegue | Vercel |

---

## Estructura

```
.
├── app/
│   ├── (marketing)/          Landing pública — cabecera de conversión
│   └── (app)/                Producto — barra lateral / navegación inferior
│       ├── inicio/           Panel del usuario
│       ├── proyectos/        Feed, detalle, crear, postular
│       ├── retos/            Micro-retos
│       ├── u/[handle]/       Perfil público
│       └── perfil/
├── components/
│   ├── shell/                Shells de aplicación y tema
│   ├── marketing/            Componentes de la landing
│   ├── funding/              Panel de tesorería y diálogo de donación
│   ├── ReputationField.tsx   Elemento firma: reputación en dos ejes
│   ├── EvaluationModal.tsx   Evaluación de sprint a ciegas
│   └── ui.tsx                Primitivas del sistema de diseño
├── lib/
│   ├── types.ts              Modelo de dominio
│   ├── data.ts               Datos semilla (sin base de datos en esta fase)
│   └── chain/                Configuración, decimales, lecturas, ABIs
├── contracts/                Workspace de Hardhat (paquete npm aparte)
│   ├── contracts/            CrewdFunding.sol, MockUSDC.sol
│   ├── test/                 26 casos, incluidos reentrancy y fee-on-transfer
│   ├── scripts/              deploy.ts, seed.ts
│   └── deployments/          Direcciones por red, versionadas
├── docs/
│   ├── ARQUITECTURA.md       Por qué está construido así
│   ├── CONTRATOS.md          Referencia del contrato y notas de seguridad
│   └── DESPLIEGUE.md         Guía paso a paso
└── yapeinterface/            Prototipo de diseño previo (referencia, no se compila)
```

---

## Arranque rápido

### Aplicación web

```bash
npm install
npm run dev            # http://localhost:3000
```

Funciona sin configurar nada. Sin variables de entorno la sección de
financiamiento muestra su estado "próximamente" y todo lo demás va igual.

### Contratos

```bash
cd contracts
npm install
npm test               # 26 casos
npm run deploy:local   # red efímera de Hardhat
```

### Conectar los dos

```bash
cd contracts
cp .env.example .env   # rellena DEPLOYER_PRIVATE_KEY
npm run deploy:sepolia
npm run seed:sepolia   # registra los proyectos del catálogo
```

El script imprime las variables listas para pegar en `.env.local` de la raíz.
Ver [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) para el detalle.

---

## Comandos

**Raíz (aplicación)**

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción con chequeo de tipos |
| `npx eslint app components lib` | Linter |

**`contracts/`**

| Comando | Qué hace |
|---|---|
| `npm test` | Suite completa |
| `npm run compile` | Compila |
| `npm run deploy:sepolia` | Despliega en Arbitrum Sepolia |
| `npm run seed:sepolia` | Registra los proyectos del catálogo |
| `npm run verify:sepolia -- <dirección> <args>` | Verifica el código en Arbiscan |

---

## Decisiones que conviene conocer antes de tocar el código

**La cadena es invisible salvo para el donante.** El constructor —usuario
primario— no ve wallets, direcciones ni jerga cripto en ninguna pantalla. El
diálogo de donación es el único punto donde aparece una wallet, y su código
solo se descarga si alguien lo abre.

**Las lecturas on-chain ocurren en el servidor.** El navegador nunca habla con
el RPC para leer: la página llega renderizada, un teléfono lento no espera una
petición extra, y la clave del proveedor no queda expuesta.

**Todo degrada.** Si no hay contratos configurados, o el RPC falla, o el
proyecto no tiene tesorería, la página se renderiza igual con un mensaje
explícito. Ninguna pantalla depende de que un nodo esté vivo.

**La gamificación mide finalización, no actividad.** No hay experiencia por
invitar amigos ni rachas por conectarse. Lo único que sube es haber cerrado
sprints y terminado proyectos. Es deliberado: premiar actividad produce
exactamente al colaborador que abandona en el tercer sprint.

**Los importes nunca pasan por `number`.** Se leen los decimales del token en
tiempo de ejecución y se opera con `BigInt`. La stablecoin de prueba usa 6
decimales a propósito, igual que USDC.

---

## Limitaciones conocidas

- **Los contratos no han sido auditados.** MVP de testnet.
- **El verificador de hitos está centralizado** en la plataforma. Es el punto
  de confianza pendiente; la vía natural es que los donantes voten.
- **No hay autenticación.** La aplicación entra siempre como el mismo usuario
  semilla. Los botones "Entrar" y "Empezar" llevan directo al producto.
- **No hay base de datos.** Los proyectos y perfiles son datos semilla
  tipados en `lib/data.ts`.
- **Pantallas pendientes:** splash, onboarding y panel de notificaciones.

---

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md) — cómo encajan las piezas y por qué
- [Contratos](docs/CONTRATOS.md) — referencia, matemáticas del reparto, seguridad
- [Despliegue](docs/DESPLIEGUE.md) — de cero a producción en Vercel
