"use client";
import Link from "next/link";
import { ARTICULOS_DESTACADOS } from "@/lib/reglas";

const TEMAS: { titulo: string; cuerpo: string }[] = [
  {
    titulo: "Matrimonio (art. 102 CC)",
    cuerpo: "Contrato solemne por el cual un hombre y una mujer se unen actual e indisolublemente, y por toda la vida, con el fin de vivir juntos, procrear y auxiliarse mutuamente. La Ley 21.400 amplía la celebración entre personas del mismo sexo.",
  },
  {
    titulo: "Sociedad conyugal (art. 1725 CC)",
    cuerpo: "Régimen legal supletorio. Coexisten tres patrimonios: el social (haber absoluto y haber relativo), el del marido y el de la mujer (con su patrimonio reservado, art. 150).",
  },
  {
    titulo: "Haber absoluto",
    cuerpo: "Ingresan sin obligación de restituir: (1) salarios y emolumentos; (2) frutos de bienes sociales y propios; (5) bienes adquiridos a título oneroso durante la vigencia.",
  },
  {
    titulo: "Haber relativo",
    cuerpo: "Ingresan con cargo de recompensa: (3) dinero y (4) muebles aportados o adquiridos a título gratuito durante el matrimonio.",
  },
  {
    titulo: "Bienes propios",
    cuerpo: "Inmuebles aportados al matrimonio (art. 1736) y los adquiridos a título gratuito durante la vigencia (art. 1726). Subrogación real: conservan su carácter al ser sustituidos por otros (arts. 1727 y ss.).",
  },
  {
    titulo: "Administración",
    cuerpo: "Ordinaria: el marido administra los bienes sociales y los propios de la mujer (art. 1749). Requiere autorización de la mujer para ciertos actos (art. 1754).",
  },
  {
    titulo: "Bienes familiares (arts. 141 ss.)",
    cuerpo: "El inmueble que sirve de residencia principal de la familia y los muebles que lo guarnecen pueden ser declarados familiares por el juez; limita la disposición sin autorización del cónyuge.",
  },
  {
    titulo: "Divorcio (Ley 19.947)",
    cuerpo: "Por culpa (art. 54), unilateral con 3 años de cese (art. 55 inc. 3) o de común acuerdo con 1 año de cese y acuerdo regulador completo y suficiente (art. 55 inc. 1).",
  },
  {
    titulo: "Compensación económica (arts. 61–62 LMC)",
    cuerpo: "Procede cuando un cónyuge se dedicó al cuidado del hogar o de los hijos y, por ello, no desarrolló actividad remunerada o lo hizo en menor medida. Se atiende a duración, edad, salud, situación previsional, calificación profesional y posibilidades de acceso al mercado laboral.",
  },
  {
    titulo: "Nulidad y matrimonio putativo (arts. 50–52 LMC)",
    cuerpo: "Nulo por incapacidad, vicio del consentimiento o defecto formal. Si concurre buena fe y justa causa de error, produce los mismos efectos civiles que el válido respecto del cónyuge de buena fe y de los hijos.",
  },
  {
    titulo: "Filiación (arts. 179–221 CC)",
    cuerpo: "Matrimonial, no matrimonial o adoptiva. Iguales derechos para todos los hijos. Acciones de reclamación y de impugnación.",
  },
  {
    titulo: "Alimentos (Ley 14.908)",
    cuerpo: "Obligación de socorro entre parientes. Apremios personales y patrimoniales por incumplimiento. Registro Nacional de Deudores de Pensiones de Alimentos.",
  },
  {
    titulo: "Liquidación (arts. 1765–1788 CC)",
    cuerpo: "Inventario, tasación, deducciones, liquidación de recompensas, división por mitades de los gananciales, adjudicación, inscripción.",
  },
];

export default function Codex() {
  return (
    <main className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="tag mb-2">CODEX JURIDICUS</div>
          <h1 className="label-art text-3xl text-neon-blue">Articulado mínimo</h1>
        </div>
        <Link href="/" className="btn">◂ Inicio</Link>
      </div>

      <div className="terminal p-4 mb-6">
        <div className="label-art text-neon-violet mb-2 text-sm">Artículos destacados</div>
        <div className="grid sm:grid-cols-2 gap-1 text-xs">
          {ARTICULOS_DESTACADOS.map((a) => (
            <div key={a.n}><b className="text-neon-cyan">Art. {a.n}</b> — {a.t}</div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {TEMAS.map((t) => (
          <details key={t.titulo} className="terminal p-4">
            <summary className="label-art text-neon-cyan cursor-pointer">{t.titulo}</summary>
            <p className="mt-2 text-parchment/80 text-sm leading-relaxed">{t.cuerpo}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
