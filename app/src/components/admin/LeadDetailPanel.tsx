"use client";

import { Lead } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "./icons";

export function getLeadName(lead: Lead): string {
  const answer = lead.answers.find((a) => a.questionText.toLowerCase().includes("nome"));
  return answer?.answer || "Lead sem nome";
}

export function getLeadWhatsApp(lead: Lead): string | undefined {
  return lead.answers.find((a) => a.questionText.toLowerCase().includes("whatsapp"))?.answer;
}

export function getWhatsAppLink(lead: Lead): string | undefined {
  const digits = getLeadWhatsApp(lead)?.replace(/\D/g, "");
  if (!digits) return undefined;
  return `https://wa.me/55${digits}?text=${encodeURIComponent(
    "Olá! Vi suas respostas de avaliação e gostaria de agendar sua consulta."
  )}`;
}

export type Priority = "baixa" | "media" | "alta";

export const PRIORITY_CONFIG: Record<Priority, { label: string; tone: "green" | "amber" | "red" }> = {
  baixa: { label: "Baixa", tone: "green" },
  media: { label: "Média", tone: "amber" },
  alta: { label: "Alta", tone: "red" },
};

// Prioridade vem da pergunta de nível de dor (1-10) — usa o maior número da resposta
// (ex: "7-8 (forte)" -> 8) já que as opções são faixas, não valores únicos.
export function getLeadPriority(lead: Lead): Priority | null {
  const answer = lead.answers.find((a) => {
    const q = a.questionText.toLowerCase();
    return q.includes("nível") && q.includes("dor");
  });
  if (!answer) return null;

  const numbers = answer.answer.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length === 0) return null;

  const maxValue = Math.max(...numbers);
  if (maxValue <= 4) return "baixa";
  if (maxValue <= 7) return "media";
  return "alta";
}

export function getLeadInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function LeadAvatar({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a6fd4]/10 text-sm font-black text-[#1a6fd4]">
      {getLeadInitials(name)}
    </span>
  );
}

export function LeadActions({ lead, onDelete }: { lead: Lead; onDelete: (lead: Lead) => void }) {
  const whatsappLink = getWhatsAppLink(lead);

  return (
    <>
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-600"
        >
          <WhatsAppIcon /> Contatar
        </a>
      )}
      <Button variant="danger" onClick={() => onDelete(lead)}>
        Excluir
      </Button>
    </>
  );
}

export function LeadDetailPanel({ lead }: { lead: Lead }) {
  return (
    <div className="flex flex-col gap-4">
      {lead.answers.map((a, i) => (
        <div key={i} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1fb] text-sm font-bold text-[#1a6fd4]">
            {i + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#0a0f1e]">{a.questionText}</p>
            <p className="mt-2 rounded-lg bg-[#f8fafc] px-3 py-2 text-sm text-gray-600">
              {a.answer || <span className="italic text-gray-300">Não respondida</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
