import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export interface Question {
  id: string;
  text: string;
  type: "radio" | "text" | "whatsapp";
  options: string[];
  order: number;
  active: boolean;
}

export interface Lead {
  id: string;
  createdAt: string;
  answers: { questionId: string; questionText: string; answer: string }[];
  name?: string;
  whatsapp?: string;
}

interface QuestionRow {
  id: number;
  text: string;
  type: Question["type"];
  options: string[];
  sort_order: number;
  active: boolean;
}

interface LeadRow {
  id: string;
  created_at: string;
  name: string | null;
  whatsapp: string | null;
  answers: Lead["answers"];
}

function toQuestion(row: QuestionRow): Question {
  return {
    id: String(row.id),
    text: row.text,
    type: row.type,
    options: row.options ?? [],
    order: row.sort_order,
    active: row.active,
  };
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    createdAt: row.created_at,
    answers: row.answers ?? [],
    name: row.name ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
  };
}

export async function getQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, text, type, options, sort_order, active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as QuestionRow[]).map(toQuestion);
}

export async function createQuestion(question: Omit<Question, "id">): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      text: question.text,
      type: question.type,
      options: question.options,
      sort_order: question.order,
      active: question.active,
    })
    .select("id, text, type, options, sort_order, active")
    .single();
  if (error) throw error;
  return toQuestion(data as QuestionRow);
}

export async function updateQuestion(question: Question): Promise<Question | null> {
  const { data, error } = await supabase
    .from("questions")
    .update({
      text: question.text,
      type: question.type,
      options: question.options,
      sort_order: question.order,
      active: question.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", question.id)
    .select("id, text, type, options, sort_order, active")
    .maybeSingle();
  if (error) throw error;
  return data ? toQuestion(data as QuestionRow) : null;
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) throw error;
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("id, created_at, name, whatsapp, answers")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as LeadRow[]).map(toLead);
}

export async function saveLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: lead.name,
      whatsapp: lead.whatsapp,
      answers: lead.answers,
    })
    .select("id, created_at, name, whatsapp, answers")
    .single();
  if (error) throw error;
  return toLead(data as LeadRow);
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
