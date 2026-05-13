"use client";
import Link from "next/link";
import { useGame } from "@/store/useGame";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Mundo } from "@/types/game";

const MAPA: { id: Mundo; titulo: string; subt: string; req?: string }[] = [
  { id: "noviazgo", titulo: "I · El Noviazgo Precontractual", subt: "Esponsales, capacidad, vicios del consentimiento." },
  { id: "matrimonio", titulo: "II · El Matrimonio", subt: "Régimen patrimonial. Capitulaciones.", req: "regimen" },
  { id: "haber", titulo: "III · El Haber", subt: "Clasifica bienes. Genera recompensas.", req: "casado" },
  { id: "hijos", titulo: "IV · Filiación", subt: "Hijos, alimentos, cuidado personal.", req: "casado" },
  { id: "crisis", titulo: "V · Crisis matrimonial", subt: "Infidelidad, VIF, ocultamiento.", req: "casado" },
  { id: "separacion", titulo: "VI · Separación y divorcio", subt: "Cese de convivencia, art. 55 LMC.", req: "casado" },
  { id: "nulidad", titulo: "VII · Nulidad y matrimonio putativo", subt: "Realidad jurídica glitcheada.", req: "casado" },
  { id: "liquidacion", titulo: "VIII · Liquidación", subt: "Boss final patrimonial.", req: "ruptura" },
];

export default function Juego() {
  const router = useRouter();
  const { personaje, flags, hijos, bienes, log, recompensas, conyuge, finalizado } = useGame();

  useEffect(() => {
    if (!personaje.nombre) router.replace("/creacion");
    if (finalizado) router.replace("/epilogo");
  }, [personaje.nombre, finalizado, router]);

  if (!personaje.nombre) return null;

  const casado = personaje.estadoCivil === "casado";
  const hayRegimen = !!personaje.regimen;
  const ruptura = flags.includes("ruptura_definitiva") || personaje.estadoCivil === "divorciado" || personaje.estadoCivil === "nulidad";

  function puede(req?: string) {
    if (!req) return true;
    if (req === "regimen") return flags.includes("consentimiento_valido") || hayRegimen;
    if (req === "casado") return casado;
    if (req === "ruptura") return ruptura;
    return true;
  }

  return (
    <main className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <div className="tag mb-2">EXPEDIENTE ABIERTO</div>
          <h1 className="label-art text-2xl text-neon-blue">{personaje.nombre}</h1>
          <p className="text-parchment/60 text-xs uppercase tracking-widest">
            {personaje.profesion} · {personaje.origen} · estado civil: {personaje.estadoCivil}
            {personaje.regimen ? ` · ${personaje.regimen.replace(/_/g, " ")}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/codex" className="btn">📜 Codex</Link>
          <Link href="/inventario" className="btn">📦 Inventario</Link>
          <Link href="/" className="btn btn-danger">⏻ Salir</Link>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-4 mb-6">
        <Stat label="Reputación" value={personaje.reputacion} min={-100} max={100} color="violet" />
        <Stat label="Trauma" value={personaje.trauma} min={0} max={100} color="red" />
        <Stat label="Nivel económico" value={personaje.nivelEconomico} min={0} max={100} color="blue" />
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-8">
        {MAPA.map((m) => {
          const habilitado = puede(m.req);
          return (
            <motion.div key={m.id} whileHover={{ y: -2 }}>
              <Link
                href={habilitado ? `/mundo/${m.id}` : "#"}
                className={`block terminal p-5 ${!habilitado ? "opacity-40 pointer-events-none" : ""}`}
              >
                <div className="label-art text-neon-cyan text-lg">{m.titulo}</div>
                <div className="text-parchment/60 text-xs mt-1">{m.subt}</div>
                {!habilitado && <div className="tag tag-amber mt-3">BLOQUEADO</div>}
              </Link>
            </motion.div>
          );
        })}
      </section>

      <section className="terminal p-4 mb-8">
        <div className="label-art text-neon-violet text-sm mb-2">Registro del expediente</div>
        <div className="max-h-40 overflow-y-auto text-xs text-parchment/70 space-y-1">
          {log.length === 0 && <div className="italic text-parchment/40">Sin actuaciones. Pronto la lluvia jurídica caerá.</div>}
          {log.map((l, i) => (
            <div key={i}>
              <span className="text-neon-blue">›</span> {l.texto}
              {l.tag && <span className="ml-2 tag">{l.tag}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-3 text-xs">
        <div className="terminal p-3"><b className="text-neon-cyan">{bienes.length}</b> bienes registrados</div>
        <div className="terminal p-3"><b className="text-neon-cyan">{hijos.length}</b> hijos · {hijos.filter(h=>!h.alimentosAlDia).length} con alimentos pendientes</div>
        <div className="terminal p-3"><b className="text-neon-cyan">{recompensas.length}</b> recompensas en libro</div>
      </section>
    </main>
  );
}

function Stat({ label, value, min, max, color }: { label: string; value: number; min: number; max: number; color: "violet" | "red" | "blue" }) {
  const pct = ((value - min) / (max - min)) * 100;
  const c = color === "violet" ? "bg-neon-violet" : color === "red" ? "bg-neon-red" : "bg-neon-blue";
  return (
    <div className="terminal p-4">
      <div className="flex justify-between text-xs uppercase tracking-widest mb-2">
        <span>{label}</span><span className="text-parchment/70">{value}</span>
      </div>
      <div className="h-2 bg-ink-700">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={`h-full ${c}`} />
      </div>
    </div>
  );
}
