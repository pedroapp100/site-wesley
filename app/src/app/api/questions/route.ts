import { NextResponse } from "next/server";
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, Question } from "@/lib/storage";

export async function GET() {
  try {
    const questions = await getQuestions();
    return NextResponse.json(questions);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Omit<Question, "id">;
    const newQ = await createQuestion(body);
    return NextResponse.json(newQ);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Question;
    const updated = await updateQuestion(body);
    if (!updated) {
      return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    await deleteQuestion(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}
