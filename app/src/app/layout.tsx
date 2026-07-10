import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "../../public/fonts/poppins/poppins-300.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-800.woff2", weight: "800", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wesley Loureno | Fisioterapia e Quiropraxia Desportiva",
  description:
    "Fisioterapia e quiropraxia especializada para alívio da dor, reabilitação e alto desempenho. Cuidado personalizado, resultados reais.",
  openGraph: {
    title: "Wesley Loureno | Fisioterapia e Quiropraxia Desportiva",
    description: "Movimento sem dor. Performance sem limites.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
