"use client";
import { useGame } from "@/store/useGame";
import type { Regimen } from "@/types/game";
import { useRouter } from "next/navigation";

const REGIMENES: { id: Regimen; titulo: string; desc: string; arts: string }[] = [
  {
    id: "sociedad_conyugal",
    titulo: "Sociedad Conyugal",
    desc: "Régimen legal supletorio. Haber social, recompensas, administración ordinaria del marido (art. 1749), patrimonio reservado de la mujer (art. 150).",
    arts: "Arts. 135, 150, 1725, 1749, 1754 CC",
  },
  {
    id: "separacion_total",
    titulo: "Separación Total de Bienes",
    desc: "Patrimonios estancos. Cada cónyuge administra y dispone libremente. Sin haber común.",
    arts: "Arts. 152, 158 CC / 1723 capitulaciones",
  },
  {
    id: "participacion_gananciales",
    titulo: "Participación en los Gananciales",
    desc: "Durante el matrimonio funciona como separación; al término se compensan los gananciales: crédito de participación.",
    arts: "Ley 19.335 / Arts. 1792-1 y ss.",
  },
];

export default function MatrimonioPanel() {
  const router = useRouter();
  const { personaje, setPersonaje, pushLog, setConyuge, conyuge } = useGame();

  function elegir(r: Regimen) {
    setPersonaje({ ...personaje, regimen: r, estadoCivil: "casado" });
    if (!conyuge) {
      setConyuge({
        nombre: "Cónyuge",
        afecto: 60,
        confianza: 60,
        honestidad: 50,
        patrimonioOculto: 0,
        infidelidades: 0,
        vif: false,
        alcoholismo: false,
      });
    }
    pushLog(`Contrajiste matrimonio bajo ${r.replace(/_/g, " ")}.`, "ART.135");
    setTimeout(() => router.push("/mundo/haber"), 600);
  }

  return (
    <div className="space-y-4">
      <h2 className="label-art text-neon-blue text-xl">Elige tu régimen patrimonial</h2>
      <p className="text-parchment/60 text-sm">
        Por el solo hecho del matrimonio se contrae sociedad de bienes (art. 135). Salvo capitulación expresa en contrario.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {REGIMENES.map((r) => (
          <button
            key={r.id}
            onClick={() => elegir(r.id)}
            className={`terminal p-5 text-left hover:bg-neon-blue/5 transition ${personaje.regimen === r.id ? "border-neon-blue" : ""}`}
          >
            <div className="label-art text-neon-cyan mb-2">{r.titulo}</div>
            <p className="text-parchment/70 text-xs mb-3">{r.desc}</p>
            <div className="tag tag-violet">{r.arts}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
