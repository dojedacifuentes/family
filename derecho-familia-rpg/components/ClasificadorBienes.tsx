"use client";
import { useMemo, useState } from "react";
import { useGame } from "@/store/useGame";
import { clasificarBien } from "@/lib/reglas";
import type { Bien, ClaseBien } from "@/types/game";
import { motion, AnimatePresence } from "framer-motion";

type Caso = {
  nombre: string;
  valor: number;
  fuente: Bien["fuente"];
  adquiridoAntesDelMatrimonio?: boolean;
  pista: string;
};

const CASOS: Caso[] = [
  { nombre: "Sueldo de marzo (trabajo dependiente)", valor: 1500, fuente: "trabajo", pista: "Producto del trabajo durante la vigencia." },
  { nombre: "Casa heredada del abuelo (durante el matrimonio)", valor: 80000, fuente: "herencia", pista: "Título gratuito. Inmueble." },
  { nombre: "Auto comprado el año pasado, casado", valor: 12000, fuente: "compra", pista: "Título oneroso durante vigencia." },
  { nombre: "Mil libros aportados al casarse", valor: 3000, fuente: "compra", adquiridoAntesDelMatrimonio: true, pista: "Muebles aportados al matrimonio." },
  { nombre: "Frutos del fundo propio (cosecha)", valor: 4000, fuente: "frutos", pista: "Frutos de bienes propios y sociales." },
  { nombre: "Indemnización por accidente laboral del marido", valor: 6000, fuente: "indemnizacion", pista: "Indemnización durante vigencia." },
  { nombre: "Departamento adquirido subrogando uno propio anterior", valor: 70000, fuente: "subrogacion", pista: "Subrogación real (arts. 1727–1733)." },
  { nombre: "Joyas donadas por una tía durante el matrimonio", valor: 2000, fuente: "donacion", pista: "Mueble adquirido a título gratuito." },
];

const CLASES: { id: ClaseBien; nombre: string; color: string }[] = [
  { id: "haber_absoluto", nombre: "Haber Absoluto", color: "border-neon-blue text-neon-blue" },
  { id: "haber_relativo", nombre: "Haber Relativo (con recompensa)", color: "border-neon-violet text-neon-violet" },
  { id: "propio_marido", nombre: "Propio Marido", color: "border-neon-amber text-neon-amber" },
  { id: "propio_mujer", nombre: "Propio Mujer", color: "border-neon-amber text-neon-amber" },
  { id: "reservado_art150", nombre: "Reservado Art. 150", color: "border-neon-cyan text-neon-cyan" },
  { id: "familiar", nombre: "Bien Familiar", color: "border-neon-red text-neon-red" },
];

export default function ClasificadorBienes() {
  const game = useGame();
  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState<null | { ok: boolean; justif: string; art: string }>(null);
  const [aciertos, setAciertos] = useState(0);

  const caso = CASOS[i];
  const correcta = useMemo(() => (caso ? clasificarBien(caso as any) : null), [caso]);

  if (!caso) {
    return (
      <div className="terminal p-6">
        <h2 className="label-art text-neon-blue text-xl mb-3">Clasificación completa</h2>
        <p className="text-parchment/70 text-sm mb-4">
          Resultado: <b className="text-neon-cyan">{aciertos}</b> de <b>{CASOS.length}</b> aciertos.
          {aciertos === CASOS.length && " Tu intuición patrimonial es notarial."}
        </p>
        <p className="text-parchment/60 text-xs">Los bienes correctamente clasificados se han registrado en tu inventario.</p>
      </div>
    );
  }

  function elegir(c: ClaseBien) {
    const ok = correcta!.clase === c;
    setFeedback({ ok, justif: correcta!.justificacion, art: correcta!.articulo });
    if (ok) {
      setAciertos((a) => a + 1);
      game.ajustarAtributo("inteligencia_juridica", 1);
      const bien: Bien = {
        id: `b${Date.now()}-${i}`,
        nombre: caso.nombre,
        valor: caso.valor,
        fuente: caso.fuente,
        adquiridoAntesDelMatrimonio: caso.adquiridoAntesDelMatrimonio,
        clase: correcta!.clase,
        generaRecompensa: correcta!.recompensa,
      };
      game.addBien(bien);
      if (correcta!.recompensa > 0) {
        game.addRecompensa({
          id: `r${Date.now()}-${i}`,
          acreedor: "marido",
          deudor: "sociedad",
          monto: correcta!.recompensa,
          motivo: `Por ${caso.nombre} — ${correcta!.articulo}`,
        });
      }
      game.pushLog(`Clasificaste correctamente: ${caso.nombre} → ${correcta!.clase}`, correcta!.articulo);
    } else {
      game.ajustarTrauma(2);
      game.pushLog(`Error de clasificación en ${caso.nombre}. La doctrina te juzga.`, "GLITCH");
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="label-art text-neon-blue text-xl">Clasificación del Haber</h2>
      <p className="text-parchment/60 text-xs">
        ¿A qué partida ingresa este bien? Razona conforme a los arts. 1725 y ss.
      </p>

      <div className="terminal p-5">
        <div className="text-xs tag mb-2">CASO {i + 1} / {CASOS.length}</div>
        <div className="text-parchment text-lg label-art">{caso.nombre}</div>
        <div className="text-parchment/60 text-xs mt-1">Valor: ${caso.valor.toLocaleString()} · Fuente: {caso.fuente} {caso.adquiridoAntesDelMatrimonio ? "· antes del matrimonio" : "· durante el matrimonio"}</div>
        <div className="text-neon-violet text-xs italic mt-3">Pista: {caso.pista}</div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        {CLASES.map((c) => (
          <button
            key={c.id}
            disabled={!!feedback}
            onClick={() => elegir(c.id)}
            className={`p-3 border ${c.color} text-xs uppercase tracking-widest disabled:opacity-40`}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`terminal p-4 ${feedback.ok ? "border-neon-blue" : "border-neon-red"}`}
          >
            <div className={`label-art ${feedback.ok ? "text-neon-blue" : "text-neon-red"}`}>
              {feedback.ok ? "✓ Clasificación correcta" : "✗ Clasificación incorrecta"}
            </div>
            <div className="text-parchment/80 text-xs mt-2">{feedback.justif}</div>
            <div className="tag tag-violet mt-2">{feedback.art}</div>
            <button
              className="btn mt-3"
              onClick={() => { setFeedback(null); setI((x) => x + 1); }}
            >
              ▸ Siguiente caso
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
