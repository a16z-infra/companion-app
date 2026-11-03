import { SignIn } from "@clerk/nextjs";
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
            Descubra o que realmente passa na cabeça dessa pessoa.
          </h1>

          <p className="text-rose-100/90 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
            Pare de agir no impulso ou entregar seu controle emocional de bandeja. 
            A Lilith lê as entrelinhas de qualquer conversa e desenha a estratégia exata para virar o jogo a seu favor.
          </p>

          <div className="space-y-4 max-w-lg">
            <div className="flex items-start gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  Envie Prints, Áudios ou Textos do WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/75 mt-0.5">
                  Nossa IA analisa o subtexto oculto, testes de resistência e sinais de interesse ou afastamento.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl">♟️</span>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  Sem Julgamentos ou Moralismo
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/75 mt-0.5">
                  Uma confidente estrategista 100% do seu lado para situações de silêncio, término ou dúvida do que responder.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  Sigilo e Privacidade Absoluta
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/75 mt-0.5">
                  Seus relatos e capturas de tela são processados em ambiente privado e seguro.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-rose-200/70">
          <span>✨ +5 Análises Gratuitas liberadas ao entrar</span>
          <span>Acesso 24h no Celular ou PC</span>
        </div>
      </div>

      {/* LADO DIREITO: Caixa de Login Estilizada */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Acesse sua Consultoria
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Entre com sua conta Google em 1 clique para iniciar sua análise
            </p>
          </div>

          <SignIn
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