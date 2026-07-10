import { NextResponse } from "next/server";
import { getLeads, saveLead, deleteLead } from "@/lib/storage";

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers } = body as {
      answers: { questionId: string; questionText: string; answer: string }[];
    };

    const nameAnswer = answers.find((a) =>
      a.questionText.toLowerCase().includes("nome")
    );
    const waAnswer = answers.find((a) =>
      a.questionText.toLowerCase().includes("whatsapp")
    );

    await saveLead({
      answers,
      name: nameAnswer?.answer,
      whatsapp: waAnswer?.answer,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao salvar lead" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    await deleteLead(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao excluir lead" }, { status: 500 });
  }
}
