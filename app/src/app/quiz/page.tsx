"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Question } from "@/lib/storage";

type Step = "loading" | "quiz" | "done";

const SYMPTOM_MAP: Record<string, string> = {
  costas: "Dor nas costas",
  cervical: "Dor no pescoço/cervical",
  esportiva: "Lesão esportiva",
  hernia: "Hérnia de disco",
  outro: "Outro",
};

function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function QuizPage() {
  return (
    <Suspense fallback={<FullScreen><Spinner /></FullScreen>}>
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState<Step>("loading");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textValue, setTextValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then((data: Question[]) => {
        const active = data.filter((q) => q.active).sort((a, b) => a.order - b.order);
        setQuestions(active);

        const sintoma = searchParams.get("sintoma");
        const mapped = sintoma ? SYMPTOM_MAP[sintoma] : undefined;
        if (mapped) {
          const match = active.find((q) => q.options.includes(mapped));
          if (match) setAnswers((prev) => ({ ...prev, [match.id]: mapped }));
        }

        setStep("quiz");
      })
      .catch(() => setError("Não foi possível carregar as perguntas."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (step === "loading") {
    return <FullScreen><Spinner /></FullScreen>;
  }

  if (error) {
    return (
      <FullScreen>
        <p className="text-red-400">{error}</p>
        <Link href="/" className="mt-4 text-cyan underline">Voltar</Link>
      </FullScreen>
    );
  }

  if (step === "done") {
    return (
      <FullScreen>
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth={2.5} className="h-10 w-10">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="mb-3 text-3xl font-black text-ink">Recebemos suas respostas!</h1>
          <p className="mb-8 leading-relaxed text-slate">
            O Wesley irá analisar suas informações e entrar em contato em breve pelo WhatsApp para agendar sua avaliação.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-cyan px-8 py-4 font-bold text-ink transition-colors hover:bg-cyan-deep hover:text-white"
          >
            Voltar ao início
          </Link>
        </div>
      </FullScreen>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const isLast = current === questions.length - 1;
  const currentAnswer = answers[q.id] ?? "";

  function selectOption(opt: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: opt }));
  }

  async function advance() {
    const answer = q.type === "radio" ? currentAnswer : textValue;
    if (!answer.trim()) return;

    const updated = { ...answers, [q.id]: answer.trim() };
    setAnswers(updated);
    setTextValue("");

    if (isLast) {
      setSubmitting(true);
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: questions.map((que) => ({
              questionId: que.id,
              questionText: que.text,
              answer: updated[que.id] ?? "",
            })),
          }),
        });
        setStep("done");
      } catch {
        setError("Erro ao enviar. Tente novamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrent((c) => c + 1);
    }
  }

  const whatsappDigits = textValue.replace(/\D/g, "");
  const canAdvance =
    q.type === "radio"
      ? currentAnswer !== ""
      : q.type === "whatsapp"
      ? whatsappDigits.length === 10 || whatsappDigits.length === 11
      : textValue.trim().length > 0;

  return (
    <div className="relative z-0 flex min-h-screen flex-col bg-paper">
      <Image
        src="/images/quiz-bg-mobile.jpg"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover md:hidden"
      />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-line bg-paper px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate transition-colors hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar ao site
        </Link>
        <Logo />
        <span className="font-mono text-xs text-slate">{current + 1} de {questions.length}</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-line">
        <div
          className="h-full bg-cyan transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-sm md:p-10">
            <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-deep">
              Pergunta {current + 1}
            </span>
            <h2 className="mb-8 mt-2 text-2xl font-black leading-snug text-ink">
              {q.text}
            </h2>

            {q.type === "radio" ? (
              <div className="flex flex-col gap-3">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOption(opt)}
                    className={`w-full rounded-xl border-2 p-4 text-left text-sm font-medium transition-all ${
                      currentAnswer === opt
                        ? "border-cyan bg-cyan/10 text-cyan-deep"
                        : "border-line text-ink hover:border-cyan/40"
                    }`}
                  >
                    <span className={`mr-3 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      currentAnswer === opt ? "border-cyan bg-cyan" : "border-line"
                    }`}>
                      {currentAnswer === opt && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : q.type === "whatsapp" ? (
              <input
                type="tel"
                inputMode="numeric"
                value={textValue}
                onChange={(e) => setTextValue(formatPhoneBR(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && canAdvance && advance()}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border-2 border-line p-4 text-sm outline-none transition-colors focus:border-cyan"
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canAdvance && advance()}
                placeholder="Digite sua resposta..."
                className="w-full rounded-xl border-2 border-line p-4 text-sm outline-none transition-colors focus:border-cyan"
                autoFocus
              />
            )}

            <button
              onClick={advance}
              disabled={!canAdvance || submitting}
              className={`mt-6 w-full rounded-md py-4 text-base font-bold transition-all ${
                canAdvance && !submitting
                  ? "bg-cyan text-ink hover:bg-cyan-deep hover:text-white"
                  : "cursor-not-allowed bg-line text-slate"
              }`}
            >
              {submitting ? "Enviando..." : isLast ? "Enviar Avaliação" : "Próxima →"}
            </button>

            {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
          </div>

          {current > 0 && (
            <button
              onClick={() => { setCurrent((c) => c - 1); setTextValue(""); }}
              className="mx-auto mt-4 block w-fit rounded-full bg-paper/80 px-4 py-1.5 text-sm text-slate backdrop-blur-sm transition-colors hover:text-ink"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan border-t-transparent" />
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/images/logo-icon.png" alt="" width={26} height={23} className="h-6 w-auto" />
      <span className="text-sm font-extrabold text-ink">Wesley Loureno</span>
    </div>
  );
}
