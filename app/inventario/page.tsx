"use client";
import Link from "next/link";
import { useGame } from "@/store/useGame";

export default function Inventario() {
  const { bienes, recompensas, hijos, flags, conyuge, personaje } = useGame();

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="label-art text-3xl text-neon-blue">📦 Inventario del expediente</h1>
        <Link href="/juego" className="btn">◂ Mapa</Link>
      </div>

      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="terminal p-4">
          <div className="label-art text-neon-cyan mb-2">Cónyuge</div>
          {conyuge ? (
            <div className="text-xs space-y-1">
              <div>Nombre: <b>{conyuge.nombre}</b></div>
              <div>Afecto: <b className={conyuge.afecto > 0 ? "text-neon-blue" : "text-neon-red"}>{conyuge.afecto}</b></div>
              <div>Confianza: <b>{conyuge.confianza}</b></div>
              <div>Infidelidades: <b>{conyuge.infidelidades}</b></div>
              <div>VIF: {conyuge.vif ? "sí" : "no"}</div>
            </div>
          ) : <p className="text-parchment/40 italic">Sin cónyuge registrado.</p>}
        </div>
        <div className="terminal p-4">
          <div className="label-art text-neon-cyan mb-2">Personaje</div>
          <div className="text-xs space-y-1">
            <div>{personaje.nombre} · {personaje.profesion}</div>
            <div>Estado civil: <b>{personaje.estadoCivil}</b></div>
            <div>Régimen: <b>{personaje.regimen?.replace(/_/g, " ") || "—"}</b></div>
            <div>Reputación: {personaje.reputacion} · Trauma: {personaje.trauma}</div>
          </div>
        </div>
      </section>

      <section className="terminal p-4 mb-4">
        <div className="label-art text-neon-violet mb-3">Bienes ({bienes.length})</div>
        <table className="w-full text-xs">
          <thead className="text-parchment/50">
            <tr><th className="text-left">Bien</th><th>Clase</th><th className="text-right">Valor</th><th className="text-right">Recompensa</th></tr>
          </thead>
          <tbody>
            {bienes.map((b) => (
              <tr key={b.id} className="border-b border-ink-400">
                <td>{b.nombre}{b.oculto && <span className="ml-2 tag tag-red">OCULTO</span>}</td>
                <td className="text-center text-neon-cyan">{b.clase}</td>
                <td className="text-right">${b.valor.toLocaleString()}</td>
                <td className="text-right text-neon-violet">{b.generaRecompensa ? `$${b.generaRecompensa.toLocaleString()}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="terminal p-4 mb-4">
        <div className="label-art text-neon-violet mb-3">Libro de recompensas ({recompensas.length})</div>
        {recompensas.map((r) => (
          <div key={r.id} className="text-xs border-b border-ink-400 py-2">
            <b>{r.deudor} → {r.acreedor}</b>: ${r.monto.toLocaleString()} — {r.motivo}
          </div>
        ))}
      </section>

      <section className="terminal p-4 mb-4">
        <div className="label-art text-neon-violet mb-3">Hijos ({hijos.length})</div>
        {hijos.map((h) => (
          <div key={h.id} className="text-xs border-b border-ink-400 py-2 flex justify-between">
            <span><b>{h.nombre}</b> · {h.edad} años · {h.filiacion}</span>
            <span>{h.alimentosAlDia ? "alimentos al día" : <span className="text-neon-red">en mora</span>}</span>
          </div>
        ))}
      </section>

      <section className="terminal p-4">
        <div className="label-art text-neon-violet mb-3">Flags narrativos ({flags.length})</div>
        <div className="flex flex-wrap gap-1">
          {flags.map((f) => <span key={f} className="tag">{f}</span>)}
        </div>
      </section>
    </main>
  );
}
