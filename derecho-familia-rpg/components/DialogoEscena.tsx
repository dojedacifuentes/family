"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/store/useGame";
import type { Escena } from "@/data/dialogos";

export default function DialogoEscena({ escena, onFin }: { escena: Escena; onFin?: () => void }) {
  const [idx, setIdx] = useState(0);
  const [eligio, setEligio] = useState<number | null>(null);
  const game = useGame();

  const lineaActual = escena.lineas[idx];
  const finLineas = idx >= escena.lineas.length - 1;

  function elegir(i: number) {
    const op = escena.opciones[i];
    if (op.requiere) {
      const atr = op.requiere.atributo;
      if (atr && game.personaje.atributos[atr] < (op.requiere.minimo ?? 0)) {
        game.pushLog(`Intentaste «${op.texto}» pero te faltó ${atr}.`, "FALLO");
        return;
      }
    }
    if (op.efectos) {
      op.efectos.flags?.forEach((f) => game.setFlag(f));
      if (op.efectos.atributos) {
        (Object.entries(op.efectos.atributos) as [keyof typeof game.personaje.atributos, number][]).forEach(([k, v]) =>
          game.ajustarAtributo(k, v)
        );
      }
      if (op.efectos.reputacion) game.ajustarReputacion(op.efectos.reputacion);
      if (op.efectos.trauma) game.ajustarTrauma(op.efectos.trauma);
      if (op.efectos.log) game.pushLog(op.efectos.log, escena.id.toUpperCase());
    }
    setEligio(i);
  }

  return (
    <div className="terminal p-6 max-w-3xl mx-auto">
      <div className="tag mb-3">{escena.titulo}</div>
      <p className="text-parchment/60 italic text-sm mb-4">{escena.ambientacion}</p>
      {escena.articulo && (
        <div className="border-l-2 border-neon-violet pl-3 mb-4 text-xs text-neon-violet">
          ART. {escena.articulo.n} — {escena.articulo.t}
        </div>
      )}
      {escena.speaker && <div className="text-neon-cyan label-art mb-2">{escena.speaker}</div>}

      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-parchment text-base leading-relaxed min-h-[5rem]"
        >
          {lineaActual}
        </motion.p>
      </AnimatePresence>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xs text-parchment/40">{idx + 1} / {escena.lineas.length}</div>
        {!finLineas && (
          <button className="btn" onClick={() => setIdx((i) => i + 1)}>▸ Siguiente</button>
        )}
      </div>

      {finLineas && eligio === null && (
        <div className="mt-6 space-y-2">
          <div className="divider my-3" />
          {escena.opciones.map((op, i) => {
            const atr = op.requiere?.atributo;
            const min = op.requiere?.minimo ?? 0;
            const tieneAtr = atr ? game.personaje.atributos[atr] : 99;
            const cumple = !atr || tieneAtr >= min;
            return (
              <button
                key={i}
                onClick={() => elegir(i)}
                className={`block w-full text-left p-3 border ${cumple ? "border-neon-blue/40 hover:bg-neon-blue/10" : "border-neon-red/40 text-neon-red/70"}`}
              >
                {op.texto}
                {atr && (
                  <span className="ml-2 text-[10px] uppercase tracking-widest opacity-60">
                    req {atr} {min} (tienes {tieneAtr})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {eligio !== null && (
        <div className="mt-6">
          <div className="divider mb-3" />
          <p className="text-neon-cyan text-sm">› {escena.opciones[eligio].efectos?.log || "Decisión registrada."}</p>
          <button className="btn mt-4" onClick={onFin}>▸ Continuar</button>
        </div>
      )}
    </div>
  );
}
