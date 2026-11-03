import "./globals.css";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { RefTracker } from "@/components/ref-tracker";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata = {
  title: "LilithLove",
  description: "Sua conselheira amorosa e guia de inteligência emocional.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="pt-BR"
        className={`${jakarta.variable} ${fraunces.variable}`}
        suppressHydrationWarning
      >
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body className="font-sans antialiased">
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
