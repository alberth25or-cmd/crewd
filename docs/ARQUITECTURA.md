# Arquitectura

Cómo encajan las piezas y, sobre todo, por qué están así.

---

## Vista general

```
┌─────────────────────────────────────────────────────────────┐
│  Navegador                                                  │
│                                                             │
│  ┌───────────────────────┐   ┌───────────────────────────┐  │
│  │ HTML ya renderizado   │   │ Diálogo de donación       │  │
│  │ (cifras on-chain      │   │ (único código de wallet,  │  │
│  │  incluidas)           │   │  carga bajo demanda)      │  │
│  └───────────────────────┘   └─────────────┬─────────────┘  │
└──────────────▲──────────────────────────────┼───────────────┘
               │ HTML                          │ firma
┌──────────────┴───────────────┐               │
│  Next.js en Vercel           │               │
│                              │               │
│  Componentes de servidor     │               │
│  lib/chain/read.ts (viem)    │               │
└──────────────┬───────────────┘               │
               │ RPC lectura                   │ RPC escritura
               ▼                               ▼
      ┌────────────────────────────────────────────┐
      │  Arbitrum Sepolia                          │
      │  CrewdFunding · MockUSDC                   │
      └────────────────────────────────────────────┘
```

Las lecturas van por el servidor. Las escrituras van directas del navegador a
la cadena, firmadas por la wallet del donante. El servidor nunca custodia una
clave ni firma nada.

---

## Grupos de rutas

Dos caras del mismo producto, cada una con su shell, separadas por grupos de
rutas de Next:

```
app/
├── (marketing)/     →  /            Landing pública
│   └── layout.tsx      Cabecera de conversión, pie, sin navegación de producto
└── (app)/           →  /inicio, /proyectos, /retos, /u/[handle], /perfil
    └── layout.tsx      Barra lateral en escritorio, navegación inferior en móvil
```

El grupo evita el condicional `if (esLanding)` dentro del shell, que provoca
parpadeo al hidratar y mezcla dos responsabilidades en un componente.

El shell del producto es responsive de verdad: por debajo de 1024 px es una
aplicación móvil con navegación inferior; por encima, una herramienta de
escritorio con barra lateral persistente. Mismas rutas, distinta densidad.

---

## La capa on-chain

### Por qué las lecturas van en el servidor

`lib/chain/read.ts` solo se ejecuta en componentes de servidor. Tres razones:

1. **La página llega con los datos dentro.** Importa para el SEO de la landing
   y para que un teléfono lento no espere una petición extra después de pintar.
2. **La URL del proveedor RPC no viaja al cliente.** Un RPC con clave se
   quemaría en horas si estuviera en el bundle.
3. **Un nodo caído no rompe la página.** Todo devuelve `null` o `[]` y la
   interfaz muestra un estado explícito.

`getFundingState` y `getFundingTrace` van envueltas en `cache()` de React, así
que varios componentes de la misma página comparten una sola lectura.

### Por qué la wallet solo está en el flujo de donante

El documento de producto dice que la cadena debe ser invisible: sin "Connect
Wallet", sin direcciones `0x…`, sin jerga cripto. Pero donar exige firmar.

La contradicción se resuelve separando por persona, no por pantalla:

- **El constructor** —usuario primario, 20-28 años, sin contexto cripto— no ve
  una wallet en ninguna pantalla del producto.
- **El donante** es otra persona con otra expectativa. Quien va a mover dinero
  espera que le pidan firmar.

Consecuencia técnica: **no hay proveedor global de web3**. Nada de wagmi
envolviendo la aplicación. `DonateDialog` crea sus clientes de viem cuando se
abre, así que ninguna otra página carga un kilobyte de código de wallet.

### Degradación en tres niveles

`FundingPanel` es el único punto que decide, y ninguno de los tres rompe la
página:

| Situación | Qué se ve |
|---|---|
| Sin variables de entorno | El hueco reservado de siempre: "se habilita más adelante" |
| Con contratos, proyecto sin tesorería | "Este proyecto todavía no tiene tesorería abierta" |
| Con tesorería | Cifras, reparto por hitos y trazabilidad |

Esto permite desplegar en Vercel **antes** de tener contratos, y evita que un
error de configuración tumbe páginas que no tienen nada que ver con la cadena.

### Decimales

`lib/chain/token.ts` lee `decimals()` del contrato en tiempo de ejecución y lo
cachea por `(chainId, dirección)` — nunca por símbolo, porque el mismo símbolo
tiene distintos decimales en distintas cadenas: USDT usa 6 en Ethereum y 18 en
BSC.

Los importes nunca pasan por `number`. `formatAmount` trabaja sobre la cadena
de texto que devuelve `formatUnits`, así que no pierde precisión con
cantidades grandes. `parseAmount` rechaza más decimales de los que el token
admite en vez de truncar en silencio.

---

## Dentro y fuera de la cadena

El modelo de dominio vive en `lib/types.ts` y los datos en `lib/data.ts`. La
cadena guarda lo mínimo:

| Concepto | Fuera de la cadena | En la cadena |
|---|---|---|
| Proyecto | Título, descripción, roadmap, roles, ODS | `keccak256(slug)`, líder, número de hitos |
| Persona | Nombre, ubicación, habilidades, historial | Nada. Solo direcciones |
| Reputación | Evaluaciones, dos ejes, distribución | Nada todavía — atestaciones son fase 2 |
| Dinero | Nada | Aportes, liberaciones, reembolsos, evidencias |

La bisagra es el hash del slug: `contracts/scripts/seed.ts` registra los
proyectos del catálogo, y `getFundingState(slug)` los recupera calculando el
mismo hash. Sin tabla de correspondencias que mantener sincronizada.

**Ningún dato personal va a la cadena.** Es una restricción del documento de
producto, no una casualidad de la implementación.

---

## El elemento firma

`components/ReputationField.tsx` renderiza la reputación como una nube de
puntos en un plano, no como estrellas ni barras.

Dos reglas del dominio lo obligan: los ejes de confiabilidad y habilidad son
explícitamente independientes ("un crack impuntual y un mediocre confiable no
pueden tener el mismo número"), y hay que mostrar la distribución, no la
media. Un promedio de estrellas viola las dos a la vez.

Detalle de implementación que costó un bug: la dispersión de los puntos usa un
hash entero (`Math.imul` y operadores de bits), **no** `Math.sin`. La
especificación de ECMAScript deja la precisión de las funciones trascendentes
a la implementación, así que Node y el navegador difieren alrededor del
decimal 11 — suficiente para romper la hidratación de React en cada punto.

---

## Sistema de diseño

Tokens en `app/globals.css`, sin dependencias de UI:

- **Ultramarina** para lo verificado y lo firmado. Azul pigmento, no azul
  corporativo: el producto vende credibilidad y el color hace trabajo.
- **Ámbar** para lo que necesita atención.
- **Rojo una sola vez en todo el sistema**: ghosting. Es la única penalización
  severa del dominio, así que es el único uso. Si "salida acordada" se viera
  igual de grave, la interfaz contradiría el producto.
- **Fraunces** para lo editorial, **IBM Plex Mono** para todo lo que sea dato.
  Los números de reputación nunca se renderizan en la tipografía de texto: son
  evidencia, no prosa.

Tema claro y oscuro por tokens CSS, oscuro por defecto, con un script en línea
que aplica la clase antes del primer pintado para que no haya destello.

---

## Qué falta

- Autenticación. La aplicación entra siempre como el mismo usuario semilla.
- Base de datos. Todo son datos semilla tipados.
- Indexador de eventos. `getFundingTrace` consulta el RPC directamente, lo que
  basta para un MVP pero no escala más allá de unos cientos de eventos.
- Vencimiento automático de hitos sin presentar.
- Splash, onboarding y panel de notificaciones.
