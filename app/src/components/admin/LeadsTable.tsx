"use client";

import { useMemo, useState } from "react";
import { Lead } from "@/lib/storage";
import { Table, Tr, Td } from "@/components/ui/Table";
import { IconButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { SearchIcon, EyeIcon, TrashIcon, WhatsAppIcon } from "./icons";
import {
  LeadActions,
  LeadAvatar,
  LeadDetailPanel,
  PRIORITY_CONFIG,
  getLeadName,
  getLeadPriority,
  getLeadWhatsApp,
  getWhatsAppLink,
} from "./LeadDetailPanel";

interface LeadsTableProps {
  leads: Lead[];
  onChanged: () => void;
}

const COLUMNS = [
  { key: "name", label: "Nome" },
  { key: "priority", label: "Prioridade", className: "w-32" },
  { key: "whatsapp", label: "WhatsApp", className: "w-40" },
  { key: "date", label: "Data", className: "w-40" },
  { key: "actions", label: "Ações", align: "right" as const, className: "w-24" },
];

function PriorityBadge({ lead }: { lead: Lead }) {
  const priority = getLeadPriority(lead);
  if (!priority) return <span className="text-xs text-gray-300">—</span>;
  const { label, tone } = PRIORITY_CONFIG[priority];
  return <Tag tone={tone}>{label}</Tag>;
}

function WhatsAppLinkButton({ lead }: { lead: Lead }) {
  const link = getWhatsAppLink(lead);
  if (!link) return null;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contatar no WhatsApp"
      className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
    >
      <WhatsAppIcon fill="currentColor" />
    </a>
  );
}

export function LeadsTable({ leads, onChanged }: LeadsTableProps) {
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) => {
      const name = getLeadName(lead).toLowerCase();
      const whatsapp = getLeadWhatsApp(lead)?.toLowerCase() ?? "";
      return name.includes(q) || whatsapp.includes(q);
    });
  }, [leads, query]);

  const selectedLead = leads.find((l) => l.id === selectedId) ?? null;
  const emptyMessage = leads.length === 0 ? "Nenhum lead ainda." : "Nenhum lead encontrado para essa busca.";

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads?id=${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Lead removido.");
      if (selectedId === deleteTarget.id) setSelectedId(null);
      setDeleteTarget(null);
      onChanged();
    } catch {
      showToast("Não foi possível remover o lead.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#0a0f1e]">Leads Captados</h2>
          <p className="text-sm text-gray-400">{leads.length} respostas recebidas</p>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou WhatsApp"
            className="w-full rounded-full border-2 border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1a6fd4]"
          />
        </div>
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table columns={COLUMNS} isEmpty={filteredLeads.length === 0} emptyState={emptyMessage}>
          {filteredLeads.map((lead) => (
            <Tr key={lead.id} className={selectedId === lead.id ? "bg-[#e8f1fb]" : ""}>
              <Td className="font-semibold">
                <div className="max-w-[220px] truncate">{getLeadName(lead)}</div>
              </Td>
              <Td>
                <PriorityBadge lead={lead} />
              </Td>
              <Td className="text-[#1a6fd4]">
                <div className="max-w-[160px] truncate">{getLeadWhatsApp(lead) || "—"}</div>
              </Td>
              <Td className="whitespace-nowrap text-gray-400">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</Td>
              <Td align="right">
                <div className="flex justify-end gap-1">
                  <WhatsAppLinkButton lead={lead} />
                  <IconButton aria-label="Ver detalhes do lead" onClick={() => setSelectedId(lead.id)}>
                    <EyeIcon />
                  </IconButton>
                  <IconButton aria-label="Excluir lead" variant="danger" onClick={() => setDeleteTarget(lead)}>
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
        {filteredLeads.length === 0 && (
          <p className="rounded-2xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-400">
            {emptyMessage}
          </p>
        )}
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#0a0f1e]">{getLeadName(lead)}</p>
                <p className="truncate text-sm text-[#1a6fd4]">{getLeadWhatsApp(lead) || "—"}</p>
                <div className="mt-1.5">
                  <PriorityBadge lead={lead} />
                </div>
              </div>
              <span className="shrink-0 text-xs text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
              <WhatsAppLinkButton lead={lead} />
              <IconButton aria-label="Ver detalhes do lead" onClick={() => setSelectedId(lead.id)}>
                <EyeIcon />
              </IconButton>
              <IconButton aria-label="Excluir lead" variant="danger" onClick={() => setDeleteTarget(lead)}>
                <TrashIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <Modal
          open
          onClose={() => setSelectedId(null)}
          title={
            <div className="flex items-center gap-3">
              <LeadAvatar name={getLeadName(selectedLead)} />
              <div className="min-w-0">
                <p className="truncate font-black text-[#0a0f1e]">{getLeadName(selectedLead)}</p>
                <p className="text-xs font-medium text-gray-400">
                  {new Date(selectedLead.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          }
          footer={<LeadActions lead={selectedLead} onDelete={setDeleteTarget} />}
        >
          <LeadDetailPanel lead={selectedLead} />
        </Modal>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remover lead?"
        description={deleteTarget ? `As respostas de "${getLeadName(deleteTarget)}" serão apagadas permanentemente.` : undefined}
        confirmLabel="Remover"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
