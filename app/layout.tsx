import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Números da Vida | Descubra seu Mapa Numerológico",
  description: "Descubra o que os números revelam sobre seu destino, personalidade e alma gêmea. Mapa numerológico personalizado baseado na ciência dos números.",
  openGraph: {
    title: "Números da Vida | Seu Mapa Numerológico Completo",
    description: "Descubra o que os números revelam sobre você. Quiz gratuito + mapa completo personalizado.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col gradient-mystic">{children}</body>
    </html>
  );
}
