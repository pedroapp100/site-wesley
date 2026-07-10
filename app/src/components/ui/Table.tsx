"use client";

import { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  className?: string;
}

interface TableProps {
  columns: Column[];
  children: ReactNode;
  emptyState?: ReactNode;
  isEmpty?: boolean;
}

const ALIGN_CLASSES: Record<NonNullable<Column["align"]>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function Table({ columns, children, emptyState, isEmpty = false }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 ${
                  ALIGN_CLASSES[col.align ?? "left"]
                } ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{children}</tbody>
      </table>
      {isEmpty && emptyState && <div className="px-5 py-12 text-center text-sm text-gray-400">{emptyState}</div>}
    </div>
  );
}

export function Td({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  return <td className={`px-5 py-4 text-sm text-[#0a0f1e] ${ALIGN_CLASSES[align]} ${className}`}>{children}</td>;
}

export function Tr({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={`transition-colors hover:bg-gray-100 ${className}`}>{children}</tr>;
}
