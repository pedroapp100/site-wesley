# PRD — Landing Page Wesley Loureno (Fisioterapia e Quiropraxia)

**Versão:** 1.0
**Data:** 2026-07-08
**Autor:** Pedro (owner do projeto) + Claude
**Status:** Em definição — aguardando aprovação para implementação

---

## 1. Contexto

Wesley Loureno é fisioterapeuta e quiropraxista, atende em Anápolis-GO, com forte presença no Instagram (@dr.wesleyquiroprata, ~10 mil seguidores). O conteúdo dele já é organizado por **tipo de dor/sintoma** (lombar, ciático, ombro, cervical, escoliose, panturrilha, mão, bursite), com discurso central em torno de:

- Alívio da dor lombar e ciático
- Evitar cirurgias desnecessárias
- Voltar a andar, trabalhar e dormir sem dor

O projeto já possui uma base técnica funcionando (Next.js 15, deploy Vercel): home (`/`), quiz de leads (`/quiz`) e painel admin (`/admin`) para gerenciar perguntas do quiz e leads capturados.

## 2. Objetivo

Transformar a landing page atual em uma página curta (**máximo 5 seções**), 100% orientada a levar o visitante a **completar o quiz de leads**, usando como referência de estrutura duas landing pages de quiropraxia analisadas no Behance:

- [Studio Dom Quiropraxia e Saúde](https://www.behance.net/gallery/240138785/) — visual claro, institucional, verde+dourado.
- [Landing Page Quiropraxia (Varim)](https://www.behance.net/gallery/235241257/) — visual escuro/premium, segmentação por sintoma, quebra de objeção quiropraxia vs. cirurgia.

## 3. Problema a resolver

A página atual (`page.tsx`) tem 5-6 seções genéricas (Hero, Sobre, Como Funciona, Depoimentos, CTA Final) com **dois CTAs concorrentes** no hero e no CTA final (WhatsApp direto vs. quiz). Isso dilui a decisão do usuário e não aproveita o maior ativo do Wesley: conteúdo já validado e segmentado por dor específica, que gera identificação imediata ("é a minha dor") — muito mais forte que cards genéricos de especialidade.

## 4. Público-alvo

Pessoas com dor musculoesquelética ativa (lombar, ciático, ombro, cervical, postura) que chegam via Instagram/tráfego pago, já com alguma familiaridade com o conteúdo do Wesley, buscando alívio rápido e evitando cirurgia.

## 5. Escopo — Estrutura de 5 seções

| # | Seção | Objetivo | Referência / Origem |
|---|---|---|---|
| 1 | **Hero** | Promessa de dor + **CTA único** para o quiz (WhatsApp vira link secundário, não concorre) | Base já existente no projeto |
| 2 | **"Sua dor tem nome" — grid de sintomas** | Cards clicáveis por sintoma (lombar/ciático, ombro, cervical, escoliose/postura, panturrilha/joelho), cada um leva ao quiz com o sintoma pré-selecionado | Estrutura da Varim, conteúdo real do Instagram do Wesley |
| 3 | **Sobre o Wesley + quebra de objeção** | Foto + credenciais + frase de autoridade ("evite cirurgias desnecessárias") | Sobre-profissional do Studio Dom + comparativo quiropraxia vs. cirurgia da Varim, condensado em 1 frase |
| 4 | **Prova social** | Depoimentos existentes + números de autoridade (10 mil seguidores, +X pacientes atendidos) | Depoimentos de ambas referências |
| 5 | **CTA final** | Reforça a promessa literal da bio ("volte a andar, trabalhar e dormir sem dor") + botão único e grande para o quiz | Padrão de fechamento de ambas referências |

**Fora do escopo desta versão:** seção "Como funciona" (4 passos) será removida — não qualifica nem segmenta, e rouba espaço da seção de sintomas (que converte melhor).

## 6. Requisitos funcionais

- **RF01** — Cada card de sintoma na seção 2 deve linkar para `/quiz?sintoma=<slug>`, pré-selecionando/priorizando a pergunta relacionada àquele sintoma.
  - *Gap técnico identificado:* o quiz atual (`quiz/page.tsx`) carrega perguntas dinamicamente via `/api/questions` sem suporte a parâmetro de contexto. Será necessário adicionar leitura do query param e lógica de priorização/pré-resposta no admin ou no client.
- **RF02** — CTA principal em todas as seções aponta para `/quiz` (ou `/quiz?sintoma=...`); WhatsApp deixa de ser CTA primário e vira link secundário (ex: rodapé, ou botão outline pequeno).
- **RF03** — Seção de prova social exibe número de seguidores do Instagram e/ou contagem de pacientes — dado deve ser configurável (hardcoded no MVP, com nota para tornar editável via admin futuramente).
- **RF04** — Manter fluxo de captura de lead existente (`/api/leads`, painel `/admin`) sem alterações de schema nesta fase.

## 7. Requisitos não funcionais

- **Identidade visual:** manter a paleta já definida no projeto — azul primário `#1a6fd4`, navy `#0a0f1e`, azul claro `#e8f1fb`, fundo branco, botões pill, cards com sombra suave (`shadow-sm`).
- **Tipografia:** Poppins (pesos 300–900), self-hosted via `next/font/local` em `public/fonts/poppins/` — **concluído nesta sessão**, substituindo Inter em `layout.tsx`, `globals.css`, `page.tsx`, `quiz/page.tsx` e `admin/page.tsx`.
- **Responsivo:** mobile-first (pasta `Imagens/mobile` e `Imagens/desktop` reservada para assets específicos por breakpoint — ainda vazia, aguardando material).
- **Performance:** manter build estático onde possível (`○ Static` no build atual para `/`, `/admin`, `/quiz`).
- **SEO:** manter `metadata`/`openGraph` do `layout.tsx`, ajustar textos conforme novo foco em sintomas.

## 8. Métricas de sucesso

- Taxa de clique nos cards de sintoma (seção 2) → entrada no quiz.
- Taxa de conclusão do quiz (`step === "done"`) sobre visitas à landing.
- Redução da taxa de cliques em WhatsApp direto vs. quiz (indicador de que o funil está direcionando corretamente).

## 9. Riscos / dependências

- Pré-seleção de sintoma no quiz (RF01) depende de mudança no schema/lógica de perguntas — não estimado neste PRD, entra como próximo passo técnico.
- Números de prova social (seguidores, pacientes atendidos) precisam ser confirmados com o Wesley antes de publicar.
- Pastas `Imagens/hero`, `Imagens/desktop`, `Imagens/mobile` estão vazias — fotos reais do Wesley/pacientes (mencionadas como diferencial nos posts do Instagram) ainda precisam ser fornecidas.

## 10. Próximos passos

1. Validar este PRD com o Wesley/stakeholder.
2. Implementar seção 2 (grid de sintomas) e simplificar hero/CTA final em `page.tsx`.
3. Implementar RF01 (parâmetro de sintoma no quiz).
4. Coletar assets reais (fotos, números de prova social) para substituir placeholders.
