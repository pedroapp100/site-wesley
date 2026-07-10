"use client";

import { useState } from "react";
import { Question } from "@/lib/storage";
import { Table, Tr, Td } from "@/components/ui/Table";
import { IconButton, Button } from "@/components/ui/Button";
import { Tag, TagButton } from "@/components/ui/Tag";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ArrowUpIcon, ArrowDownIcon, EditIcon, EyeIcon, TrashIcon } from "./icons";
import { QUESTION_TYPE_CONFIG } from "./questionTypes";

interface QuestionsTableProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onNewQuestion: () => void;
  onChanged: () => void;
}

const COLUMNS = [
  { key: "order", label: "Ordem", className: "w-24" },
  { key: "text", label: "Pergunta" },
  { key: "type", label: "Tipo", className: "w-40" },
  { key: "status", label: "Status", className: "w-28" },
  { key: "actions", label: "Ações", align: "right" as const, className: "w-32" },
];

async function putQuestion(question: Question) {
  const res = await fetch("/api/questions", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
  if (!res.ok) throw new Error();
}

export function QuestionsTable({ questions, onEdit, onNewQuestion, onChanged }: QuestionsTableProps) {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);

  async function toggleActive(q: Question) {
    try {
      await putQuestion({ ...q, active: !q.active });
      showToast(q.active ? "Pergunta desativada." : "Pergunta ativada.");
      onChanged();
    } catch {
      showToast("Não foi possível atualizar o status.", "error");
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = questions[index + direction];
    const current = questions[index];
    if (!target) return;

    setReorderingId(current.id);
    try {
      await Promise.all([
        putQuestion({ ...current, order: target.order }),
        putQuestion({ ...target, order: current.order }),
      ]);
      onChanged();
    } catch {
      showToast("Não foi possível reordenar as perguntas.", "error");
    } finally {
      setReorderingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/questions?id=${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Pergunta removida.");
      setDeleteTarget(null);
      onChanged();
    } catch {
      showToast("Não foi possível remover a pergunta.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#0a0f1e]">Perguntas do Quiz</h2>
          <p className="text-sm text-gray-400">{questions.length} perguntas configuradas</p>
        </div>
        <Button onClick={onNewQuestion}>+ Nova Pergunta</Button>
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table columns={COLUMNS} isEmpty={questions.length === 0} emptyState="Nenhuma pergunta cadastrada ainda.">
          {questions.map((q, i) => (
            <Tr key={q.id} className={q.active ? "" : "opacity-50"}>
              <Td>
                <div className="flex items-center gap-1">
                  <span className="w-4 text-xs font-bold text-gray-400">{i + 1}</span>
                  <div className="flex flex-col">
                    <IconButton
                      aria-label="Mover para cima"
                      onClick={() => move(i, -1)}
                      disabled={i === 0 || reorderingId !== null}
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Mover para baixo"
                      onClick={() => move(i, 1)}
                      disabled={i === questions.length - 1 || reorderingId !== null}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                  </div>
                </div>
              </Td>
              <Td className="font-semibold">
                <div className="max-w-[520px] truncate">{q.text}</div>
              </Td>
              <Td>
                <Tag tone={QUESTION_TYPE_CONFIG[q.type].tone}>{QUESTION_TYPE_CONFIG[q.type].label}</Tag>
              </Td>
              <Td>
                <TagButton tone={q.active ? "green" : "gray"} onClick={() => toggleActive(q)}>
                  {q.active ? "Ativa" : "Inativa"}
                </TagButton>
              </Td>
              <Td align="right">
                <div className="flex justify-end gap-1">
                  <IconButton aria-label="Visualizar respostas" onClick={() => setViewingQuestion(q)}>
                    <EyeIcon />
                  </IconButton>
                  <IconButton aria-label="Editar pergunta" onClick={() => onEdit(q)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="Excluir pergunta" variant="danger" onClick={() => setDeleteTarget(q)}>
                    <TrashIcon />
                  </IconButton>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {questions.length === 0 && (
          <p className="rounded-2xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-400">
            Nenhuma pergunta cadastrada ainda.
          </p>
        )}
        {questions.map((q, i) => (
          <div key={q.id} className={`rounded-2xl border border-gray-200 bg-white p-4 ${q.active ? "" : "opacity-50"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2">
                <span className="mt-0.5 shrink-0 text-xs font-bold text-gray-400">{i + 1}</span>
                <p className="font-semibold text-[#0a0f1e]">{q.text}</p>
              </div>
              <div className="flex shrink-0 flex-col">
                <IconButton
                  aria-label="Mover para cima"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || reorderingId !== null}
                >
                  <ArrowUpIcon />
                </IconButton>
                <IconButton
                  aria-label="Mover para baixo"
                  onClick={() => move(i, 1)}
                  disabled={i === questions.length - 1 || reorderingId !== null}
                >
                  <ArrowDownIcon />
                </IconButton>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Tag tone={QUESTION_TYPE_CONFIG[q.type].tone}>{QUESTION_TYPE_CONFIG[q.type].label}</Tag>
              <TagButton tone={q.active ? "green" : "gray"} onClick={() => toggleActive(q)}>
                {q.active ? "Ativa" : "Inativa"}
              </TagButton>
            </div>

            <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
              <IconButton aria-label="Visualizar respostas" onClick={() => setViewingQuestion(q)}>
                <EyeIcon />
              </IconButton>
              <IconButton aria-label="Editar pergunta" onClick={() => onEdit(q)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="Excluir pergunta" variant="danger" onClick={() => setDeleteTarget(q)}>
                <TrashIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      {viewingQuestion && (
        <Modal open onClose={() => setViewingQuestion(null)} title="Opções de resposta">
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1a6fd4]">Pergunta</p>
            <p className="mt-1 font-semibold text-[#0a0f1e]">{viewingQuestion.text}</p>
          </div>

          {viewingQuestion.type === "radio" && (
            <div className="flex flex-col gap-3">
              {viewingQuestion.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1fb] text-sm font-bold text-[#1a6fd4]">
                    {i + 1}
                  </span>
                  <p className="font-medium text-[#0a0f1e]">{opt}</p>
                </div>
              ))}
            </div>
          )}

          {viewingQuestion.type === "text" && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
              Pergunta de texto livre — o visitante responde com as próprias palavras, sem opções pré-definidas.
            </div>
          )}

          {viewingQuestion.type === "whatsapp" && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
              Campo de WhatsApp — o site aplica a máscara (11) 99999-9999 automaticamente e só deixa o visitante
              avançar com um número válido.
            </div>
          )}
        </Modal>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remover pergunta?"
        description={deleteTarget ? `"${deleteTarget.text}" será removida do quiz.` : undefined}
        confirmLabel="Remover"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
