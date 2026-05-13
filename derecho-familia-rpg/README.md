# EXPEDIENTE 1725/2026 — Derecho de Familia RPG

**Disco Elysium + Código Civil chileno.** Un RPG narrativo web sobre matrimonio, sociedad conyugal, filiación, divorcio, nulidad, compensación económica y liquidación, basado en el Código Civil chileno, la Ley de Matrimonio Civil (Ley 19.947) y la Ley de Tribunales de Familia.

Estética: minimalismo cyberpunk-notarial, CRT, glitch jurídico, neon azul/violeta sobre negro.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript** estricto
- **TailwindCSS** + CSS personalizado
- **Framer Motion** (animaciones)
- **Zustand + persist** (estado y guardado en `localStorage`)
- **Vercel-ready** (sin backend obligatorio)

---

## Estructura

```
derecho-familia-rpg/
├─ app/
│  ├─ page.tsx               # Pantalla de título
│  ├─ creacion/              # Creación de personaje (origen, profesión, atributos)
│  ├─ juego/                 # Mapa-hub del expediente
│  ├─ mundo/[id]/            # Cada uno de los 8 mundos
│  ├─ liquidacion/           # Boss final patrimonial
│  ├─ epilogo/               # Epílogo procedural
│  ├─ codex/                 # Codex jurídico (artículos, doctrina mínima)
│  ├─ inventario/            # Inventario, recompensas, hijos, flags
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ DialogoEscena.tsx      # Sistema de diálogo Disco-Elysium-like
│  ├─ MatrimonioPanel.tsx    # Elección de régimen
│  ├─ ClasificadorBienes.tsx # Minijuego de clasificación (haber absoluto/relativo/propio)
│  ├─ HijosPanel.tsx         # Filiación, alimentos, cuidado personal
│  ├─ CrisisPanel.tsx        # Infidelidad, VIF, simulación, ruptura
│  ├─ SeparacionPanel.tsx    # Cese de convivencia, divorcio (54/55 LMC)
│  └─ NulidadPanel.tsx       # Causales y matrimonio putativo
├─ lib/reglas.ts             # Reglas patrimoniales (arts. 1725 y ss.)
├─ data/dialogos.ts          # Escenas y opciones
├─ store/useGame.ts          # Zustand store con persistencia
├─ types/game.ts             # Tipos
├─ tailwind.config.ts
├─ next.config.js
├─ tsconfig.json
├─ vercel.json
└─ package.json
```

---

## Sistemas de juego

1. **Creación de personaje** — origen social, profesión, 6 atributos (persuasión, honestidad, impulsividad, inteligencia jurídica, empatía, resistencia emocional). Cada origen/profesión modifica atributos y nivel económico.
2. **Diálogos con chequeos de atributos** — al estilo Disco Elysium. Opciones bloqueadas si no se cumple el umbral. Efectos: flags narrativos, reputación, trauma, atributos.
3. **Clasificador de bienes** — núcleo pedagógico. Cada bien se clasifica entre haber absoluto, haber relativo, propio del marido/mujer, reservado art. 150, o familiar. La clasificación correcta genera entradas reales en el inventario y, cuando procede, anotaciones en el libro de recompensas.
4. **Régimen patrimonial** — sociedad conyugal, separación total o participación en gananciales. Cada uno funciona como una "clase".
5. **Hijos vivos** — nacen, crecen, recuerdan. Cada decisión (no pagar alimentos, no reconocer) deja recuerdos y trauma persistentes.
6. **Crisis matrimonial** — infidelidad, simulación de venta, VIF, alcoholismo, ruptura definitiva. Cada flag procesal habilita o bloquea causales de divorcio.
7. **Separación y divorcio** — el juez evalúa los flags acumulados (cese acreditado, prueba de culpa) y dicta sentencia.
8. **Nulidad y matrimonio putativo** — causales art. 5–8, 17 LMC; efectos del art. 51 LMC.
9. **Liquidación (boss final)** — 6 fases: inventario, tasación, recompensas, partición, adjudicación, inscripción conservatoria.
10. **Epílogo procedural** — texto generado según flags, trauma, reputación, hijos en mora, fraude patrimonial, bigamia, etc. Humor negro jurídico.

---

## Cómo ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

---

## Cómo subir a GitHub

1. Crea un repo nuevo en GitHub (vacío, sin README).
2. Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "feat: derecho de familia RPG v1"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/derecho-familia-rpg.git
git push -u origin main
```

**Archivos que SÍ subir:** todo lo que está en la carpeta (gracias al `.gitignore`).
**Archivos que NO se suben (automático por .gitignore):** `node_modules/`, `.next/`, `.vercel/`, `.env*`, `out/`.

---

## Cómo desplegar en Vercel

### Opción A — UI web (recomendada)

1. Ve a https://vercel.com/new.
2. Importa el repo `derecho-familia-rpg` desde GitHub.
3. Vercel detectará Next.js automáticamente. **No cambies nada**:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output: (automático)
   - Install Command: `npm install`
4. Click **Deploy**.
5. En ~1 min tendrás `https://derecho-familia-rpg.vercel.app`.

### Opción B — CLI

```bash
npm i -g vercel
vercel login
vercel        # primer deploy (preview)
vercel --prod # deploy a producción
```

---

## Aviso pedagógico

El juego es una **simplificación didáctica**. No reemplaza la lectura del Código Civil chileno, de la Ley 19.947, ni la jurisprudencia. Cita los artículos para que el jugador los reconozca, pero las reglas implementadas son una versión funcional, no un dictamen.

> "Murió esperando inscripción conservatoria mientras litigaba una recompensa derivada de una subrogación defectuosa."
