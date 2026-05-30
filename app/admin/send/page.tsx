"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const isValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fmtSize = (b: number) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

const toBase64 = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(",")[1]);
    r.onerror = () => rej(new Error("No se pudo leer el archivo"));
    r.readAsDataURL(file);
  });

function Section({ num, title, children }: { num: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#1E1230] border border-[#2D1B3D] rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#6366f1]">{num}</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9B8BA3]">— {title}</span>
        <div className="flex-1 h-px bg-[#2D1B3D]" />
      </div>
      {children}
    </div>
  );
}

interface LogEntry { type: "ok" | "err" | "info"; msg: string; }

export default function SendPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfB64, setPdfB64] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const addEmail = useCallback((raw: string) => {
    const e = raw.trim().toLowerCase();
    if (!e) return;
    setEmails((prev) => prev.includes(e) ? prev : [...prev, e]);
    setDraft("");
  }, []);

  const removeEmail = (e: string) => setEmails((prev) => prev.filter((x) => x !== e));

  const handleKey = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if ([",", ";", "Enter", "Tab"].includes(ev.key)) {
      ev.preventDefault();
      addEmail(draft);
    } else if (ev.key === "Backspace" && !draft) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  const handlePaste = (ev: React.ClipboardEvent<HTMLInputElement>) => {
    ev.preventDefault();
    const text = ev.clipboardData.getData("text");
    text.split(/[\n,;\s]+/).forEach((p) => { if (p.trim()) addEmail(p); });
  };

  const handleFile = async (file: File | null | undefined) => {
    if (!file || file.type !== "application/pdf") return;
    try {
      const b64 = await toBase64(file);
      setPdfFile(file);
      setPdfB64(b64);
    } catch { /* ignore */ }
  };

  const clearFile = () => { setPdfFile(null); setPdfB64(null); };

  const addLog = (type: LogEntry["type"], msg: string) => {
    setLog((prev) => [...prev, { type, msg }]);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 50);
  };

  const validEmails = emails.filter(isValid);
  const canSend = validEmails.length > 0 && subject.trim() && body.trim() && !sending;

  const sendAll = async () => {
    if (!canSend) return;
    setSending(true);
    setDone(false);
    setLog([]);
    setProgress({ done: 0, total: validEmails.length });
    addLog("info", `Iniciando envío a ${validEmails.length} destinatario(s)…`);

    let ok = 0, fail = 0;

    for (let i = 0; i < validEmails.length; i++) {
      const to = validEmails[i];
      setProgress({ done: i, total: validEmails.length });
      try {
        const res = await fetch("/api/admin/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, subject, body, pdfBase64: pdfB64, pdfName: pdfFile?.name ?? null }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        ok++;
        addLog("ok", `✓ Enviado → ${to}`);
      } catch (err: any) {
        fail++;
        addLog("err", `✗ Falló → ${to}  (${err.message})`);
      }
      if (i < validEmails.length - 1) await sleep(1800);
    }

    setProgress({ done: validEmails.length, total: validEmails.length });
    setSending(false);
    setDone(true);
    addLog("info", `Completado: ${ok} enviados, ${fail} fallidos.`);
  };

  const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="absolute inset-0 overflow-y-auto bg-[#1a1025] text-gray-100 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.push("/admin/analytics")}
            className="p-1.5 rounded-lg text-[#9B8BA3] hover:bg-[#2D1B3D] hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#6366f1] border border-[#6366f1]/40 px-2.5 py-1 rounded">
            ✦ Envío Privado
          </span>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Correo masivo<br />
          <span className="text-[#6366f1]">sin rastros</span>
        </h1>
        <p className="font-mono text-xs text-[#6B5B73] mt-2">
          {"// cada destinatario recibe su propio correo individual"}
        </p>
      </div>

      <div className="w-full max-w-2xl">

        {/* 01 Destinatarios */}
        <Section num="01" title="Destinatarios">
          {emails.length > 0 && (
            <span className="font-mono text-[11px] bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] rounded px-2 py-0.5 mb-3 inline-block">
              {validEmails.length} válido{validEmails.length !== 1 ? "s" : ""}
            </span>
          )}
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6B5B73] mb-2">Direcciones</label>
          <div
            className="bg-[#120D1E] border border-[#2D1B3D] rounded-xl p-2 flex flex-wrap gap-1.5 min-h-[50px] cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {emails.map((e) => (
              <span key={e} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${isValid(e) ? "bg-[#6366f1]/10 border-[#6366f1]/30 text-[#a5b4fc]" : "bg-red-900/10 border-red-700/30 text-red-400"}`}>
                {e}
                <button onClick={() => removeEmail(e)} className="opacity-60 hover:opacity-100 text-sm leading-none">×</button>
              </span>
            ))}
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              onPaste={handlePaste}
              onBlur={() => draft && addEmail(draft)}
              placeholder={emails.length ? "" : "correo@ejemplo.com"}
              className="bg-transparent border-none outline-none text-gray-100 font-mono text-sm flex-1 min-w-[160px] px-1 py-1"
            />
          </div>
          <p className="font-mono text-[11px] text-[#6B5B73] mt-2">
            ↵ Enter · Tab · coma · punto y coma para agregar · Pega una lista entera
          </p>
        </Section>

        {/* 02 Contenido */}
        <Section num="02" title="Contenido del correo">
          <div className="mb-4">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6B5B73] mb-1.5">Asunto</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del correo…"
              className="w-full px-3 py-2.5 bg-[#120D1E] border border-[#2D1B3D] rounded-xl text-sm font-mono focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#4D3568]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6B5B73] mb-1.5">Cuerpo</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder={"Escribe aquí el contenido del correo…\n\nPuedes usar varias líneas."}
              className="w-full px-3 py-2.5 bg-[#120D1E] border border-[#2D1B3D] rounded-xl text-sm font-mono focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#4D3568] resize-y"
            />
          </div>
        </Section>

        {/* 03 PDF */}
        <Section num="03" title={<>Adjunto PDF <span className="text-[#4D3568] normal-case font-normal">(opcional)</span></> as any}>
          {!pdfFile ? (
            <label
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${dragOver ? "border-[#6366f1] bg-[#6366f1]/5" : "border-[#2D1B3D] hover:border-[#6366f1] hover:bg-[#6366f1]/3"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            >
              <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
              <div className="text-3xl mb-2">📎</div>
              <p className="font-mono text-sm text-[#6B5B73]">
                <strong className="text-[#6366f1]">Clic</strong> o arrastrá tu PDF aquí
              </p>
            </label>
          ) : (
            <div className="flex items-center gap-3 bg-green-900/10 border border-green-800/30 rounded-xl px-4 py-3">
              <span>📄</span>
              <span className="font-mono text-sm text-green-400">{pdfFile.name}</span>
              <span className="font-mono text-xs text-[#6B5B73]">{fmtSize(pdfFile.size)}</span>
              <button onClick={clearFile} className="ml-auto text-[#6B5B73] hover:text-red-400 transition-colors">✕</button>
            </div>
          )}
        </Section>

        {/* 04 Enviar */}
        <Section num="04" title="Enviar">
          <div className="bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-xl p-4 mb-5 font-mono text-xs text-[#6B5B73] leading-relaxed">
            ⚡ Cada destinatario recibe un correo <strong className="text-gray-200">individual</strong>.<br />
            Nadie ve las direcciones de los demás. Sin CC ni BCC visible.<br />
            Envío uno por uno con pausa de 1.8 s entre correos.
          </div>

          <button
            disabled={!canSend}
            onClick={sendAll}
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
              sending
                ? "bg-[#6366f1] text-white cursor-not-allowed"
                : canSend
                ? "bg-[#6366f1] hover:bg-[#4f46e5] text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/40"
                : "bg-[#2D1B3D] text-[#4D3568] cursor-not-allowed"
            }`}
          >
            {sending
              ? `⏳ Enviando ${progress ? `${progress.done}/${progress.total}` : ""}…`
              : done
              ? "✓ Completado — enviar de nuevo"
              : `⚡ Enviar a ${validEmails.length || 0} destinatario${validEmails.length !== 1 ? "s" : ""}`}
          </button>

          {/* Progress bar */}
          {progress && (
            <div className="mt-4">
              <div className="h-1 bg-[#2D1B3D] rounded-full overflow-hidden">
                <div className="h-full bg-[#6366f1] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between mt-2 font-mono text-xs text-[#6B5B73]">
                <span>{pct === 100 ? "Completado" : `Enviando ${progress.done + 1} de ${progress.total}…`}</span>
                <span>{pct}%</span>
              </div>
            </div>
          )}

          {/* Log */}
          {log.length > 0 && (
            <div ref={logRef} className="mt-4 max-h-48 overflow-y-auto space-y-1">
              {log.map((l, i) => (
                <div key={i} className={`px-3 py-1.5 rounded-lg font-mono text-xs ${
                  l.type === "ok" ? "bg-green-900/10 text-green-400" :
                  l.type === "err" ? "bg-red-900/10 text-red-400" :
                  "bg-[#6366f1]/8 text-[#a5b4fc]"
                }`}>{l.msg}</div>
              ))}
            </div>
          )}

          {/* Summary */}
          {done && (
            <div className="mt-4 bg-green-900/10 border border-green-800/30 rounded-xl p-4">
              <p className="font-mono text-sm text-green-400 mb-1">✓ Envío completado</p>
              <p className="font-mono text-xs text-[#6B5B73]">
                Enviados: {log.filter(l => l.type === "ok").length} &nbsp;·&nbsp;
                Fallidos: {log.filter(l => l.type === "err").length} &nbsp;·&nbsp;
                Total: {validEmails.length}
              </p>
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
