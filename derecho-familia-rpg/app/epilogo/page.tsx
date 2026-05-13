"use client";
import { useGame } from "@/store/useGame";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Epilogo() {
  const { epilogo, personaje, reset } = useGame();

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
        <div className="tag mb-4">FOLIO FINAL — EPÍLOGO PATRIMONIAL</div>
        <h1 className="label-art text-4xl text-neon-blue glitch-text mb-8">{personaje.nombre || "Compareciente"}</h1>

        <div className="doc p-8 font-serif whitespace-pre-line text-base leading-relaxed">
          {epilogo || "No hay epílogo aún. Completa la liquidación para conocer tu destino."}
        </div>

        <div className="mt-10 flex gap-3">
          <button className="btn btn-danger" onClick={() => { reset(); window.location.href = "/"; }}>↺ Nueva partida</button>
          <Link href="/codex" className="btn">📜 Codex</Link>
        </div>
      </motion.div>
    </main>
  );
}
