"use client";

import { useState } from "react";
import { Question } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { TrashIcon } from "./icons";
import { QUESTION_TYPES, QUESTION_TYPE_CONFIG, QuestionType } from "./questionTypes";

interface QuestionFormProps {
  editingQuestion: Question | null;
  nextOrder: number;
  onSaved: () => void;
  onCancelEdit: () => void;
}

const EMPTY_OPTIONS = ["", "", ""];

// Parent must pass key={editingQuestion?.id ?? "new"} so state resets on target change instead of via an effect.
export function QuestionForm({ editingQuestion, nextOrder, onSaved, onCancelEdit }: QuestionFormProps) {
  const { showToast } = useToast();
  const [text, setText] = useState(editingQuestion?.text ?? "");
  const [type, setType] = useState<QuestionType>(editingQuestion?.type ?? "radio");
  const [options, setOptions] = useState<string[]>(
    editingQuestion && editingQuestion.options.length > 0 ? editingQuestion.options : EMPTY_OPTIONS
  );
  const [saving, setSaving] = useState(false);

  async function saveQuestion() {
    if (!text.trim()) return;
    setSaving(true);
    const payload = {
      id: editingQuestion?.id,
      text: text.trim(),
      type,
      options: type === "radio" ? options.filter((o) => o.trim()) : [],
      order: editingQuestion?.order ?? nextOrder,
      active: editingQuestion?.active ?? true,
    };

    try {
      const res = await fetch("/api/questions", {
        method: editingQuestion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editingQuestion ? "Pergunta atualizada." : "Pergunta criada.");
      onSaved();
    } catch {
      showToast("Não foi possível salvar a pergunta.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-500">Tipo</label>
      <div className="mb-4 flex gap-2">
        {QUESTION_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-colors ${
              type === t ? "bg-[#1a6fd4] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {QUESTION_TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      {type === "whatsapp" && (
        <p className="mb-4 rounded-xl bg-[#e8f1fb] p-3 text-xs text-[#1a6fd4]">
          O visitante digita só os números — o site aplica a máscara (11) 99999-9999 automaticamente e só deixa
          avançar com um número válido.
        </p>
      )}

      <label className="mb-1 block text-xs font-semibold text-gray-500">Pergunta</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ex: Qual seu principal problema?"
        rows={3}
        className="mb-4 w-full resize-none rounded-xl border-2 border-gray-200 p-3 text-sm outline-none focus:border-[#1a6fd4]"
      />

      {type === "radio" && (
        <>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Opções de resposta</label>
          {options.map((opt, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input
                value={opt}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                placeholder={`Opção ${i + 1}`}
                className="flex-1 rounded-xl border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1a6fd4]"
              />
              {options.length > 2 && (
                <button
                  onClick={() => setOptions(options.filter((_, j) => j !== i))}
                  aria-label="Remover opção"
                  className="text-gray-300 transition-colors hover:text-red-400"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setOptions([...options, ""])}
            className="mb-4 text-xs font-semibold text-[#1a6fd4] hover:underline"
          >
            + Adicionar opção
          </button>
        </>
      )}

      <Button onClick={saveQuestion} disabled={!text.trim()} loading={saving} fullWidth>
        {editingQuestion ? "Salvar Alterações" : "Criar Pergunta"}
      </Button>

      <div className="mt-2">
        <Button variant="link" onClick={onCancelEdit} fullWidth>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
