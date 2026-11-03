import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#faf7f5] flex flex-col lg:flex-row font-sans text-stone-800">
      
      {/* LADO ESQUERDO: Apresentação Dinâmica e Persuasiva */}
      <div className="lg:w-1/2 bg-gradient-to-br from-rose-950 via-rose-900 to-stone-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-200 flex items-center justify-center text-rose-950 font-serif font-bold text-xl shadow-md">
              L
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-white">
              LilithLove
            </span>
          </Link>

          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
            ✦ Inteligência Comportamental & Reconquista
          </span>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight mb-6 text-white">
            Crie seu acesso gratuito e assuma o controle do jogo.
          </h1>

          <p className="text-rose-100/90 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
            Em menos de 10 segundos você libera suas 5 análises gratuitas com a Lilith para decifrar prints, áudios e conversas sem nenhum julgamento.
          </p>

          <div className="space-y-4 max-w-lg">
            <div className="flex items-start gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  5 Diagnósticos Gratuitos Imediatos
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/75 mt-0.5">
                  Teste o poder de leitura comportamental da Lilith no seu próprio caso agora mesmo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  100% Confidencial e Seguro
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/75 mt-0.5">
                  Seus casos ficam salvos apenas na sua conta privada para quando quiser consultar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-rose-200/70">
          <span>✨ Cadastro rápido com Google</span>
          <span>Acesso imediato ao chat</span>
        </div>
      </div>

      {/* LADO DIREITO: Caixa de Cadastro Estilizada */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Comece Agora Gratuitamente
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Crie sua conta em 1 clique para liberar o chat da Lilith
            </p>
          </div>

          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#881337",
                colorText: "#1c1917",
                colorBackground: "#ffffff",
                borderRadius: "1rem",
              },
              elements: {
                card: "shadow-xl border border-rose-100 rounded-3xl",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formButtonPrimary:
                  "bg-rose-900 hover:bg-rose-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md",
                socialButtonsBlockButton:
                  "border-stone-200 hover:bg-rose-50 text-stone-700 font-medium py-3 rounded-xl",
                formFieldInput:
                  "rounded-xl border-stone-200 focus:border-rose-400 focus:ring-rose-200",
                footerActionLink: "text-rose-800 hover:text-rose-950 font-semibold",
              },
            }}
            redirectUrl="/chat/lilith"
          />
        </div>
      </div>

    </div>
  );
}