"use client";
import { useParams, useRouter } from "next/navigation";
import { ESCENAS } from "@/data/dialogos";
import DialogoEscena from "@/components/DialogoEscena";
import { useGame } from "@/store/useGame";
import Link from "next/link";
import type { Mundo } from "@/types/game";
import ClasificadorBienes from "@/components/ClasificadorBienes";
import HijosPanel from "@/components/HijosPanel";
import CrisisPanel from "@/components/CrisisPanel";
import SeparacionPanel from "@/components/SeparacionPanel";
import NulidadPanel from "@/components/NulidadPanel";
import MatrimonioPanel from "@/components/MatrimonioPanel";
import { useState } from "react";

export default function MundoPage() {
  const { id } = useParams<{ id: string }>();
  const mundo = id as Mundo;
  const router = useRouter();
  const game = useGame();
  const [escenaIdx, setEscenaIdx] = useState(0);

  const escenasMundo: Record<Mundo, string[]> = {
    noviazgo: ["inicio_noviazgo", "consentimiento"],
    matrimonio: ["eleccion_regimen"],
    haber: [],
    hijos: [],
    crisis: [],
    separacion: ["cesa_convivencia"],
    nulidad: [],
    liquidacion: [],
    sucesion: [],
  };

  const lista = escenasMundo[mundo] || [];
  const todasLasEscenasVistas = escenaIdx >= lista.length;

  return (
    <main className="min-h-screen px-6 py-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <Link href="/juego" className="btn">◂ Volver al mapa</Link>
        <div className="tag">{mundo.toUpperCase()}</div>
      </header>

      {!todasLasEscenasVistas && lista[escenaIdx] && (
        <DialogoEscena
          escena={ESCENAS[lista[escenaIdx]]}
          onFin={() => setEscenaIdx((i) => i + 1)}
        />
      )}

      {todasLasEscenasVistas && (
        <div className="space-y-6">
          {mundo === "noviazgo" && (
            <Resumen
              titulo="Has cruzado el umbral precontractual."
              cta="Avanzar al matrimonio"
              onAdvance={() => router.push("/mundo/matrimonio")}
            />
          )}
          {mundo === "matrimonio" && <MatrimonioPanel />}
          {mundo === "haber" && <ClasificadorBienes />}
          {mundo === "hijos" && <HijosPanel />}
          {mundo === "crisis" && <CrisisPanel />}
          {mundo === "separacion" && <SeparacionPanel />}
          {mundo === "nulidad" && <NulidadPanel />}
          {mundo === "liquidacion" && (
            <Resumen
              titulo="El expediente está listo para liquidación."
              cta="Iniciar liquidación"
              onAdvance={() => router.push("/liquidacion")}
            />
          )}
        </div>
      )}
    </main>
  );
}

function Resumen({ titulo, cta, onAdvance }: { titulo: string; cta: string; onAdvance: () => void }) {
  return (
    <div className="terminal p-6">
      <h2 className="label-art text-neon-blue text-xl mb-3">{titulo}</h2>
      <p className="text-parchment/60 text-sm mb-4">La narrativa continúa. Cada acción se inscribe en el folio interior.</p>
      <button className="btn" onClick={onAdvance}>▸ {cta}</button>
    </div>
  );
}
