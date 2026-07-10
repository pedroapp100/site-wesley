export const QUESTION_TYPES = ["radio", "text", "whatsapp"] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_CONFIG: Record<QuestionType, { label: string; tone: "purple" | "green" | "blue" }> = {
  radio: { label: "Múltipla Escolha", tone: "purple" },
  text: { label: "Texto Livre", tone: "green" },
  whatsapp: { label: "WhatsApp", tone: "blue" },
};
