import type { Bien, ClaseBien } from "@/types/game";

/**
 * Reglas patrimoniales — Código Civil chileno (arts. 1725 y ss.).
 * Implementación didáctica, no exhaustiva.
 *
 * - Haber absoluto (art. 1725): ingresan SIN obligación de restituir.
 *   · Salarios y emolumentos del trabajo de los cónyuges (1725 N°1).
 *   · Frutos de bienes sociales y propios (1725 N°2).
 *   · Bienes muebles e inmuebles adquiridos a TÍTULO ONEROSO durante la vigencia (1725 N°5).
 *
 * - Haber relativo (art. 1725 N°3 y N°4): ingresan, pero CON cargo de recompensa.
 *   · Dinero aportado al matrimonio o adquirido a título gratuito durante (1725 N°4).
 *   · Cosas muebles aportadas o adquiridas a título gratuito durante (1725 N°4).
 *
 * - Bienes propios:
 *   · Inmuebles adquiridos antes del matrimonio.
 *   · Inmuebles adquiridos a título gratuito durante el matrimonio (herencia/donación).
 *   · Subrogación real (arts. 1727 y ss.): el bien propio reemplazado por otro conserva su carácter.
 *
 * - Bienes reservados de la mujer (art. 150): los que adquiere con su trabajo separado.
 *
 * - Bienes familiares (arts. 141 ss.): inmueble que sirve de residencia principal de la familia.
 */

export type ClasificacionRazonada = {
  clase: ClaseBien;
  recompensa: number; // monto que la sociedad debe (positivo) o cobra (negativo) al cónyuge
  justificacion: string;
  articulo: string;
};

export function clasificarBien(b: Omit<Bien, "clase">): ClasificacionRazonada {
  // Antes del matrimonio
  if (b.adquiridoAntesDelMatrimonio) {
    // Inmuebles propios; muebles entran al haber relativo con recompensa
    if (b.fuente === "compra" && b.valor > 5000) {
      return {
        clase: "propio_marido",
        recompensa: 0,
        justificacion: "Inmueble adquirido antes del matrimonio. Conserva carácter propio.",
        articulo: "Art. 1736",
      };
    }
    return {
      clase: "haber_relativo",
      recompensa: b.valor,
      justificacion: "Bien mueble aportado al matrimonio. Ingresa al haber relativo con cargo de recompensa.",
      articulo: "Art. 1725 N°4",
    };
  }

  // Durante el matrimonio
  switch (b.fuente) {
    case "trabajo":
      return {
        clase: "haber_absoluto",
        recompensa: 0,
        justificacion: "Producto del trabajo de los cónyuges durante la sociedad: ingresa al haber absoluto.",
        articulo: "Art. 1725 N°1",
      };
    case "frutos":
      return {
        clase: "haber_absoluto",
        recompensa: 0,
        justificacion: "Los frutos —civiles y naturales— de los bienes sociales y propios pertenecen al haber absoluto.",
        articulo: "Art. 1725 N°2",
      };
    case "compra":
      return {
        clase: "haber_absoluto",
        recompensa: 0,
        justificacion: "Bien adquirido a título oneroso durante la vigencia de la sociedad conyugal.",
        articulo: "Art. 1725 N°5",
      };
    case "herencia":
    case "donacion":
      if (b.valor > 5000) {
        return {
          clase: "propio_mujer",
          recompensa: 0,
          justificacion: "Inmueble adquirido a título gratuito durante el matrimonio: bien propio del cónyuge.",
          articulo: "Art. 1726",
        };
      }
      return {
        clase: "haber_relativo",
        recompensa: b.valor,
        justificacion: "Bien mueble adquirido a título gratuito durante la sociedad: haber relativo con recompensa.",
        articulo: "Art. 1725 N°4",
      };
    case "indemnizacion":
      return {
        clase: "haber_absoluto",
        recompensa: 0,
        justificacion: "Indemnización percibida durante la sociedad ingresa al haber social.",
        articulo: "Art. 1725",
      };
    case "subrogacion":
      return {
        clase: "propio_marido",
        recompensa: 0,
        justificacion: "Subrogación real: el bien adquirido toma el carácter de aquel a quien sustituye.",
        articulo: "Arts. 1727–1733",
      };
  }

  return {
    clase: "haber_absoluto",
    recompensa: 0,
    justificacion: "Por defecto: haber absoluto durante vigencia.",
    articulo: "Art. 1725",
  };
}

// Liquidación: bienes sociales se dividen por mitades; recompensas se compensan.
export function liquidar(bienes: Bien[]) {
  const sociales = bienes.filter((b) => b.clase === "haber_absoluto" || b.clase === "haber_relativo");
  const totalSocial = sociales.reduce((s, b) => s + b.valor, 0);
  const recompensas = bienes.reduce((s, b) => s + (b.generaRecompensa || 0), 0);
  const gananciales = totalSocial; // simplificación didáctica
  const cuotaPorConyuge = gananciales / 2;
  return { totalSocial, recompensas, gananciales, cuotaPorConyuge };
}

export const ARTICULOS_DESTACADOS = [
  { n: "102", t: "Definición de matrimonio (CC)." },
  { n: "135", t: "Por el matrimonio se forma sociedad de bienes." },
  { n: "150", t: "Patrimonio reservado de la mujer casada." },
  { n: "1725", t: "Composición del haber social." },
  { n: "1726", t: "Bienes adquiridos a título gratuito." },
  { n: "1727", t: "Subrogación real." },
  { n: "1736", t: "Bienes adquiridos antes del matrimonio." },
  { n: "1749", t: "Administración ordinaria del marido." },
  { n: "1754", t: "Autorización de la mujer." },
  { n: "1792-2", t: "Participación en los gananciales." },
  { n: "141", t: "Bienes familiares — residencia principal." },
];
