"use client";

import { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "link";
type Size = "sm" | "md";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-[#1a6fd4] text-white hover:bg-[#155bb5] disabled:bg-gray-200 disabled:text-gray-400",
  secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:text-gray-300",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:text-red-200 disabled:bg-red-50",
  ghost: "text-gray-400 hover:text-[#1a6fd4] hover:bg-[#e8f1fb] disabled:text-gray-200",
  link: "bg-transparent text-gray-400 hover:text-gray-600 disabled:text-gray-200",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-full font-bold transition-colors ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${
        fullWidth ? "w-full" : ""
      } disabled:cursor-not-allowed`}
      {...rest}
    >
      {loading ? "Salvando..." : children}
    </button>
  );
}

export function IconButton({
  children,
  variant = "ghost",
  disabled,
  "aria-label": ariaLabel,
  ...rest
}: Omit<ButtonProps, "size" | "fullWidth" | "loading"> & { "aria-label": string }) {
  return (
    <button
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg p-2 transition-colors ${VARIANT_CLASSES[variant]} disabled:cursor-not-allowed`}
      {...rest}
    >
      {children}
    </button>
  );
}
