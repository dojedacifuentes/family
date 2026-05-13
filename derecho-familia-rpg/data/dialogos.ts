// Diálogos narrativos. Cada escena es una secuencia de líneas y opciones.
// Estilo: Disco Elysium + expediente notarial chileno.

export type Opcion = {
  texto: string;
  requiere?: { atributo?: keyof import("@/types/game").Atributos; minimo?: number; flag?: string };
  efectos?: {
    flags?: string[];
    atributos?: Partial<Record<keyof import("@/types/game").Atributos, number>>;
    reputacion?: number;
    trauma?: number;
    log?: string;
    next?: string;
  };
  resultado?: string;
};

export type Escena = {
  id: string;
  titulo: string;
  ambientacion: string;
  speaker?: string;
  lineas: string[];
  opciones: Opcion[];
  articulo?: { n: string; t: string };
};

import type { Atributos } from "@/types/game";

export const ESCENAS: Record<string, Escena> = {
  inicio_noviazgo: {
    id: "inicio_noviazgo",
    titulo: "Notaría Municipal #4 — 03:14 a.m.",
    ambientacion: "Tubos fluorescentes parpadean. Olor a café instantáneo y papel mojado. Afuera, lluvia ácida sobre Santiago jurídico.",
    speaker: "NOTARIO INSOMNE",
    lineas: [
      "Joven. Trae los esponsales firmados.",
      "Recuerde: la promesa de matrimonio mutuamente aceptada NO produce obligación alguna ante la ley civil (art. 98 CC).",
      "Es un hecho privado. Romántico, si quiere. Inexigible, siempre.",
      "¿Desea, igualmente, registrar la intención?",
    ],
    articulo: { n: "98", t: "Los esponsales no producen obligación civil." },
    opciones: [
      {
        texto: "[HONESTIDAD] «Sé que no obliga. Igual quiero dejarlo por escrito.»",
        requiere: { atributo: "honestidad", minimo: 4 },
        efectos: { flags: ["registro_esponsales"], log: "Registraste esponsales sin valor civil.", reputacion: 2 },
      },
      {
        texto: "[PERSUASIÓN] «¿Y si pago un poco más? ¿Se vuelven exigibles?»",
        requiere: { atributo: "persuasion", minimo: 6 },
        efectos: { reputacion: -4, flags: ["intento_corromper"], log: "Intentaste corromper al notario. Mala impresión." },
      },
      {
        texto: "Salir a la lluvia. No firmar nada.",
        efectos: { trauma: 2, log: "Saliste. Algo en ti se quebró un poco." },
      },
    ],
  },

  consentimiento: {
    id: "consentimiento",
    titulo: "Oficina del Registro Civil — Acto Constitutivo",
    ambientacion: "Tres testigos. Un oficial. Un libro de tapas oscuras. El consentimiento será verificado.",
    speaker: "OFICIAL CIVIL",
    lineas: [
      "Verificaré la ausencia de vicios: error sobre la persona o sus cualidades (art. 8 LMC), fuerza, e impedimentos dirimentes.",
      "¿Conoce a su contrayente? ¿Hay matrimonio anterior no disuelto? ¿Vínculo de parentesco?",
    ],
    articulo: { n: "8 LMC", t: "Vicios del consentimiento matrimonial." },
    opciones: [
      {
        texto: "Declarar todo correctamente.",
        efectos: { flags: ["consentimiento_valido"], reputacion: 2, log: "Consentimiento válido." },
      },
      {
        texto: "[IMPULSIVIDAD] Omitir el matrimonio anterior no disuelto.",
        requiere: { atributo: "impulsividad", minimo: 6 },
        efectos: { flags: ["bigamia_oculta", "nulidad_latente"], trauma: 8, log: "Ocultaste un vínculo. La nulidad te seguirá." },
      },
    ],
  },

  eleccion_regimen: {
    id: "eleccion_regimen",
    titulo: "Elección de Régimen Patrimonial",
    ambientacion: "Tres puertas. Tres mundos. Bajo cada puerta, un código distinto.",
    speaker: "ARCHIVISTA DEL CONSERVADOR",
    lineas: [
      "Por defecto, el matrimonio engendra sociedad de bienes (art. 135 CC).",
      "Puede pactar separación total o participación en los gananciales en capitulaciones matrimoniales.",
      "Su elección configurará la economía moral de toda su vida.",
    ],
    articulo: { n: "135", t: "Por el hecho del matrimonio se contrae sociedad de bienes." },
    opciones: [
      {
        texto: "SOCIEDAD CONYUGAL — administración del marido, haber común.",
        efectos: { flags: ["regimen_sc"], log: "Elegiste sociedad conyugal. Bienvenido al haber absoluto y a las recompensas." },
      },
      {
        texto: "SEPARACIÓN TOTAL — patrimonios estancos.",
        efectos: { flags: ["regimen_st"], log: "Separación total. Menos litigios patrimoniales, más soledad económica." },
      },
      {
        texto: "PARTICIPACIÓN EN GANANCIALES — sistema híbrido (Ley 19.335).",
        efectos: { flags: ["regimen_pg"], log: "Participación en gananciales. Patrimonios separados, crédito al final." },
      },
    ],
  },

  cesa_convivencia: {
    id: "cesa_convivencia",
    titulo: "Cese de convivencia — ¿Cuándo se rompió todo?",
    ambientacion: "Una cocina apagada. Tazas separadas. Un calendario con marcas rojas.",
    speaker: "TU PROPIA VOZ INTERIOR",
    lineas: [
      "Para divorciarse unilateralmente se requieren 3 años de cese; de común acuerdo, 1 año (art. 55 LMC).",
      "La prueba del cese exige instrumentos auténticos o, a falta, prueba calificada.",
      "¿Tienes alguna escritura, demanda de alimentos o gestión voluntaria que fije fecha cierta?",
    ],
    articulo: { n: "55 LMC", t: "Divorcio por cese de convivencia." },
    opciones: [
      {
        texto: "Iniciar gestión voluntaria de constancia de cese.",
        efectos: { flags: ["cese_acreditado"], log: "Acreditaste cese de convivencia con fecha cierta." },
      },
      {
        texto: "[INTELIGENCIA JURÍDICA] Reunir testigos calificados y prueba sumaria.",
        requiere: { atributo: "inteligencia_juridica", minimo: 6 },
        efectos: { flags: ["cese_acreditado"], log: "Configuraste prueba testimonial calificada." },
      },
      {
        texto: "Mentir sobre la fecha.",
        efectos: { trauma: 4, reputacion: -6, flags: ["cese_falso"], log: "Falseaste fecha cierta. Riesgo procesal." },
      },
    ],
  },

  compensacion_economica: {
    id: "compensacion_economica",
    titulo: "Audiencia preparatoria — Compensación económica",
    ambientacion: "Tribunal de Familia. Luz cenital. Calculadora forense sobre la mesa.",
    speaker: "JUEZA DE FAMILIA",
    lineas: [
      "La compensación económica procede cuando un cónyuge se dedicó al hogar o a los hijos y por ello no pudo desarrollar actividad remunerada o lo hizo en menor medida (art. 61 LMC).",
      "Su monto considera duración del matrimonio, edad, salud, situación previsional, calificación profesional y posibilidades de acceso al mercado laboral (art. 62 LMC).",
      "¿Acuerdo o sentencia?",
    ],
    articulo: { n: "61 LMC", t: "Compensación económica." },
    opciones: [
      {
        texto: "[EMPATÍA] Acordar monto razonable y forma de pago.",
        requiere: { atributo: "empatia", minimo: 5 },
        efectos: { flags: ["ce_acordada"], reputacion: 4, log: "Acordaste compensación. La jueza asiente." },
      },
      {
        texto: "Pelear todo. Negar dedicación al hogar.",
        efectos: { reputacion: -8, trauma: 6, flags: ["ce_litigada"], log: "Litigaste con dureza. Sentencia incierta." },
      },
    ],
  },
};
