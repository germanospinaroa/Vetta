"use client";

import { useState } from "react";

const questions = [
  ["¿Necesito tener experiencia emprendiendo?", "No. La experiencia está diseñada para quienes están considerando diferentes oportunidades y quieren aprender a evaluarlas mejor."],
  ["¿Tengo que tener una idea de negocio?", "No necesariamente. Puedes utilizar los criterios tanto para analizar una idea que ya tengas como para evaluar oportunidades futuras."],
  ["¿Por qué son dos encuentros?", "Porque primero trabajaremos cómo evaluar y después cómo convertir esa evaluación en una decisión. Son dos partes de una misma experiencia."],
  ["¿Cómo recibiré el acceso?", "Después de registrarte, podrás confirmar tu acceso por WhatsApp. Allí recibirás las indicaciones para ingresar al grupo privado y acceder a la herramienta de evaluación."],
  ["¿Es una presentación de una oportunidad de negocio?", "La experiencia está organizada por Elite Focus, un equipo vinculado a Zilis. Su objetivo inicial es enseñar criterios aplicables a distintas oportunidades. En el segundo encuentro podrá presentarse una alternativa comercial real para evaluarla con esos mismos criterios. Participar no implica obligación de comprar productos ni incorporarte al negocio."],
  ["¿Necesito participar en vivo?", "La experiencia está diseñada para vivirse en los dos encuentros en directo. No prometemos grabaciones ni repeticiones no confirmadas."],
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="faq-list">{questions.map(([question, answer], index) => <div className="faq-item" key={question}><button className="faq-trigger" type="button" aria-expanded={open === index} aria-controls={`faq-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{question}</span><span aria-hidden="true">{open === index ? "−" : "+"}</span></button><div className={`faq-answer ${open === index ? "is-open" : ""}`} id={`faq-${index}`} role="region" hidden={open !== index}><p>{answer}</p></div></div>)}</div>;
}
