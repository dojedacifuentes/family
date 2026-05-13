"use client";
import { useGame } from "@/store/useGame";
import { liquidar } from "@/lib/reglas";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";

type Fase = "inventario" | "tasacion" | "recompensas" | "particion" | "adjudicacion" | "cierre";

const FASES: { id: Fase; titulo: string; desc: string; art: string }[] = [
  { id: "inventario", titulo: "Inventario y avalúo", desc: "Listar bienes sociales, propios y reservados.", art: "Art. 1765 CC" },
  { id: "tasacion", titulo: "Tasación", desc: "Determinar valores actuales.", art: "Art. 1335 CC" },
  { id: "recompensas", titulo: "Liquidación de recompensas", desc: "Compensación de créditos y deudas entre cónyuges y sociedad.", art: "Arts. 1769-1779 CC" },
  { id: "particion", titulo: "Partición de gananciales", desc: "División por mitades del haber líquido.", art: "Art. 1774 CC" },
  { id: "adjudicacion", titulo: "Adjudicación", desc: "Asignación concreta de bienes a cada hijuela.", art: "Art. 1337 CC" },
  { id: "cierre", titulo: "Inscripción y cierre", desc: "Inscripciones conservatorias y término del expediente.", art: "Conservador de Bienes Raíces" },
];

export default function LiquidacionPage() {
  const router = useRouter();
  const game = useGame();
  const [fase, setFase] = useState<Fase>("inventario");
  const [errores, setErrores] = useState(0);

  const calc = useMemo(() => liquidar(game.bienes), [game.bienes]);

  function siguiente() {
    const idx = FASES.findIndex((f) => f.id === fase);
    if (idx < FASES.length - 1) setFase(FASES[idx + 1].id);
    else cerrar();
  }

  function cerrar() {
    const epilogo = generarEpilogo(game, calc, errores);
    game.finalizar(epilogo);
    router.push("/epilogo");
  }

  const f = FASES.find((x) => x.id === fase)!;

  return (
    <main className="min-h-screen px-6 py-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <Link href="/juego" className="btn">◂ Mapa</Link>
        <div className="tag tag-red">BOSS FINAL · LIQUIDACIÓN</div>
      </header>

      <div className="terminal p-6 mb-4">
        <div className="flex gap-1 mb-4 flex-wrap">
          {FASES.map((x, i) => (
            <span key={x.id} className={`tag ${x.id === fase ? "tag-amber" : ""}`}>
              {i + 1}. {x.titulo}
            </span>
          ))}
        </div>
        <h1 className="label-art text-2xl text-neon-blue">{f.titulo}</h1>
        <p className="text-parchment/70 text-sm mt-1">{f.desc}</p>
        <div className="tag tag-violet mt-2">{f.art}</div>
      </div>

      {fase === "inventario" && (
        <Inventario bienes={game.bienes} onErr={() => setErrores((e) => e + 1)} />
      )}
      {fase === "tasacion" && (
        <Tasacion total={calc.totalSocial} />
      )}
      {fase === "recompensas" && (
        <Recompensas recompensas={game.recompensas} totalRec={calc.recompensas} />
      )}
      {fase === "particion" && (
        <Particion gananciales={calc.gananciales} cuota={calc.cuotaPorConyuge} />
      )}
      {fase === "adjudicacion" && (
        <Adjudicacion bienes={game.bienes} />
      )}
      {fase === "cierre" && (
        <div className="terminal p-6">
          <h2 className="label-art text-neon-cyan text-xl mb-2">Inscripción conservatoria</h2>
          <p className="text-parchment/70 text-sm mb-4">
            La adjudicación de inmuebles requiere inscripción en el Conservador de Bienes Raíces para producir tradición y oponibilidad.
            Mientras tanto, eres dueño imaginario.
          </p>
          <button className="btn btn-danger" onClick={cerrar}>▸ Firmar y cerrar el expediente</button>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button className="btn" onClick={siguiente}>▸ Avanzar fase</button>
      </div>
    </main>
  );
}

function Inventario({ bienes, onErr }: { bienes: any[]; onErr: () => void }) {
  const sociales = bienes.filter((b) => b.clase === "haber_absoluto" || b.clase === "haber_relativo");
  const propios = bienes.filter((b) => b.clase.startsWith("propio") || b.clase === "reservado_art150");
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="terminal p-4">
        <div className="label-art text-neon-blue mb-2">Bienes sociales</div>
        {sociales.length === 0 && <p className="text-parchment/40 italic text-xs">Vacío. Demasiado vacío.</p>}
        {sociales.map((b) => (
          <div key={b.id} className="text-xs border-b border-ink-400 py-1 flex justify-between">
            <span>{b.nombre}</span><span className="text-neon-cyan">${b.valor.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="terminal p-4">
        <div className="label-art text-neon-amber mb-2">Bienes propios / reservados</div>
        {propios.map((b) => (
          <div key={b.id} className="text-xs border-b border-ink-400 py-1 flex justify-between">
            <span>{b.nombre}</span><span className="text-neon-amber">${b.valor.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Tasacion({ total }: { total: number }) {
  return (
    <div className="terminal p-6">
      <div className="label-art text-neon-cyan mb-2">Tasación del haber social</div>
      <p className="text-5xl text-neon-blue glitch-text">${total.toLocaleString()}</p>
      <p className="text-parchment/60 text-xs mt-3">Suma actualizada de bienes sociales (haber absoluto + relativo).</p>
    </div>
  );
}

function Recompensas({ recompensas, totalRec }: { recompensas: any[]; totalRec: number }) {
  return (
    <div className="space-y-3">
      <div className="terminal p-4">
        <div className="label-art text-neon-violet mb-2">Libro de recompensas</div>
        {recompensas.length === 0 && <p className="text-parchment/40 italic text-xs">Sin recompensas. Patrimonio limpio.</p>}
        {recompensas.map((r) => (
          <div key={r.id} className="text-xs border-b border-ink-400 py-2">
            <div className="flex justify-between">
              <span>{r.deudor} → {r.acreedor}</span>
              <span className="text-neon-violet">${r.monto.toLocaleString()}</span>
            </div>
            <div className="text-parchment/50">{r.motivo}</div>
          </div>
        ))}
      </div>
      <div className="terminal p-4 text-sm">
        Saldo neto recompensas: <b className="text-neon-violet">${totalRec.toLocaleString()}</b>
      </div>
    </div>
  );
}

function Particion({ gananciales, cuota }: { gananciales: number; cuota: number }) {
  return (
    <div className="terminal p-6">
      <div className="label-art text-neon-cyan mb-2">División por mitades</div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-xs text-parchment/60">Gananciales</div>
          <div className="text-3xl text-neon-blue">${gananciales.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-parchment/60">Cuota por cónyuge</div>
          <div className="text-3xl text-neon-violet">${cuota.toLocaleString()}</div>
        </div>
      </div>
      <p className="text-parchment/60 text-xs mt-4">Art. 1774 CC: los gananciales se dividen por mitades entre los cónyuges.</p>
    </div>
  );
}

function Adjudicacion({ bienes }: { bienes: any[] }) {
  return (
    <div className="terminal p-4">
      <div className="label-art text-neon-cyan mb-2">Hijuelas (didáctico)</div>
      <p className="text-parchment/60 text-xs mb-3">El juez asigna bienes concretos a cada hijuela buscando equidad y comodidad de la división.</p>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-neon-blue mb-1">Hijuela A</div>
          {bienes.filter((_, i) => i % 2 === 0).map((b) => (
            <div key={b.id} className="border-b border-ink-400 py-1">{b.nombre}</div>
          ))}
        </div>
        <div>
          <div className="text-neon-blue mb-1">Hijuela B</div>
          {bienes.filter((_, i) => i % 2 === 1).map((b) => (
            <div key={b.id} className="border-b border-ink-400 py-1">{b.nombre}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generarEpilogo(game: any, calc: any, errores: number) {
  const p = game.personaje;
  const cuota = calc.cuotaPorConyuge;
  const hijosTrauma = game.hijos.reduce((s, h) => s + h.trauma, 0);
  const moroso = game.hijos.some((h) => !h.alimentosAlDia);
  const fraude = game.flags.includes("fraude_simulacion");
  const vif = game.flags.includes("denuncia_vif");
  const bigamia = game.flags.includes("bigamia_oculta");
  const ceFalsa = game.flags.includes("cese_falso");

  const tono = p.trauma > 70 ? "ruinoso" : p.reputacion > 30 ? "ejemplar" : "gris";

  const lineas: string[] = [];
  lineas.push(`${p.nombre}, ${p.profesion} de origen ${p.origen}, concluyó su trayectoria patrimonial el ${new Date().toLocaleDateString("es-CL")}.`);
  lineas.push(`Estado civil definitivo: ${p.estadoCivil}. Régimen: ${p.regimen?.replace(/_/g, " ") ?? "ninguno"}.`);
  lineas.push(`Tras la partición, le correspondió una cuota de gananciales de aproximadamente $${cuota.toLocaleString()}.`);
  if (game.recompensas.length) lineas.push(`Acumuló ${game.recompensas.length} asientos en el libro de recompensas, último gemido patrimonial de la sociedad conyugal.`);
  if (moroso) lineas.push(`Murió esperando inscripción conservatoria mientras evadía un apremio personal por alimentos impagos.`);
  if (fraude) lineas.push(`Se rumorea que simuló una enajenación: la nulidad relativa pende sobre su tumba.`);
  if (bigamia) lineas.push(`Su primer matrimonio nunca fue disuelto; el segundo fue declarado nulo, pero los hijos conservaron, por buena fe, la condición de matrimoniales (art. 51 LMC).`);
  if (vif) lineas.push(`La VIF dejó marcas que la jurisprudencia llamó "daño moral indemnizable".`);
  if (ceFalsa) lineas.push(`Falseó la fecha del cese: la contraparte impugnó. Lo demás fue silencio procesal.`);
  if (hijosTrauma > 40) lineas.push(`Sus hijos crecieron tomando notas de cada incumplimiento. Recordarán todo.`);
  if (game.hijos.length > 0 && !moroso) lineas.push(`Sus hijos recibirán, en sucesión, la legítima rigorosa (art. 1184).`);
  lineas.push(tono === "ruinoso"
    ? "Su epitafio: «Aquí yace un haber relativo sin recompensar»."
    : tono === "ejemplar"
      ? "Su epitafio: «Cumplió el art. 102 hasta el final»."
      : "Su epitafio: «Un patrimonio razonable. Un afecto razonable. Nada del otro mundo civil».");

  return lineas.join("\n\n");
}
