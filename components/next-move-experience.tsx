"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BUSINESS_MODELS, INTENT_OPTIONS, MODEL_BY_ID, type BusinessModel } from "@/lib/next-move-models";
import styles from "./next-move-experience.module.css";

const STORAGE_KEY = "vetta-next-move-selection-v1";
const DEMO_SELECTION = ["services", "ecommerce", "direct"];

type View = "universe" | "model" | "week" | "compare" | "dossier";

function useExperienceState() {
  const [selection, setSelection] = useState<string[]>([]);
  const [view, setView] = useState<View>("universe");
  const [activeId, setActiveId] = useState(BUSINESS_MODELS[0].id);
  const [intent, setIntent] = useState("");
  const [customIntent, setCustomIntent] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as { selection?: string[]; intent?: string; customIntent?: string } | null;
    const demo = params.get("demo") === "laura";
    queueMicrotask(() => {
      setSelection(demo ? DEMO_SELECTION : (saved?.selection || []).filter((id) => MODEL_BY_ID[id]));
      setIntent(demo ? INTENT_OPTIONS[0] : saved?.intent || "");
      setCustomIntent(demo ? "Quiero explorar maneras de construir una segunda fuente de ingresos." : saved?.customIntent || "");
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ selection, intent, customIntent }));
  }, [ready, selection, intent, customIntent]);

  return { selection, setSelection, view, setView, activeId, setActiveId, intent, setIntent, customIntent, setCustomIntent, ready };
}

function ModelVisual({ model, small = false }: { model: BusinessModel; small?: boolean }) {
  return <div className={`${styles.modelVisual} ${styles[model.visual]} ${small ? styles.visualSmall : ""}`} aria-hidden="true"><span>{model.name.split(" ").map((word) => word[0]).join("")}</span><i /><b /><em /></div>;
}

function SelectionBar({ selection, onCompare, onClear }: { selection: string[]; onCompare: () => void; onClear: () => void }) {
  return <div className={styles.selectionBar}><span><strong>{selection.length}</strong> de 3 rutas en tu sala</span><div>{selection.length > 0 && <button className={styles.textButton} onClick={onClear}>Reiniciar</button>}<button className={styles.goldButton} onClick={onCompare} disabled={selection.length === 0}>Comparar rutas <span>→</span></button></div></div>;
}

function Universe({ state }: { state: ReturnType<typeof useExperienceState> }) {
  return <section className={styles.universe}>
    <div className={styles.eyebrow}>01 / EL UNIVERSO</div>
    <h2 className="next-move-mobile-fit">¿Qué mundo quieres <i>explorar?</i></h2>
    <p className={styles.sectionLead}>Cada modelo ofrece posibilidades distintas. Descubre qué hay detrás antes de decidir cuál te interesa.</p>
    <div className={styles.modelGrid}>{BUSINESS_MODELS.map((model, index) => {
      const selected = state.selection.includes(model.id);
      return <article className={`${styles.modelCard} ${selected ? styles.selected : ""}`} key={model.id}>
        <button className={styles.cardOpen} onClick={() => { state.setActiveId(model.id); state.setView("model"); }} aria-label={`Explorar ${model.name}`}><ModelVisual model={model} /><span className={styles.cardIndex}>0{index + 1}</span><div><h3>{model.name}</h3><p>{model.tagline}</p></div><span className={styles.cardArrow}>↗</span></button>
        <button className={styles.selectButton} onClick={() => state.setSelection(selected ? state.selection.filter((id) => id !== model.id) : state.selection.length < 3 ? [...state.selection, model.id] : state.selection)}>{selected ? "En tu sala · Quitar" : state.selection.length >= 3 ? "Explorar · elige desde la sala" : "Añadir a mi sala"}</button>
      </article>;
    })}</div>
    <SelectionBar selection={state.selection} onCompare={() => state.setView("compare")} onClear={() => { state.setSelection([]); state.setView("universe"); }} />
  </section>;
}

function ModelDetail({ state }: { state: ReturnType<typeof useExperienceState> }) {
  const model = MODEL_BY_ID[state.activeId];
  const selected = state.selection.includes(model.id);
  return <section className={styles.detailPage}>
    <button className={styles.backButton} onClick={() => state.setView("universe")}>← Volver al universo</button>
    <div className={styles.detailHero}><div><div className={styles.eyebrow}>02 / LO QUE HAY DETRÁS</div><h2>{model.name}<br /><i>{model.tagline}</i></h2><p>{model.whatYouSee}</p></div><ModelVisual model={model} /></div>
    <div className={styles.reveal}><div><span className={styles.revealLabel}>LO QUE VES</span><p>{model.whatYouSee}</p></div><div className={styles.revealBuild}><span className={styles.revealLabel}>LO QUE CONSTRUYES</span><p>{model.whatYouBuild}</p></div></div>
    <div className={styles.infoGrid}><InfoBlock title="Qué ofrece realmente" text={model.whatYouOffer} /><InfoBlock title="Cómo genera ingresos" text={model.howRevenueWorks} /><ListBlock title="Qué puedes aprovechar" items={model.existingInfrastructure} /><ListBlock title="Qué te corresponde construir" items={model.personalResponsibilities} /><ListBlock title="Habilidades a desarrollar" items={model.skillsToDevelop} /><ListBlock title="Condiciones a comprobar" items={model.conditionsToVerify} /></div>
    <div className={styles.decisive}><span className={styles.eyebrow}>LA PREGUNTA DECISIVA</span><p>“{model.decisiveQuestion}”</p></div>
    <div className={styles.detailActions}><button className={styles.goldButton} onClick={() => { state.setActiveId(model.id); state.setView("week"); }}>Vivir el comienzo <span>→</span></button><button className={selected ? styles.selectedOutline : styles.outlineButton} onClick={() => state.setSelection(selected ? state.selection.filter((id) => id !== model.id) : state.selection.length < 3 ? [...state.selection, model.id] : state.selection)}>{selected ? "En tu sala · Quitar" : "Añadir a mi sala"}</button></div>
  </section>;
}

function InfoBlock({ title, text }: { title: string; text: string }) { return <div className={styles.infoBlock}><h3>{title}</h3><p>{text}</p></div>; }
function ListBlock({ title, items }: { title: string; items: string[] }) { return <div className={styles.infoBlock}><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>; }

function FirstWeek({ state }: { state: ReturnType<typeof useExperienceState> }) {
  const model = MODEL_BY_ID[state.activeId];
  return <section className={styles.weekPage}><button className={styles.backButton} onClick={() => state.setView("model")}>← Volver a {model.name}</button><div className={styles.weekIntro}><div className={styles.eyebrow}>03 / VIVE EL COMIENZO</div><h2>Una primera semana de <i>exploración.</i></h2><p>No es una promesa de que tu negocio estará funcionando en siete días. Es una forma de observar qué tendrías que entender antes de dar un compromiso mayor.</p></div><div className={styles.weekList}>{model.firstWeek.map((move, index) => <article key={move.title}><span>0{index + 1}</span><div><h3>{move.title}</h3><p>{move.description}</p><small><b>Qué podrías aprender</b> {move.expectedLearning}</small></div></article>)}</div><div className={styles.weekFooter}><p>¿Quieres llevar este mundo a tu sala de decisiones?</p><button className={styles.goldButton} onClick={() => { if (!state.selection.includes(model.id) && state.selection.length < 3) state.setSelection([...state.selection, model.id]); state.setView("compare"); }}>Abrir la sala <span>→</span></button></div></section>;
}

function Compare({ state }: { state: ReturnType<typeof useExperienceState> }) {
  const models = state.selection.map((id) => MODEL_BY_ID[id]).filter(Boolean);
  return <section className={styles.comparePage}><button className={styles.backButton} onClick={() => state.setView("universe")}>← Seguir explorando</button><div className={styles.eyebrow}>04 / LA SALA DE DECISIONES</div><h2>Tres caminos.<br /><i>Una mirada más clara.</i></h2><p className={styles.sectionLead}>Ahora que conoces lo que hay detrás, compáralos desde lo que realmente tendrías que construir.</p>{models.length === 0 ? <div className={styles.emptyRoom}><p>Añade al menos una ruta desde el universo.</p><button className={styles.goldButton} onClick={() => state.setView("universe")}>Explorar mundos <span>→</span></button></div> : <><div className={styles.compareColumns}>{models.map((model) => <article key={model.id}><ModelVisual model={model} small /><h3>{model.name}</h3><button className={styles.textButton} onClick={() => { state.setActiveId(model.id); state.setView("model"); }}>Abrir experiencia</button><button className={styles.removeButton} onClick={() => state.setSelection(state.selection.filter((id) => id !== model.id))}>Quitar ruta</button></article>)}</div><div className={styles.compareRows}>{(["offer", "builds", "leverages", "learns", "operations", "risksToVerify"] as const).map((key, index) => <div className={styles.compareRow} key={key}><strong>{["¿Qué ofreces?", "¿Qué construyes?", "¿Qué puedes aprovechar?", "¿Qué debes aprender?", "¿Qué actividad implica?", "¿Qué debes verificar?"][index]}</strong>{models.map((model) => <p key={model.id}>{model.comparison[key]}</p>)}</div>)}</div><button className={styles.goldButton} onClick={() => state.setView("dossier")}>Construir mi expediente <span>→</span></button></>}</section>;
}

function Dossier({ state }: { state: ReturnType<typeof useExperienceState> }) {
  const models = useMemo(() => state.selection.map((id) => MODEL_BY_ID[id]).filter(Boolean), [state.selection]);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const finalIntent = state.customIntent.trim() || state.intent || "Explorar nuevas posibilidades empresariales.";
  async function download() {
    setGenerating(true); setMessage("");
    try { const response = await fetch("/api/tu-proximo-movimiento/pdf", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ selection: models.map((model) => model.id), intent: finalIntent }) }); if (!response.ok) throw new Error("pdf_failed"); const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "tu-proximo-movimiento.pdf"; anchor.click(); URL.revokeObjectURL(url); setMessage("Tu expediente está listo para guardar."); } catch { setMessage("No pudimos generar el expediente. Inténtalo de nuevo."); } finally { setGenerating(false); }
  }
  return <section className={styles.dossierPage}><button className={styles.backButton} onClick={() => state.setView("compare")}>← Volver a comparar</button><div className={styles.dossierCover}><div className={styles.eyebrow}>05 / TU EXPEDIENTE</div><h2>Tu mapa de <i>posibilidades.</i></h2><p>Exploraste diferentes maneras de construir una actividad empresarial. Ahora tienes una perspectiva más clara sobre qué implicaría desarrollar cada una.</p><div className={styles.coverLine}>{models.map((model) => <span key={model.id}>{model.shortName}</span>)}</div></div><div className={styles.intentBox}><h3>¿Qué te gustaría comenzar a construir?</h3><p>Opcional. Tu respuesta solo organiza el expediente local que vas a descargar.</p><div className={styles.intentOptions}>{INTENT_OPTIONS.map((option) => <button key={option} className={state.intent === option ? styles.intentSelected : ""} onClick={() => { state.setIntent(option); state.setCustomIntent(""); }}>{option}</button>)}</div><label>O escribe una intención breve <span>(máximo 140 caracteres)</span><textarea maxLength={140} value={state.customIntent} onChange={(event) => { state.setCustomIntent(event.target.value); setMessage(""); }} placeholder="Mi intención es..." /></label></div><div className={styles.dossierPreview}><span className={styles.eyebrow}>TU PRÓXIMO MOVIMIENTO · OCTUBRE 2026</span><h3>Un expediente para seguir investigando.</h3><p>Incluye tu punto de partida, el panorama de posibilidades, cada ruta explorada, la comparación y tus próximos movimientos.</p><div className={styles.dossierChips}>{models.map((model) => <span key={model.id}>{model.name}</span>)}</div></div><div className={styles.detailActions}><button className={styles.goldButton} onClick={download} disabled={generating}>{generating ? "Organizando tu expediente…" : "Guardar mi expediente"} <span>↓</span></button><button className={styles.outlineButton} onClick={() => state.setView("universe")}>Volver a explorar</button></div>{message && <p className={styles.status} aria-live="polite">{message}</p>}</section>;
}

export function NextMoveExperience() {
  const state = useExperienceState();
  const activeView = state.view === "model" ? <ModelDetail state={state} /> : state.view === "week" ? <FirstWeek state={state} /> : state.view === "compare" ? <Compare state={state} /> : state.view === "dossier" ? <Dossier state={state} /> : <Universe state={state} />;
  if (!state.ready) return <main className={styles.shell}><div className={styles.loading}>Preparando tu espacio de exploración…</div></main>;
  return <main className={styles.shell}><a className="skip-link" href="#next-move-content">Saltar al contenido</a><header className={styles.header}><Link href="/" className={styles.logo}><span>✦</span> NO EMPRENDAS TODAVÍA.</Link><span className={styles.headerMeta}>TU PRÓXIMO MOVIMIENTO</span><button className={styles.headerReset} onClick={() => { state.setSelection([]); state.setIntent(""); state.setCustomIntent(""); state.setView("universe"); }}>Reiniciar</button></header><div id="next-move-content">{activeView}</div><footer className={styles.footer}><span>Una experiencia para descubrir tu siguiente posibilidad.</span><Link href="/privacidad">Privacidad</Link></footer></main>;
}
