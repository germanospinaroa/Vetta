import { NextResponse } from "next/server";
import { MODEL_BY_ID, type DecisionOption } from "@/lib/next-move-models";

export const runtime = "nodejs";

const ANSI: Record<string, number> = { "á": 0xe1, "é": 0xe9, "í": 0xed, "ó": 0xf3, "ú": 0xfa, "ñ": 0xf1, "Á": 0xc1, "É": 0xc9, "Í": 0xcd, "Ó": 0xd3, "Ú": 0xda, "Ñ": 0xd1, "¿": 0xbf, "¡": 0xa1, "·": 0xb7, "—": 0x97, "“": 0x93, "”": 0x94, "’": 0x92, "«": 0xab, "»": 0xbb };
function escapePdf(value: string) { return Array.from(value).map((char) => { if (char === "\\") return "\\\\"; if (char === "(") return "\\("; if (char === ")") return "\\)"; const code = ANSI[char]; return code ? `\\${code.toString(8).padStart(3, "0")}` : /[\x20-\x7E\n]/.test(char) ? char : "?"; }).join(""); }
function wrap(value: string, width = 77) { const words = value.replace(/\s+/g, " ").trim().split(" "); const lines: string[] = []; let line = ""; for (const word of words) { if ((line + " " + word).trim().length > width && line) { lines.push(line); line = word; } else line = (line + " " + word).trim(); } if (line) lines.push(line); return lines; }

type PdfLine = { text: string; kind?: "title" | "label" | "body" | "muted" | "accent" };
function section(label: string, text: string | string[]): PdfLine[] { return [{ text: label, kind: "label" }, ...(Array.isArray(text) ? text.flatMap((item) => wrap(item).map((line) => ({ text: line, kind: "body" as const }))) : wrap(text).map((line) => ({ text: line, kind: "body" as const }))), { text: "", kind: "body" }]; }

function buildPdf(modelId: string, decisionId: DecisionOption["id"]) {
  const model = MODEL_BY_ID[modelId];
  if (!model) return null;
  const option = model.scenario.options.find((item) => item.id === decisionId) || model.scenario.options[0];
  const lines: PdfLine[] = [
    { text: "TU PRÓXIMO MOVIMIENTO", kind: "title" },
    { text: "MI PRIMERA PRUEBA DE REALIDAD", kind: "accent" },
    { text: `${model.name} · DECISIÓN ${option.id.toUpperCase()} · 48 HORAS`, kind: "muted" },
    { text: "", kind: "body" },
    ...section("TU SITUACIÓN", model.scenario.situation),
    ...section("TU DECISIÓN", option.label),
    ...section("HIPÓTESIS QUE VAS A COMPROBAR", model.mission.hypothesis),
    ...section("TRES MOVIMIENTOS", model.mission.movements.map((move, index) => `${index + 1}. ${move}`)),
    ...section("CONVERSACIÓN PREPARADA", model.mission.conversation),
    ...section("QUÉ REGISTRAR", model.mission.record.map((item) => `- ${item}`)),
    ...section("TU PUNTO CIEGO", `${option.blindSpot} Compruébalo así: ${option.verification}`),
    ...section("EVIDENCIA ÚTIL", model.mission.evidence),
    ...section("NO ES EVIDENCIA SUFICIENTE", model.mission.notEvidence),
    ...section("SIGUIENTE DECISIÓN", model.mission.nextDecision),
  ];
  const pageLines: PdfLine[][] = [];
  for (let index = 0; index < lines.length; index += 43) pageLines.push(lines.slice(index, index + 43));
  const objects: string[] = [];
  const add = (body: string) => { objects.push(body); return objects.length; };
  const pagesObject = add("<< /Type /Pages /Kids [] /Count 0 >>");
  const fontObject = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const boldObject = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const pageIds: number[] = [];
  for (const [pageIndex, page] of pageLines.entries()) {
    const contentLines = pageIndex === 0 ? page.slice(3) : page;
    const commands = ["q", "0.035 0.055 0.09 rg", "0 0 595 842 re", "f", "Q", "BT", "/F2 25 Tf", "0.96 0.94 0.88 rg", "54 785 Td", "(TU PRÓXIMO MOVIMIENTO) Tj", "/F1 10 Tf", "0.77 0.64 0.42 rg", "0 -22 Td", "(MI PRIMERA PRUEBA DE REALIDAD) Tj", "/F1 9 Tf", "0.65 0.71 0.78 rg", "0 -16 Td", `(${escapePdf(`${model.name} · DECISIÓN ${option.id.toUpperCase()} · 48 HORAS`)}) Tj`, "0 -28 Td"];
    let y = 0;
    for (const line of contentLines) {
      if (line.kind === "label") { commands.push("/F2 8 Tf", "0.48 0.85 0.9 rg", `(${escapePdf(line.text)}) Tj`, "0 -14 Td"); y += 14; continue; }
      if (line.text === "") { commands.push("0 -10 Td"); y += 10; continue; }
      const size = line.kind === "accent" ? 11 : 10;
      commands.push(`/F1 ${size} Tf`, line.kind === "muted" ? "0.65 0.71 0.78 rg" : "0.91 0.91 0.88 rg", `(${escapePdf(line.text)}) Tj`, "0 -13 Td"); y += 13;
      if (y > 710) break;
    }
    commands.push("ET");
    const stream = commands.join("\n");
    const content = add(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesObject} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObject} 0 R /F2 ${boldObject} 0 R >> >> /Contents ${content} 0 R >>`));
  }
  objects[pagesObject - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  const catalogId = add(`<< /Type /Catalog /Pages ${pagesObject} 0 R >>`);
  let pdf = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n"; const offsets: number[] = [0];
  for (let index = 0; index < objects.length; index++) { offsets.push(Buffer.byteLength(pdf, "binary")); pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`; }
  const xref = Buffer.byteLength(pdf, "binary"); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "binary");
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { modelId?: unknown; decisionId?: unknown };
    const modelId = typeof body.modelId === "string" ? body.modelId : "";
    const decisionId = body.decisionId === "a" || body.decisionId === "b" || body.decisionId === "c" ? body.decisionId : "a";
    const pdf = buildPdf(modelId, decisionId);
    if (!pdf) return NextResponse.json({ error: "model_required" }, { status: 400 });
    return new NextResponse(pdf, { headers: { "content-type": "application/pdf", "content-disposition": "attachment; filename=tu-primera-prueba-de-realidad.pdf", "cache-control": "no-store" } });
  } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
}
