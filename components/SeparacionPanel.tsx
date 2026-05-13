"use client";
import { useGame } from "@/store/useGame";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Via = "unilateral" | "comun_acuerdo" | "culposo" | "separacion_judicial";

const VIAS: { id: Via; nombre: string; req: string; plazo: string; art: string }[] = [
  { id: "unilateral", nombre: "Divorcio unilateral", req: "Cese efectivo de convivencia", plazo: "≥ 3 años", art: "Art. 55 inc. 3 LMC" },
  { id: "comun_acuerdo", nombre: "Divorcio de común acuerdo", req: "Acuerdo regulador completo y suficiente", plazo: "≥ 1 año", art: "Art. 55 inc. 1 LMC" },
  { id: "culposo", nombre: "Divorcio culposo", req: "Falta imputable grave del cónyuge", plazo: "No requiere cese", art: "Art. 54 LMC" },
  { id: "separacion_judicial", nombre: "Separación judicial", req: "Cese o falta imputable", plazo: "—", art: "Arts. 26-29 LMC" },
];

export default function SeparacionPanel() {
  const game = useGame();
  const router = useRouter();
  const [via, setVia] = useState<Via | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);

  function intentar(v: Via) {
    setVia(v);
    const ceseAcred = game.flags.includes("cese_acreditado");
    const ceseFalso = game.flags.includes("cese_falso");
    const pruebaCulpa = game.flags.includes("prueba_infidelidad") || game.flags.includes("prueba_alcoholismo") || game.flags.includes("denuncia_vif");

    let exito = false; let texto = "";
    if (v === "unilateral") { exito = ceseAcred && !ceseFalso; texto = exito ? "Acreditado el cese por 3 años, se acoge el divorcio unilateral." : "Falta prueba calificada del cese. Demanda rechazada."; }
    if (v === "comun_acuerdo") { exito = !!game.conyuge && game.conyuge.afecto > -50; texto = exito ? "Acuerdo regulador suficiente: se concede el divorcio." : "El otro cónyuge se niega: vía cerrada."; }
    if (v === "culposo") { exito = pruebaCulpa; texto = exito ? "Acreditada falta imputable grave (art. 54). Se concede divorcio por culpa." : "Sin prueba calificada de la causal culpable. Rechazado."; }
    if (v === "separacion_judicial") { exito = true; texto = "Separación judicial decretada. Subsiste el vínculo, cesa la convivencia y el deber de fidelidad (art. 33 LMC)."; }

    if (exito) {
      const ec = v === "separacion_judicial" ? "separado_judicial" : "divorciado";
      game.setPersonaje({ ...game.personaje, estadoCivil: ec as any });
      game.setFlag("ruptura_definitiva");
      game.pushLog(texto, v.toUpperCase());
    } else {
      game.ajustarTrauma(6);
      game.pushLog(texto, "RECHAZO");
    }
    setResultado(texto);
  }

  return (
    <div className="space-y-4">
      <h2 className="label-art text-neon-blue text-xl">Vía de terminación o suspensión del vínculo</h2>
      <p className="text-parchment/60 text-sm">
        Elige la vía. El juez evaluará los flags procesales que acumulaste en mundos previos.
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        {VIAS.map((v) => (
          <button key={v.id} onClick={() => intentar(v.id)} className="terminal p-4 text-left hover:bg-neon-blue/5">
            <div className="label-art text-neon-cyan">{v.nombre}</div>
            <div className="text-xs text-parchment/70 mt-1">{v.req}</div>
            <div className="flex gap-2 mt-2"><span className="tag">{v.plazo}</span><span className="tag tag-violet">{v.art}</span></div>
          </button>
        ))}
      </div>

      {resultado && (
        <div className="terminal p-4">
          <div className="label-art text-neon-blue mb-2">Sentencia</div>
          <p className="text-parchment text-sm">{resultado}</p>
          {game.flags.includes("ruptura_definitiva") && (
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={() => router.push("/mundo/liquidacion")}>▸ Ir a liquidación</button>
              <button className="btn" onClick={() => router.push(`/mundo/${via === "separacion_judicial" ? "nulidad" : "liquidacion"}`)}>▸ Mundo siguiente</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
