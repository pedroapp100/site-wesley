import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = "5511999999999"; // Substituir pelo número real
const WHATSAPP_MSG = encodeURIComponent(
  "Olá Wesley! Vim pelo site e gostaria de agendar uma avaliação."
);
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

export default function Home() {
  return (
    <main className="bg-paper text-ink">
      <Nav />
      <Hero />
      <Sintomas />
      <Sobre />
      <ProvaSocial />
      <CtaFinal />
      <Footer />
    </main>
  );
}

/* ─────────────────────────── NAV ─────────────────────────── */

function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line-dark bg-ink/95 px-6 py-4 backdrop-blur-sm md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-10">
        <Logo dark />
        <div className="hidden items-center gap-7 md:flex">
          <a href="#sintomas" className="text-sm font-semibold uppercase tracking-wide text-paper/70 transition-colors hover:text-cyan">
            Sintomas
          </a>
          <a href="#sobre" className="text-sm font-semibold uppercase tracking-wide text-paper/70 transition-colors hover:text-cyan">
            Sobre
          </a>
          <a href="#depoimentos" className="text-sm font-semibold uppercase tracking-wide text-paper/70 transition-colors hover:text-cyan">
            Depoimentos
          </a>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-white"
        >
          Área ADM
        </Link>
      </div>
    </nav>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

const outcomes = [
  { title: "Alívio da dor", sub: "com segurança" },
  { title: "Recuperação", sub: "mais rápida" },
  { title: "Mais qualidade", sub: "de vida" },
];

function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper md:flex md:min-h-[720px] md:flex-col lg:aspect-[12/5] lg:min-h-[800px]">
        {/* Mobile: image sits above the copy, not behind it */}
        <div className="relative aspect-[4/5] w-full md:hidden">
          <Image
            src="/images/hero-mobile.jpg"
            alt="Wesley Loureno, fisioterapeuta e quiropraxista, em seu consultório"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent" />
        </div>

        {/* Desktop / tablet: full-bleed background with copy overlaid */}
        <Image
          src="/images/hero-bg.jpg"
          alt="Wesley Loureno, fisioterapeuta e quiropraxista, em seu consultório"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="hidden object-cover object-[66%_38%] md:block"
        />

        <div className="relative z-10 px-6 py-10 md:flex md:flex-1 md:flex-col md:justify-center md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-xl">
              <PrecisionTag label="Anápolis-GO · Avaliação Clínica" className="text-paper/70" />

              <h1 className="mt-5 text-4xl font-display font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-[3.6rem] lg:text-7xl">
                Movimento
                <br />
                sem dor.
                <br />
                <span className="relative inline-block text-cyan">
                  Performance sem limites.
                  <span className="absolute -bottom-2 left-0 h-[3px] w-2/3 bg-cyan" />
                </span>
              </h1>

              <p className="mt-7 max-w-md text-base leading-relaxed text-paper/75 md:text-lg">
                Descubra em menos de 2 minutos o motivo real da sua dor — e o
                caminho pra resolver sem depender de cirurgia.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-md bg-cyan px-7 py-4 text-base font-bold text-ink transition-colors hover:bg-white"
                >
                  Iniciar minha avaliação
                  <ArrowIcon />
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-paper/60 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-cyan hover:decoration-cyan"
                >
                  prefere WhatsApp? fale direto
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-white/10 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line-dark px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-10">
          {outcomes.map((o) => (
            <div key={o.title} className="flex items-center gap-3 py-5 sm:justify-center sm:py-6">
              <span className="text-base font-bold text-white">{o.title}</span>
              <span className="text-sm text-paper/55">{o.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── SINTOMAS ─────────────────────────── */

const symptoms = [
  {
    slug: "costas",
    label: "Dor nas Costas",
    sub: "lombar, meio das costas, ciático",
    img: "/images/costas-fit.jpg",
    tag: "L1–L5 · LOMBAR",
  },
  {
    slug: "cervical",
    label: "Pescoço e Cervical",
    sub: "rigidez, dor ao virar o pescoço",
    img: "/images/cervical-fit.jpg",
    tag: "C1–C7 · CERVICAL",
  },
  {
    slug: "esportiva",
    label: "Lesão Esportiva",
    sub: "treino, corrida, jogo",
    img: "/images/esportiva-fit.jpg",
    tag: "MMII · ARTICULAR",
  },
  {
    slug: "hernia",
    label: "Hérnia de Disco",
    sub: "diagnóstico já feito",
    img: "/images/hernia-fit.jpg",
    tag: "L4–L5 · DISCO",
    wide: true,
  },
  {
    slug: "outro",
    label: "Não sei bem",
    sub: "quero orientação",
    img: "/images/outro-fit.jpg",
    tag: "AVALIAÇÃO · LIVRE",
    wide: true,
  },
];

function Sintomas() {
  return (
    <section id="sintomas" className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <PrecisionTag label="Onde dói, exatamente?" className="text-slate" />
          <h2 className="mt-4 text-4xl font-display font-extrabold leading-[1.05] text-ink md:text-5xl">
            Sua dor tem nome.
            <br />
            <span className="text-cyan-deep">E tem solução.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate">
            Toque no que mais parece com o que você sente. A gente já direciona
            sua avaliação pro ponto certo.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {symptoms.map((s) => (
            <Link
              key={s.slug}
              href={`/quiz?sintoma=${s.slug}`}
              className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ink ${
                s.wide ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <Image
                src={s.img}
                alt={s.label}
                fill
                quality={100}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent transition-opacity group-hover:from-ink/85" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition-colors group-hover:ring-cyan/60" />

              <div className="absolute left-4 top-4">
                <PrecisionTag label={s.tag} dark />
              </div>

              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-paper opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <ArrowIcon />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-lg font-bold text-white md:text-xl">{s.label}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-paper/60">
                  {s.sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SOBRE ─────────────────────────── */

const credentials = [
  "CREFITO — registro ativo",
  "Atende atletas de alta performance",
  "Metodologia própria de avaliação",
];

function Sobre() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
      <SpineLine className="pointer-events-none absolute -left-6 bottom-0 h-[80%] w-10 text-cyan/10" />

      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div className="relative">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border-l-2 border-cyan">
            <Image
              src="/images/about-fit.jpg"
              alt="Wesley Loureno em seu consultório, ao lado de um modelo anatômico de coluna"
              fill
              quality={100}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <PrecisionTag label="Metodologia própria" dark />
            </div>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-paper/40">
            Anápolis-GO · Consultório próprio
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <PrecisionTag label="Quem cuida de você" className="text-cyan" />
          <h2 className="mt-4 text-4xl font-display font-extrabold leading-tight md:text-5xl">
            Wesley Loureno.
          </h2>
          <p className="mt-1 text-paper/60">Fisioterapeuta · Quiropraxista Desportivo</p>

          <p className="mt-6 max-w-xl leading-relaxed text-paper/80">
            Anos de clínica e de esporte de alto rendimento ensinaram uma coisa:
            dor crônica quase sempre tem uma causa mecânica identificável — e
            raramente a solução é parar de se mover. O trabalho aqui é
            encontrar a origem real do problema antes de qualquer protocolo.
          </p>

          <blockquote className="mt-8 max-w-xl border-l-2 border-cyan pl-5 text-2xl font-display font-extrabold leading-snug text-white md:text-3xl">
            Cirurgia deveria ser o <span className="text-cyan">último recurso</span>.
            Não o primeiro conselho.
          </blockquote>

          <ul className="mt-10 flex flex-col gap-3 border-t border-line-dark pt-6 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
            {credentials.map((c) => (
              <li key={c} className="font-mono text-[11px] uppercase tracking-wide text-paper/55">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PROVA SOCIAL ─────────────────────────── */

const sessionVideos = [
  { src: "/videos/sessao-1.mp4", poster: "/images/sessao-1-poster.jpg" },
  { src: "/videos/sessao-2.mp4", poster: "/images/sessao-2-poster.jpg" },
  { src: "/videos/sessao-3.mp4", poster: "/images/sessao-3-poster.jpg" },
];

function ProvaSocial() {
  return (
    <section id="depoimentos" className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <PrecisionTag label="Quem já sentiu a diferença" className="text-slate" />
          <h2 className="mt-4 text-4xl font-display font-extrabold leading-[1.05] text-ink md:text-5xl">
            Resultado que se sente.
            <br />
            <span className="text-cyan-deep">Não que se promete.</span>
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-y border-line py-8">
          <div>
            <p className="font-mono text-4xl font-bold text-ink md:text-5xl">
              10 mil<span className="text-cyan-deep">+</span>
            </p>
            <p className="mt-1 text-sm text-slate">seguidores acompanham o trabalho</p>
          </div>
          <div>
            <p className="font-mono text-4xl font-bold text-ink md:text-5xl">
              500<span className="text-cyan-deep">+</span>
            </p>
            <p className="mt-1 text-sm text-slate">pacientes já atendidos</p>
          </div>
        </div>

        <div className="mt-12">
          <PrecisionTag label="Direto do consultório" className="text-slate" />
          <h3 className="mt-4 text-2xl font-display font-extrabold text-ink md:text-3xl">
            Sessões reais, sem cortes.
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {sessionVideos.map((v) => (
              <div key={v.src} className="relative aspect-[9/12.8] overflow-hidden rounded-2xl bg-ink">
                <video
                  src={v.src}
                  poster={v.poster}
                  controls
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA FINAL ─────────────────────────── */

function CtaFinal() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper md:flex md:min-h-[80svh] md:items-center md:px-10">
      {/* Mobile: image above copy */}
      <div className="relative aspect-[4/5] w-full md:hidden">
        <Image
          src="/images/final-cta-mobile.jpg"
          alt="Estúdio de reabilitação Wesley Loureno"
          fill
          quality={90}
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Desktop / tablet: full-bleed background with copy overlaid */}
      <Image
        src="/images/final-cta-bg.jpg"
        alt="Estúdio de reabilitação Wesley Loureno"
        fill
        quality={100}
        sizes="100vw"
        className="hidden object-cover object-[78%_8%] md:block"
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink from-0% via-ink/45 via-30% to-transparent to-52% md:block" />
      <SpineLine className="pointer-events-none absolute right-10 top-1/2 hidden h-[120%] w-16 -translate-y-1/2 text-cyan/15 lg:block" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 md:px-0 md:py-0">
        <PrecisionTag label="Invista em você" className="text-cyan" />
        <h2 className="mt-5 max-w-2xl text-4xl font-display font-extrabold leading-[1.05] md:text-6xl">
          Volte a andar, trabalhar
          <br />e <span className="text-cyan">dormir sem dor.</span>
        </h2>
        <p className="mt-6 max-w-md text-paper/70">
          Sua avaliação começa online, agora — leva menos de 2 minutos.
        </p>

        <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 rounded-md bg-cyan px-8 py-4 text-base font-bold text-ink transition-colors hover:bg-white"
          >
            Iniciar minha avaliação agora
            <ArrowIcon />
          </Link>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-paper/60 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-cyan hover:decoration-cyan"
          >
            prefere WhatsApp? fale direto
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-line-dark bg-ink px-6 py-10 text-paper md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        <Logo dark />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wide text-paper/50">
          <span>Anápolis-GO</span>
          <Link href="/quiz" className="hover:text-cyan transition-colors">
            Avaliação Online
          </Link>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">
            WhatsApp
          </a>
          <a
            href="https://instagram.com/dr.wesleyquiroprata"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan transition-colors"
          >
            @dr.wesleyquiroprata
          </a>
        </div>
        <p className="font-mono text-[10px] text-paper/35">
          © {new Date().getFullYear()} Wesley Loureno
        </p>
      </div>
    </footer>
  );
}

/* ─────────────────────────── UI ATOMS ─────────────────────────── */

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src={dark ? "/images/logo-mark-dark.png" : "/images/logo-mark-light.png"}
        alt="Wesley Loureno — Fisioterapia e Quiropraxia Desportiva"
        width={458}
        height={83}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}

function PrecisionTag({
  label,
  className = "",
  dark = false,
}: {
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${
        dark
          ? "rounded-full bg-ink/80 px-2.5 py-1 text-paper backdrop-blur-sm"
          : ""
      } ${className}`}
    >
      <CrosshairIcon className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

function CrosshairIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 1v4M12 19v4M1 12h4M19 12h4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpineLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 400" fill="none" preserveAspectRatio="none" className={className}>
      <path
        d="M20 0 C34 40 6 80 20 120 C34 160 6 200 20 240 C34 280 6 320 20 360 C28 380 18 400 20 400"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {Array.from({ length: 11 }).map((_, i) => (
        <circle key={i} cx={20 + (i % 2 === 0 ? 9 : -9)} cy={10 + i * 38} r="2.5" fill="currentColor" />
      ))}
    </svg>
  );
}
