// Carrega .env da raiz do projeto e inicia o servidor MCP oficial do Supabase,
// para não precisar exportar a variável de ambiente manualmente no shell.
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

const child = spawn(
  "npx",
  ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=iangvcbttgsqkpvlbdef"],
  { stdio: "inherit", env: process.env, shell: process.platform === "win32" }
);

child.on("exit", (code) => process.exit(code ?? 0));
