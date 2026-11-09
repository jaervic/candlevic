"use client";

import { useRef, useState } from "react";
import {
  Award,
  Check,
  Cloud,
  Copy,
  Download,
  Flame,
  KeyRound,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  completedCount,
  exportProgress,
  levelFromXp,
  totalXp,
  useProgress,
} from "@/lib/progress";
import {
  generateCode,
  loadBackup,
  saveBackup,
} from "@/lib/backup";
import {
  decodeBackup,
  encodeBackup,
  isSelfContainedCode,
} from "@/lib/selfbackup";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDate } from "@/lib/utils";

type Status = { type: "ok" | "err"; message: string } | null;

export function ProgressPanel({ lessonSlugs }: { lessonSlugs: string[] }) {
  const hydrated = useHydrated();
  const lessons = useProgress((s) => s.lessons);
  const streak = useProgress((s) => s.streak.current);
  const profile = useProgress((s) => s.profile);
  const savedCode = useProgress((s) => s.savedCode);
  const setSavedCode = useProgress((s) => s.setSavedCode);
  const merge = useProgress((s) => s.merge);
  const importState = useProgress((s) => s.importState);
  const reset = useProgress((s) => s.reset);

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [restoreCode, setRestoreCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isSelf = savedCode ? isSelfContainedCode(savedCode) : false;

  const xp = hydrated ? totalXp(lessons) : 0;
  const completed = hydrated ? completedCount(lessons) : 0;
  const level = levelFromXp(xp);
  const quizScores = Object.values(lessons)
    .map((l) => l.quizScore)
    .filter((score): score is number => score != null);
  const averageQuiz = quizScores.length
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  const badges = [
    { label: "Primera lección", done: completed >= 1, icon: Zap },
    { label: "5 lecciones", done: completed >= 5, icon: Flame },
    { label: "Quiz perfecto", done: quizScores.some((s) => s === 100), icon: Award },
    { label: "Racha de 3 días", done: streak >= 3, icon: Flame },
    { label: "Racha de 7 días", done: streak >= 7, icon: Flame },
    { label: "Perfil de trader", done: Boolean(profile), icon: ShieldCheck },
    { label: "Respaldo creado", done: Boolean(savedCode), icon: Cloud },
  ];

  async function createBackup() {
    setBusy(true);
    setStatus(null);
    const code = generateCode();
    const state = useProgress.getState();
    const result = await saveBackup(code, {
      lessons: state.lessons,
      streak: state.streak,
      profile: state.profile,
      startedAt: state.startedAt,
      savedCode: code,
    });
    setBusy(false);
    if (result.ok) {
      setSavedCode(code);
      setShowCode(true);
      setStatus({
        type: "ok",
        message: "Respaldo creado. Guarda el código en un lugar seguro.",
      });
    } else {
      const selfCode = encodeBackup(
        {
          lessons: state.lessons,
          streak: state.streak,
          profile: state.profile,
          startedAt: state.startedAt,
          savedCode: null,
        },
        lessonSlugs,
      );
      setSavedCode(selfCode);
      setShowCode(true);
      setStatus({
        type: "ok",
        message:
          "La nube no está disponible, así que hemos creado un código autónomo: lleva tu progreso dentro y funciona sin servidor. Cópialo y guárdalo.",
      });
    }
  }

  async function saveNow() {
    if (!savedCode) return;
    setBusy(true);
    setStatus(null);
    const state = useProgress.getState();

    if (isSelfContainedCode(savedCode)) {
      const nextCode = encodeBackup(
        {
          lessons: state.lessons,
          streak: state.streak,
          profile: state.profile,
          startedAt: state.startedAt,
          savedCode: null,
        },
        lessonSlugs,
      );
      setSavedCode(nextCode);
      setShowCode(true);
      setBusy(false);
      setStatus({
        type: "ok",
        message: "Código actualizado. Vuelve a copiarlo para no perder los últimos avances.",
      });
      return;
    }

    const result = await saveBackup(savedCode, {
      lessons: state.lessons,
      streak: state.streak,
      profile: state.profile,
      startedAt: state.startedAt,
      savedCode,
    });
    setBusy(false);
    setStatus(
      result.ok
        ? { type: "ok", message: "Progreso guardado en la nube." }
        : { type: "err", message: result.error },
    );
  }

  async function restore() {
    const value = restoreCode.trim();
    if (!value) return;
    setBusy(true);
    setStatus(null);

    if (isSelfContainedCode(value)) {
      const decoded = decodeBackup(value, lessonSlugs);
      setBusy(false);
      if (decoded) {
        merge(decoded);
        setSavedCode(value.toUpperCase());
        setStatus({
          type: "ok",
          message: "Progreso recuperado desde el código autónomo.",
        });
        setRestoreCode("");
      } else {
        setStatus({
          type: "err",
          message: "El código autónomo está incompleto o dañado.",
        });
      }
      return;
    }

    const result = await loadBackup(value);
    setBusy(false);
    if (result.ok) {
      merge(result.data);
      setSavedCode(value.toUpperCase());
      setStatus({
        type: "ok",
        message: "Progreso recuperado y fusionado con el de este dispositivo.",
      });
      setRestoreCode("");
    } else {
      setStatus({ type: "err", message: result.error });
    }
  }

  function exportFile() {
    const state = useProgress.getState();
    const blob = new Blob([exportProgress(state)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candlevic-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ type: "ok", message: "Archivo de progreso descargado." });
  }

  async function importFile(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { app?: string; data?: unknown };
      if (parsed.app !== "candlevic" || !parsed.data) {
        throw new Error("formato");
      }
      const ok = importState(parsed.data);
      setStatus(
        ok
          ? { type: "ok", message: "Progreso importado y fusionado." }
          : { type: "err", message: "El archivo no tiene un formato válido." },
      );
    } catch {
      setStatus({ type: "err", message: "No se pudo leer el archivo." });
    }
  }

  function copyCode() {
    if (!savedCode) return;
    navigator.clipboard
      .writeText(savedCode)
      .then(() =>
        setStatus({ type: "ok", message: "Código copiado al portapapeles." }),
      )
      .catch(() =>
        setStatus({ type: "err", message: "No se pudo copiar. Anótalo a mano." }),
      );
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Tu cuenta
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Progreso</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Todo se guarda en este dispositivo. Crea un código para no perderlo si
          cambias de móvil o borras los datos.
        </p>
      </header>

      <section className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
        <ProgressRing value={level.progress} size={76} stroke={6}>
          <div className="text-center">
            <p className="num text-[16px] font-semibold leading-none">
              {hydrated ? level.level : 1}
            </p>
            <p className="text-[8px] uppercase tracking-widest text-faint">nivel</p>
          </div>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">
              <Zap className="h-3 w-3" /> {xp} XP
            </Badge>
            <Badge tone="default">
              <Flame className="h-3 w-3" /> {hydrated ? streak : 0} días
            </Badge>
          </div>
          <p className="mt-1.5 text-[12px] text-muted">
            {completed} lecciones completadas
            {averageQuiz > 0 && ` · media de quizzes ${averageQuiz}%`}
          </p>
          <ProgressBar value={level.progress} className="mt-2" />
          <p className="mt-1 text-[10px] text-faint">
            {100 - level.progress} XP para el siguiente nivel
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Logros</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className={`flex items-center gap-2 rounded-xl border p-2.5 ${
                badge.done
                  ? "border-accent/25 bg-accent/10"
                  : "border-line bg-surface opacity-55"
              }`}
            >
              <badge.icon
                className={`h-4 w-4 shrink-0 ${
                  badge.done ? "text-accent" : "text-faint"
                }`}
              />
              <span className="text-[11px] leading-tight">{badge.label}</span>
              {badge.done && <Check className="ml-auto h-3 w-3 text-up" />}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold">Código de guardado</h2>
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
          {isSelf
            ? "Código autónomo: tu progreso viaja dentro del código. No depende de ningún servidor ni de este navegador. Vuelve a copiarlo cuando avances."
            : "Cifrado en tu navegador con el código. Ni siquiera el servidor puede leerlo. Si pierdes el código, pierdes el respaldo."}
        </p>

        {savedCode ? (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 p-2.5">
              <code className="num flex-1 break-all text-[13px] leading-snug tracking-wider text-accent">
                {showCode ? savedCode : "••••-••••-••••"}
              </code>
              <button
                onClick={() => setShowCode((v) => !v)}
                className="rounded-md px-2 py-1 text-[10px] text-muted hover:text-fg"
              >
                {showCode ? "Ocultar" : "Ver"}
              </button>
              <button
                onClick={copyCode}
                className="rounded-md p-1.5 text-muted hover:text-fg"
                aria-label="Copiar código"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={saveNow} disabled={busy}>
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
                {isSelf ? "Actualizar código" : "Guardar ahora"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSavedCode(null);
                  setShowCode(false);
                  setStatus({
                    type: "ok",
                    message: "Respaldo desactivado en este dispositivo.",
                  });
                }}
              >
                Desactivar
              </Button>
            </div>
          </div>
        ) : (
          <Button className="mt-3" size="sm" onClick={createBackup} disabled={busy}>
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Crear código de guardado
          </Button>
        )}

        <div className="mt-4 border-t border-line/70 pt-3">
          <p className="mb-2 text-[11px] font-medium text-muted">
            ¿Tienes un código de otro dispositivo?
          </p>
          <div className="flex gap-2">
            <input
              value={restoreCode}
              onChange={(e) => setRestoreCode(e.target.value)}
              placeholder="CNDL-7K2M-9QX4 o CNDL1-…"
              className="num h-10 min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-3 text-[12px] uppercase tracking-wider text-fg outline-none placeholder:text-faint focus:border-accent/40"
              aria-label="Código de guardado"
            />
            <Button size="sm" onClick={restore} disabled={busy || !restoreCode.trim()}>
              Restaurar
            </Button>
          </div>
        </div>
      </section>

      {status && (
        <p
          className={`rounded-xl border p-3 text-[11.5px] leading-relaxed ${
            status.type === "ok"
              ? "border-up/25 bg-up/10 text-fg/90"
              : "border-down/25 bg-down/10 text-fg/90"
          }`}
        >
          {status.message}
        </p>
      )}

      <section className="rounded-2xl border border-line bg-surface p-4">
        <h2 className="text-sm font-semibold">Copia de seguridad manual</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
          Descarga un archivo JSON con todo tu progreso. Sirve como plan B si no
          quieres usar el código.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={exportFile}>
            <Download className="h-3.5 w-3.5" /> Exportar
          </Button>
          <Button size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" /> Importar
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <h2 className="text-sm font-semibold">Empezar de cero</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
          Borra el progreso de este dispositivo. No borra el respaldo de la nube.
        </p>
        <Button
          className="mt-3"
          size="sm"
          variant="danger"
          onClick={() => {
            if (window.confirm("¿Seguro que quieres borrar el progreso local?")) {
              reset();
              setStatus({ type: "ok", message: "Progreso local borrado." });
            }
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Borrar progreso local
        </Button>
      </section>

      <p className="text-[10px] text-faint">
        Progreso iniciado el {hydrated ? formatDate(useProgress.getState().startedAt) : "—"}.
      </p>
    </div>
  );
}
