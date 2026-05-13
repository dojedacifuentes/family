export type Regimen = "sociedad_conyugal" | "separacion_total" | "participacion_gananciales";

export type Atributos = {
  persuasion: number;
  honestidad: number;
  impulsividad: number;
  inteligencia_juridica: number;
  empatia: number;
  resistencia_emocional: number;
};

export type Origen = "popular" | "clase_media" | "elite" | "rural" | "academico";
export type Profesion = "abogado" | "comerciante" | "funcionario" | "artista" | "ingeniero" | "obrero";

export type Personaje = {
  nombre: string;
  origen: Origen;
  profesion: Profesion;
  nivelEconomico: number; // 0-100
  atributos: Atributos;
  reputacion: number; // -100..100
  trauma: number; // 0..100
  estadoCivil: "soltero" | "casado" | "separado_judicial" | "divorciado" | "viudo" | "nulidad";
  regimen?: Regimen;
};

export type ClaseBien =
  | "haber_absoluto"
  | "haber_relativo"
  | "propio_marido"
  | "propio_mujer"
  | "reservado_art150"
  | "familiar";

export type Bien = {
  id: string;
  nombre: string;
  valor: number;
  clase: ClaseBien;
  adquiridoAntesDelMatrimonio?: boolean;
  fuente: "trabajo" | "herencia" | "donacion" | "compra" | "frutos" | "indemnizacion" | "subrogacion";
  oculto?: boolean; // si el jugador lo ocultó
  generaRecompensa?: number; // crédito/deuda con la sociedad
};

export type Hijo = {
  id: string;
  nombre: string;
  edad: number;
  filiacion: "matrimonial" | "no_matrimonial" | "adoptiva";
  reconocido: boolean;
  cuidadoPersonal?: "padre" | "madre" | "compartido" | "tercero";
  alimentosAlDia: boolean;
  afecto: number; // -100..100
  trauma: number; // 0..100
  recuerdos: string[];
};

export type Conyuge = {
  nombre: string;
  afecto: number; // -100..100
  confianza: number;
  honestidad: number;
  patrimonioOculto: number;
  infidelidades: number;
  vif: boolean;
  alcoholismo: boolean;
};

export type Recompensa = {
  id: string;
  acreedor: "marido" | "mujer" | "sociedad";
  deudor: "marido" | "mujer" | "sociedad";
  monto: number;
  motivo: string;
};

export type Flag = string; // banderas narrativas / decisiones

export type Mundo =
  | "noviazgo"
  | "matrimonio"
  | "haber"
  | "hijos"
  | "crisis"
  | "separacion"
  | "nulidad"
  | "liquidacion"
  | "sucesion";

export type SaveState = {
  version: number;
  creado: number;
  ultimoGuardado: number;
  personaje: Personaje;
  conyuge?: Conyuge;
  hijos: Hijo[];
  bienes: Bien[];
  recompensas: Recompensa[];
  flags: Flag[];
  mundoActual: Mundo;
  log: { t: number; texto: string; tag?: string }[];
  finalizado?: boolean;
  epilogo?: string;
};
