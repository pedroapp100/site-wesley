import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string };
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      console.error("ADMIN_PASSWORD não configurada no ambiente");
      return NextResponse.json({ success: false, error: "Login indisponível" }, { status: 500 });
    }

    const success = password === expected;
    return NextResponse.json({ success }, { status: success ? 200 : 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Erro ao autenticar" }, { status: 500 });
  }
}
