"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BUSINESS_MODELS, MODEL_BY_ID, type BusinessModel, type DecisionOption } from "@/lib/next-move-models";
import { PrivacyPreferencesButton } from "@/components/privacy-preferences-button";
import styles from "./next-move-experience.module.css";

const STORAGE_KEY = "vetta-next-move-lab-v2";
const DEMO_SELECTION = ["services", "ecommerce", "direct"];
type View = "universe" | "decision" | "mission" | "compare";

function useLabState() {
  const [selection, setSelection] = useState<string[]>([]);
  const [activeId, setActiveId] = useState(BUSINESS_MODELS[0].id);
  const [decisionId, setDecisionId] = useState<DecisionOption["id"] | null>(null);
  const [view, setView] = useState<View>("universe");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as { selection?: string[]; activeId?: string; decisionId?: DecisionOption["id"]; view?: View } | null;
    const demo = new URLSearchParams(window.location.search).get("demo") === "laura";
    queueMicrotask(() => {
      setSelection(demo ? DEMO_SELECTION : (saved?.selection || []).filter((id) => MODEL_BY_ID[id]));
      setActiveId(MODEL_BY_ID[saved?.activeId || ""] ? saved?.activeId || BUSINESS_MODELS[0].id : BUSINESS_MODELS[0].id);
      setDecisionId(saved?.decisionId || null);
      setView(demo ? "universe" : saved?.view === "mission" ? "universe" : saved?.view || "universe");
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ selection, activeId, decisionId, view }));
  }, [ready, selection, activeId, decisionId, view]);

  function reset() { setSelection([]); setActiveId(BUSINESS_MODELS[0].id); setDecisionId(null); setView("universe"); window.localStorage.removeItem(STORAGE_KEY); }
  function openModel(model: BusinessModel) { setActiveId(model.id); setDecisionId(null); setView("decision"); }
  function toggleSelection(id: string) { setSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current); }
  return { selection, toggleSelection, activeId, setActiveId, decisionId, setDecisionId, view, setView, ready, reset, openModel };
}

function ModelVisual({ model, small = false }: { model: BusinessModel; small?: boolean }) {
  return <div className={`${styles.modelVisual} ${styles[model.visual]} ${small ? styles.visualSmall : ""}`} aria-hidden="true"><span>{model.name.split(" ").map((word) => word[0]).join("")}</span><i /><b /><em /></div>;
}

function Header({ state }: { state: ReturnType<typeof useLabState> }) {
  return <header className={styles.header}><Link href="/" className={styles.logo}><span>✦</span> NO EMPRENDAS TODAVÍA.</Link><span className={styles.headerMeta}>TU PRÓXIMO MOVIMIENTO / LABORATORIO</span><button className={styles.headerReset} onClick={state.reset}>Reiniciar</button></header>;
}

function Universe({ state }: { state: ReturnType<typeof useLabState> }) {
  return <section className={styles.universe}>
    <div className={styles.heroIntro}><div><div className={styles.eyebrow}>LABORATORIO DE DECISIONES</div><h1>Una idea no es un negocio. <i>Descubre cómo ponerla a prueba.</i></h1><p>Explora diferentes maneras de emprender, enfrenta una decisión realista y construye tu primera prueba de realidad.</p></div><div className={styles.heroNote}><span>01</span><strong>DESCUBRE<br />· DECIDE<br />· ACTIVA</strong></div></div>
    <div className={styles.universeHeading}><div><div className={styles.eyebrow}>MOMENTO 01 / DESCUBRE</div><h2>Seis maneras de emprender.<br /><i>Seis realidades diferentes.</i></h2></div><p>Elige un camino. Vamos a descubrir qué decisiones tendrías que tomar para empezar.</p></div>
    <div className={styles.modelGrid}>{BUSINESS_MODELS.map((model, index) => { const selected = state.selection.includes(model.id); return <article className={`${styles.modelCard} ${selected ? styles.selected : ""}`} key={model.id}><button className={styles.cardOpen} onClick={() => state.openModel(model)} aria-label={`Explorar ${model.name}`}><ModelVisual model={model} /><span className={styles.cardIndex}>0{index + 1}</span><div><h3>{model.name}</h3><p>{model.tagline}</p></div><span className={styles.cardArrow}>↗</span></button><button className={styles.selectButton} onClick={() => state.toggleSelection(model.id)}>{selected ? "En comparación · Quitar" : state.selection.length >= 3 ? "Explorar · elige desde la sala" : "Añadir a comparación"}</button></article>; })}</div>
    <div className={styles.selectionBar}><span><strong>{state.selection.length}</strong> de 3 caminos para comparar</span><button className={styles.goldButton} disabled={!state.selection.length} onClick={() => state.setView("compare")}>Ver comparación <span>→</span></button></div>
  </section>;
}

function Decision({ state }: { state: ReturnType<typeof useLabState> }) {
  const model = MODEL_BY_ID[state.activeId];
  const chosen = model.scenario.options.find((option) => option.id === state.decisionId);
  return <section className={styles.decisionPage}><button className={styles.backButton} onClick={() => state.setView("universe")}>← Volver a descubrir</button><div className={styles.eyebrow}>MOMENTO 02 / DECIDE</div><div className={styles.decisionTop}><div><h2>{model.name}<br /><i>Una situación para poner a prueba.</i></h2><p className={styles.situation}>{model.scenario.situation}</p></div><ModelVisual model={model} small /></div><div className={styles.question}><span>LA DECISIÓN</span><h3>{model.scenario.question}</h3><div className={styles.optionGrid}>{model.scenario.options.map((option) => <button key={option.id} className={`${styles.option} ${state.decisionId === option.id ? styles.optionChosen : ""}`} onClick={() => state.setDecisionId(option.id)}><b>{option.id.toUpperCase()}</b><span>{option.label}</span><i>↗</i></button>)}</div></div>{chosen ? <Reveal model={model} option={chosen} onMission={() => state.setView("mission")} /> : <p className={styles.prompt}>No hay una respuesta perfecta. Elige la primera acción que tomarías y observa qué deja todavía sin comprobar.</p>}</section>;
}

function Reveal({ model, option, onMission }: { model: BusinessModel; option: DecisionOption; onMission: () => void }) {
  return <div className={styles.reveal}><div className={styles.revealHeader}><span>LO QUE ESTA DECISIÓN TE ENSEÑA</span><strong>Elegiste {option.id.toUpperCase()}</strong></div><div className={styles.revealGrid}><div><h3>Qué puede conseguir</h3><p>{option.revelation}</p></div><div><h3>Tu punto ciego</h3><p>{option.blindSpot}</p></div><div><h3>Qué validar después</h3><p>{option.verification}</p></div></div><div className={styles.revealFooter}><p><b>Punto ciego común:</b> {model.scenario.commonBlindSpot}</p><button className={styles.goldButton} onClick={onMission}>Construir mi prueba de realidad <span>→</span></button></div></div>;
}

function Mission({ state }: { state: ReturnType<typeof useLabState> }) {
  const model = MODEL_BY_ID[state.activeId];
  const option = model.scenario.options.find((item) => item.id === state.decisionId) || model.scenario.options[0];
  const mission = model.mission;
  async function copyConversation() { try { await navigator.clipboard.writeText(mission.conversation); } catch { /* Clipboard may be unavailable in embedded browsers. */ } }
  async function download() { const response = await fetch("/api/tu-proximo-movimiento/pdf", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ modelId: model.id, decisionId: option.id }) }); if (!response.ok) return; const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "tu-primera-prueba-de-realidad.pdf"; anchor.click(); URL.revokeObjectURL(url); }
  return <section className={styles.missionPage}><button className={styles.backButton} onClick={() => state.setView("decision")}>← Volver a la decisión</button><div className={styles.eyebrow}>MOMENTO 03 / ACTIVA</div><div className={styles.missionHeading}><div><h2>Tu primera prueba de<br /><i>realidad está lista.</i></h2><p>{model.name} · Elegiste {option.id.toUpperCase()}: {option.label}</p></div><span className={styles.missionMark}>48<br /><small>HORAS</small></span></div><div className={styles.hypothesis}><span>HIPÓTESIS QUE VAS A COMPROBAR</span><p>{mission.hypothesis}</p></div><div className={styles.missionGrid}><section><span className={styles.blockLabel}>01 / TRES MOVIMIENTOS</span><ol>{mission.movements.map((move) => <li key={move}>{move}</li>)}</ol></section><section className={styles.conversation}><span className={styles.blockLabel}>02 / CONVERSACIÓN PREPARADA</span><p>{mission.conversation}</p><button className={styles.copyButton} onClick={copyConversation}>Copiar conversación</button></section><section><span className={styles.blockLabel}>03 / QUÉ REGISTRAR</span><ul>{mission.record.map((item) => <li key={item}>{item}</li>)}</ul></section><section className={styles.evidence}><span className={styles.blockLabel}>04 / EVIDENCIA</span><h3>Útil</h3><p>{mission.evidence}</p><h3>No suficiente</h3><p>{mission.notEvidence}</p></section></div><div className={styles.personalBlindSpot}><span className={styles.blockLabel}>TU PUNTO CIEGO · DECISIÓN {option.id.toUpperCase()}</span><p>{option.blindSpot}</p><strong>Compruébalo así: {option.verification}</strong></div><div className={styles.nextDecision}><span className={styles.blockLabel}>05 / SIGUIENTE DECISIÓN</span><p>{mission.nextDecision}</p></div><div className={styles.missionActions}><button className={styles.goldButton} onClick={download}>Guardar mi misión <span>↓</span></button><button className={styles.outlineButton} onClick={() => state.setView("universe")}>Explorar otro camino</button></div></section>;
}

function Compare({ state }: { state: ReturnType<typeof useLabState> }) {
  const models = useMemo(() => state.selection.map((id) => MODEL_BY_ID[id]).filter(Boolean), [state.selection]);
  return <section className={styles.comparePage}><button className={styles.backButton} onClick={() => state.setView("universe")}>← Seguir explorando</button><div className={styles.eyebrow}>COMPARACIÓN BREVE</div><h2>Tres caminos.<br /><i>Una mirada más clara.</i></h2><p className={styles.sectionLead}>La comparación orienta la exploración; no elige por ti.</p><div className={styles.compareColumns}>{models.map((model) => <article key={model.id}><ModelVisual model={model} small /><h3>{model.name}</h3><p>{model.whatYouBuild}</p><button className={styles.textButton} onClick={() => state.openModel(model)}>Abrir decisión</button><button className={styles.removeButton} onClick={() => state.toggleSelection(model.id)}>Quitar</button></article>)}</div><div className={styles.compareRows}>{(["offer", "builds", "leverages", "learns", "operations", "risksToVerify"] as const).map((key, index) => <div className={styles.compareRow} key={key}><strong>{["¿Qué ofreces?", "¿Qué construyes?", "¿Qué puedes aprovechar?", "¿Qué debes aprender?", "¿Qué actividad implica?", "¿Qué debes verificar?"][index]}</strong>{models.map((model) => <p key={model.id}>{model.comparison[key]}</p>)}</div>)}</div><button className={styles.goldButton} onClick={() => state.setView("universe")}>Elegir una misión <span>→</span></button></section>;
}

export function NextMoveExperience() {
  const state = useLabState();
  if (!state.ready) return <main className={styles.shell}><div className={styles.loading}>Preparando tu laboratorio…</div></main>;
  const content = state.view === "decision" ? <Decision state={state} /> : state.view === "mission" ? <Mission state={state} /> : state.view === "compare" ? <Compare state={state} /> : <Universe state={state} />;
  return <main className={styles.shell}><a className="skip-link" href="#next-move-content">Saltar al contenido</a><Header state={state} /><div id="next-move-content">{content}</div><footer className={styles.footer}><span>Una experiencia para convertir curiosidad en criterio.</span><Link href="/privacidad">Privacidad</Link><PrivacyPreferencesButton /></footer></main>;
}
