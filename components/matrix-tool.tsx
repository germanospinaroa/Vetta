"use client";

import { useEffect, useMemo, useState } from "react";

const criteria = [
  ["Capital necesario", "¿Qué debes comprometer antes de validar la oportunidad?"],
  ["Tiempo requerido", "¿Qué ritmo de trabajo exige y qué desplaza de tu vida actual?"],
  ["Riesgo", "¿Qué puede salir mal y qué parte del riesgo puedes limitar?"],
  ["Demanda verificable", "¿Qué evidencia existe de que alguien necesita o compra esto?"],
  ["Dependencia personal", "¿Qué ocurre si dejas de aportar horas durante una semana?"],
  ["Infraestructura y soporte", "¿Qué sistemas, personas o proveedores son indispensables?"],
  ["Escalabilidad", "¿Qué puede crecer sin que el esfuerzo crezca al mismo ritmo?"],
  ["Validación previa", "¿Qué puedes comprobar antes de comprometerte de verdad?"],
  ["Ajuste personal", "¿Encaja con tus capacidades, experiencia y realidad?"],
  ["Potencial de crecimiento", "¿Qué tendría que ser cierto para que pueda crecer con criterio?"],
] as const;

type MatrixState = { opportunity: string; alternatives: string[]; notes: Record<string, string>; unknown: Record<string, boolean> };
const empty: MatrixState = { opportunity: "", alternatives: [""], notes: {}, unknown: {} };

function parseStoredState(value: string | null): MatrixState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<MatrixState>;
    if (typeof parsed.opportunity !== "string" || !Array.isArray(parsed.alternatives) || !parsed.alternatives.every((item) => typeof item === "string") || typeof parsed.notes !== "object" || !parsed.notes || typeof parsed.unknown !== "object" || !parsed.unknown) return null;
    return { opportunity: parsed.opportunity, alternatives: parsed.alternatives.slice(0, 2), notes: Object.fromEntries(Object.entries(parsed.notes).filter(([, item]) => typeof item === "string")) as Record<string, string>, unknown: Object.fromEntries(Object.entries(parsed.unknown).filter(([, item]) => typeof item === "boolean")) as Record<string, boolean> };
  } catch {
    return null;
  }
}

export function MatrixTool() {
  const [state, setState] = useState<MatrixState>(empty);
  useEffect(() => { const restored = parseStoredState(window.localStorage.getItem("vetta-matrix-v1")); if (restored) queueMicrotask(() => setState(restored)); else if (window.localStorage.getItem("vetta-matrix-v1")) window.localStorage.removeItem("vetta-matrix-v1"); }, []);
  useEffect(() => { const timer = window.setTimeout(() => window.localStorage.setItem("vetta-matrix-v1", JSON.stringify(state)), 300); return () => window.clearTimeout(timer); }, [state]);
  const completed = useMemo(() => criteria.filter(([key]) => state.notes[key]?.trim() && !state.unknown[key]).length, [state]);

  function updateNote(key: string, value: string) { setState((current) => ({ ...current, notes: { ...current.notes, [key]: value } })); }
  function download() { const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString(), note: "Evaluación orientativa; no declara una oportunidad ganadora." }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "vetta-matriz.json"; anchor.click(); URL.revokeObjectURL(url); }

  return <div className="matrix-tool">
    <div className="matrix-topline"><span className="section-kicker">Matriz v1 · guardado local</span><span className="save-state" aria-live="polite">Guardado en este dispositivo · {completed}/{criteria.length} criterios trabajados</span></div>
    <label className="matrix-label" htmlFor="opportunity">Oportunidad que estás evaluando</label>
    <input className="matrix-opportunity" id="opportunity" value={state.opportunity} onChange={(event) => setState((current) => ({ ...current, opportunity: event.target.value }))} placeholder="Ej. una franquicia, consultoría o idea propia" />
    <div className="alternative-row"><span>También puedes comparar</span>{state.alternatives.map((value, index) => <input key={index} value={value} onChange={(event) => setState((current) => ({ ...current, alternatives: current.alternatives.map((item, i) => i === index ? event.target.value : item) }))} aria-label={`Alternativa ${index + 2}`} placeholder={`Alternativa ${index + 2}`} />)}{state.alternatives.length < 2 && <button className="text-button" type="button" onClick={() => setState((current) => ({ ...current, alternatives: [...current.alternatives, ""] }))}>+ Añadir alternativa</button>}</div>
    <div className="matrix-table" role="table" aria-label="Criterios para evaluar oportunidades"><div className="matrix-header" role="row"><span role="columnheader">Criterio</span><span role="columnheader">Pregunta para investigar</span><span role="columnheader">Tu observación</span></div>{criteria.map(([key, question], index) => <div className="matrix-row" role="row" key={key}><div className="matrix-criterion" role="cell"><strong>{String(index + 1).padStart(2, "0")}</strong><span>{key}</span></div><p role="cell">{question}</p><div className="matrix-input" role="cell"><textarea value={state.notes[key] || ""} onChange={(event) => updateNote(key, event.target.value)} aria-label={`Observación: ${key}`} placeholder="Escribe lo que sabes, lo que supones o lo que necesitas comprobar." disabled={state.unknown[key]} /><label><input type="checkbox" checked={Boolean(state.unknown[key])} onChange={(event) => setState((current) => ({ ...current, unknown: { ...current.unknown, [key]: event.target.checked } }))} /> Todavía no tengo información suficiente</label></div></div>)}</div>
    <div className="matrix-actions"><p>Esta herramienta organiza preguntas; no decide por ti ni produce una verdad matemática.</p><div><button className="button button-outline" type="button" onClick={() => window.print()}>Imprimir</button><button className="button button-dark" type="button" onClick={download}>Exportar evaluación</button></div></div>
  </div>;
}
