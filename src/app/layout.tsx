import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { RefTracker } from "@/components/ref-tracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LilithLove",
  description: "Sua conselheira amorosa e guia de inteligência emocional.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={inter.className}>
          {/* Captura o ?ref= (indicação de afiliado) em qualquer página e salva por 30 dias */}
          <Suspense fallback={null}>
            <RefTracker />
          </Suspense>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
