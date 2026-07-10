"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Question, Lead } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { QuestionsTable } from "@/components/admin/QuestionsTable";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { LeadsIcon, QuestionsIcon } from "@/components/admin/icons";

type Tab = "leads" | "questions";

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminApp />
    </ToastProvider>
  );
}

function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, questionsRes] = await Promise.all([fetch("/api/leads"), fetch("/api/questions")]);
      if (!leadsRes.ok || !questionsRes.ok) throw new Error();
      setLeads(await leadsRes.json());
      setQuestions((await questionsRes.json()).sort((a: Question, b: Question) => a.order - b.order));
    } catch {
      showToast("Não foi possível carregar os dados.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  async function handleLogin() {
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        setAuthed(true);
        load();
      } else {
        showToast("Senha incorreta.", "error");
      }
    } catch {
      showToast("Não foi possível autenticar agora.", "error");
    } finally {
      setLoggingIn(false);
    }
  }

  function startNewQuestion() {
    setEditingQuestion(null);
    setFormOpen(true);
  }

  function startEditQuestion(question: Question) {
    setEditingQuestion(question);
    setFormOpen(true);
  }

  async function handleQuestionSaved() {
    setFormOpen(false);
    setEditingQuestion(null);
    await load();
  }

  if (!authed) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink p-6 font-[family-name:var(--font-poppins)]">
        <Image
          src="/images/admin-bg-mobile.jpg"
          alt=""
          fill
          quality={90}
          sizes="100vw"
          priority
          className="object-cover md:hidden"
        />
        <Image
          src="/images/admin-bg-v2.jpg"
          alt=""
          fill
          quality={100}
          sizes="100vw"
          priority
          className="hidden object-cover md:block"
        />

        <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-2xl sm:p-14">
          <Logo />
          <h1 className="text-2xl font-black text-[#0a0f1e] mt-7 mb-2">Painel Admin</h1>
          <p className="text-sm text-gray-400 mb-7">Acesso restrito ao profissional</p>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm text-center focus:border-[#1a6fd4] outline-none mb-3"
          />
          <Button onClick={handleLogin} loading={loggingIn} fullWidth>
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef1f5] font-[family-name:var(--font-poppins)]">
      <div className="flex flex-col lg:h-screen lg:flex-row">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a0f1e] p-4 text-white lg:hidden">
          <Logo dark />
          <button
            aria-label="Abrir menu"
            onClick={() => setMobileNavOpen(true)}
            className="flex items-center justify-center rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <MenuIcon />
          </button>
        </div>

        <MobileNav
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          tab={tab}
          onTabChange={setTab}
          leadsCount={leads.length}
          questionsCount={questions.length}
        />

        {/* Desktop sidebar */}
        <aside className="hidden shrink-0 bg-[#0a0f1e] text-white lg:flex lg:h-screen lg:w-64 lg:flex-col">
          <div className="p-6 border-b border-white/10">
            <Logo dark />
            <p className="mt-2 text-xs text-gray-500">Painel Administrativo</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            <SidebarBtn active={tab === "leads"} onClick={() => setTab("leads")}>
              <LeadsIcon /> Leads ({leads.length})
            </SidebarBtn>
            <SidebarBtn active={tab === "questions"} onClick={() => setTab("questions")}>
              <QuestionsIcon /> Perguntas ({questions.length})
            </SidebarBtn>
          </nav>
          <div className="border-t border-white/10 p-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Ver site
            </Link>
          </div>
        </aside>

        <main className="flex-1 lg:overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-[#1a6fd4] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && tab === "leads" && <LeadsTable leads={leads} onChanged={load} />}

          {!loading && tab === "questions" && (
            <div className="p-4 sm:p-6 lg:p-8">
              <QuestionsTable
                questions={questions}
                onEdit={startEditQuestion}
                onNewQuestion={startNewQuestion}
                onChanged={load}
              />

              <Modal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                title={editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}
              >
                <QuestionForm
                  key={editingQuestion?.id ?? "new"}
                  editingQuestion={editingQuestion}
                  nextOrder={questions.length + 1}
                  onSaved={handleQuestionSaved}
                  onCancelEdit={() => setFormOpen(false)}
                />
              </Modal>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
        active ? "bg-[#1a6fd4] text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  leadsCount: number;
  questionsCount: number;
}

function MobileNav({ open, onClose, tab, onTabChange, leadsCount, questionsCount }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function selectTab(next: Tab) {
    onTabChange(next);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col bg-[#0a0f1e] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <Logo dark />
          <button
            aria-label="Fechar menu"
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          <SidebarBtn active={tab === "leads"} onClick={() => selectTab("leads")}>
            <LeadsIcon /> Leads ({leadsCount})
          </SidebarBtn>
          <SidebarBtn active={tab === "questions"} onClick={() => selectTab("questions")}>
            <QuestionsIcon /> Perguntas ({questionsCount})
          </SidebarBtn>
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Ver site
          </Link>
        </div>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Image
      src={dark ? "/images/logo-mark-dark.png" : "/images/logo-mark-light.png"}
      alt="Wesley Loureno — Fisioterapia e Quiropraxia Desportiva"
      width={458}
      height={83}
      className={dark ? "h-8 w-auto" : "h-14 w-auto"}
    />
  );
}
