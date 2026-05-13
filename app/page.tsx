"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [haveSave, setHaveSave] = useState(false);
  useEffect(() => {
    setMounted(true);
    try { setHaveSave(!!localStorage.getItem("derecho-familia-rpg-save")); } catch {}
  }, []);
  if (!mounted) {
    return <main className="min-h-screen flex items-center justify-center text-neon-blue label-art">CARGANDO EXPEDIENTE…</main>;
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:linear-gradient(rgba(0,229,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,.18)_1px,transparent_1px)] [background-size:32px_32px]" />
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center max-w-4xl"
      >
        <div className="tag mb-6">EXPEDIENTE N° 1725-2026 / FORO INTERIOR</div>
        <h1 className="label-art text-5xl md:text-7xl text-neon-blue glitch-text mb-4">
          DERECHO DE FAMILIA
        </h1>
        <h2 className="font-serif italic text-parchment/80 text-xl md:text-2xl mb-8">
          Un RPG narrativo sobre el matrimonio, la propiedad y el dolor patrimonial.
        </h2>
        <p className="text-parchment/60 max-w-2xl mx-auto mb-10 text-sm leading-relaxed">
          Crea un personaje. Cásate. Confunde patrimonios. Genera recompensas. Sé demandado.
          Demanda. Liquida la sociedad conyugal. Sobrevive al epílogo.
          <br />
          <span className="text-neon-violet">Basado en el Código Civil chileno, la Ley de Matrimonio Civil y la Ley de Tribunales de Familia.</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/creacion" className="btn">▶ Nueva partida</Link>
          {haveSave && <Link href="/juego" className="btn">▶ Continuar expediente</Link>}
          <Link href="/codex" className="btn">📜 Codex jurídico</Link>
        </div>
        <div className="divider my-12" />
        <div className="grid md:grid-cols-3 gap-4 text-left text-xs text-parchment/60">
          <Feature icon="⚖️" t="Juicios como batallas" d="Audiencias con turnos, pruebas, atributos. Persuasión vs. inteligencia jurídica." />
          <Feature icon="🏠" t="Clasificación viva" d="Cada bien es disputado en tiempo real. Haber absoluto, relativo, propio, reservado." />
          <Feature icon="🧬" t="Hijos que recuerdan" d="Filiación, alimentos, cuidado personal. Tus decisiones los marcan para siempre." />
        </div>
      </motion.div>
      <footer className="absolute bottom-3 text-[10px] uppercase tracking-widest text-parchment/30">
        v1.0 — build notarial / arts. 102, 135, 1725, 1726, 1736, 1749, 55 LMC, 61 LMC.
      </footer>
    </main>
  );
}

function Feature({ icon, t, d }: { icon: string; t: string; d: string }) {
  return (
    <div className="terminal p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="label-art text-neon-blue text-sm mb-1">{t}</div>
      <div className="text-parchment/60">{d}</div>
    </div>
  );
}
