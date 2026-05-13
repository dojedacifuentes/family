"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Bien, Conyuge, Flag, Hijo, Mundo, Personaje, Recompensa, SaveState } from "@/types/game";

type Store = SaveState & {
  setPersonaje: (p: Personaje) => void;
  setConyuge: (c: Conyuge) => void;
  setMundo: (m: Mundo) => void;
  addBien: (b: Bien) => void;
  updateBien: (id: string, patch: Partial<Bien>) => void;
  addHijo: (h: Hijo) => void;
  updateHijo: (id: string, patch: Partial<Hijo>) => void;
  addRecompensa: (r: Recompensa) => void;
  setFlag: (f: Flag) => void;
  hasFlag: (f: Flag) => boolean;
  log: SaveState["log"];
  pushLog: (texto: string, tag?: string) => void;
  ajustarAtributo: (k: keyof Personaje["atributos"], delta: number) => void;
  ajustarReputacion: (delta: number) => void;
  ajustarTrauma: (delta: number) => void;
  reset: () => void;
  finalizar: (texto: string) => void;
};

const INIT: SaveState = {
  version: 1,
  creado: Date.now(),
  ultimoGuardado: Date.now(),
  personaje: {
    nombre: "",
    origen: "clase_media",
    profesion: "abogado",
    nivelEconomico: 50,
    atributos: {
      persuasion: 5,
      honestidad: 5,
      impulsividad: 5,
      inteligencia_juridica: 5,
      empatia: 5,
      resistencia_emocional: 5,
    },
    reputacion: 0,
    trauma: 0,
    estadoCivil: "soltero",
  },
  hijos: [],
  bienes: [],
  recompensas: [],
  flags: [],
  mundoActual: "noviazgo",
  log: [],
};

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      ...INIT,
      setPersonaje: (p) => set({ personaje: p, ultimoGuardado: Date.now() }),
      setConyuge: (c) => set({ conyuge: c, ultimoGuardado: Date.now() }),
      setMundo: (m) => set({ mundoActual: m, ultimoGuardado: Date.now() }),
      addBien: (b) => set((s) => ({ bienes: [...s.bienes, b] })),
      updateBien: (id, patch) =>
        set((s) => ({ bienes: s.bienes.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      addHijo: (h) => set((s) => ({ hijos: [...s.hijos, h] })),
      updateHijo: (id, patch) =>
        set((s) => ({ hijos: s.hijos.map((h) => (h.id === id ? { ...h, ...patch } : h)) })),
      addRecompensa: (r) => set((s) => ({ recompensas: [...s.recompensas, r] })),
      setFlag: (f) => set((s) => (s.flags.includes(f) ? s : { flags: [...s.flags, f] })),
      hasFlag: (f) => get().flags.includes(f),
      pushLog: (texto, tag) =>
        set((s) => ({ log: [{ t: Date.now(), texto, tag }, ...s.log].slice(0, 200) })),
      ajustarAtributo: (k, delta) =>
        set((s) => ({
          personaje: {
            ...s.personaje,
            atributos: {
              ...s.personaje.atributos,
              [k]: Math.max(0, Math.min(10, s.personaje.atributos[k] + delta)),
            },
          },
        })),
      ajustarReputacion: (delta) =>
        set((s) => ({ personaje: { ...s.personaje, reputacion: Math.max(-100, Math.min(100, s.personaje.reputacion + delta)) } })),
      ajustarTrauma: (delta) =>
        set((s) => ({ personaje: { ...s.personaje, trauma: Math.max(0, Math.min(100, s.personaje.trauma + delta)) } })),
      finalizar: (texto) => set({ finalizado: true, epilogo: texto }),
      reset: () => set({ ...INIT, creado: Date.now(), finalizado: false, epilogo: undefined }),
    }),
    {
      name: "derecho-familia-rpg-save",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as any)
      ),
      skipHydration: false,
    }
  )
);
