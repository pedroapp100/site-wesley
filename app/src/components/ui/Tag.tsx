"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "blue" | "purple" | "green" | "gray" | "red" | "amber";

const TONE_CLASSES: Record<Tone, string> = {
  blue: "bg-[#e8f1fb] text-[#1a6fd4]",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  gray: "bg-gray-100 text-gray-400",
  red: "bg-red-100 text-red-500",
  amber: "bg-amber-100 text-amber-600",
};

export function Tag({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}

interface TagButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  tone?: Tone;
  children: ReactNode;
}

export function TagButton({ tone = "gray", children, ...rest }: TagButtonProps) {
  return (
    <button
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-opacity hover:opacity-80 ${TONE_CLASSES[tone]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
