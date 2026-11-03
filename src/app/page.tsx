import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-stone-50 text-stone-800 dark:bg-[#140a0f] dark:text-stone-200 font-sans selection:bg-rose-200 selection:text-rose-900">
      <Navbar />

      {/* Fundo decorativo suave */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-rose-100/70 via-orange-50/40 to-transparent dark:from-rose-500/10 dark:via-rose-500/5 dark:to-transparent" />

        <div className="relative w-full max-w-5xl px-6 py-12 sm:py-20 mx-auto flex flex-col items-center">

          {/* Hero */}
          <div className="text-center max-w-3xl mb-14 mt-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-400/20 bg-white/70 dark:bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-300 shadow-sm backdrop-blur mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              Inteligência emocional guiada por IA
            </span>

            <h1 className="text-5xl sm:text-7xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-6">
              LilithLove
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-stone-600 dark:text-stone-300 mb-10">
              Sua conselheira amorosa e guia de inteligência emocional.
              Um espaço seguro e acolhedor para todas as formas de amar.
              Analise conversas, melhore seus relacionamentos e saiba exatamente como agir.
            </p>

            {/* Chips - Ações Rápidas conectadas ao chat */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link
                href="/chat/lilith?action=conselho"
                className="px-6 py-3 bg-rose-100 dark:bg-rose-500/15 hover:bg-rose-200 dark:hover:bg-rose-500/25 text-rose-900 dark:text-rose-200 rounded-full font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <span className="text-xl">💬</span> Preciso de um conselho
              </Link>
              <Link
                href="/chat/lilith?action=analise"
                className="px-6 py-3 bg-orange-100 dark:bg-orange-500/15 hover:bg-orange-200 dark:hover:bg-orange-500/25 text-orange-900 dark:text-orange-200 rounded-full font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <span className="text-xl">🔍</span> Analisar uma conversa
              </Link>
              <Link
                href="/chat/lilith?action=responder"
                className="px-6 py-3 bg-white dark:bg-white/5 hover:bg-stone-100 dark:hover:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-100 rounded-full font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <span className="text-xl">✍️</span> O que respondo agora?
              </Link>
            </div>
          </div>

          {/* Ferramentas Inteligentes */}
          <div className="w-full mt-10">
            <h2 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-100 mb-8 text-center">
              Ferramentas Inteligentes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card 1 */}
              <Link
                href="/chat/lilith?action=responder"
                className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-white/10 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-start group"
              >
                <div className="bg-stone-50 dark:bg-white/10 p-3 rounded-2xl mb-5 group-hover:scale-110 transition-transform text-2xl">👋</div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800 dark:text-stone-100">Primeiro Contato</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Mensagens e abordagens perfeitas para puxar assunto e gerar interesse real e recíproco.</p>
              </Link>

              {/* Card 2 */}
              <Link
                href="/chat/lilith?action=analise"
                className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-white/10 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-start group"
              >
                <div className="bg-stone-50 dark:bg-white/10 p-3 rounded-2xl mb-5 group-hover:scale-110 transition-transform text-2xl">🚩</div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800 dark:text-stone-100">Detector de Red Flags</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Analise o perfil e o comportamento nas mensagens para identificar sinais de alerta precocemente.</p>
              </Link>

              {/* Card 3 */}
              <Link
                href="/chat/lilith?action=responder"
                className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-white/10 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-start group"
              >
                <div className="bg-stone-50 dark:bg-white/10 p-3 rounded-2xl mb-5 group-hover:scale-110 transition-transform text-2xl">🥂</div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800 dark:text-stone-100">Pós-Encontro</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Saiba exatamente o que mandar depois de sair para manter a conexão viva sem parecer desesperado(a).</p>
              </Link>

              {/* Card 4 - Premium conectado ao chat */}
              <Link
                href="/chat/lilith?action=conselho"
                className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-500/15 dark:to-orange-500/10 p-8 rounded-3xl shadow-sm border border-rose-200 dark:border-rose-400/20 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-start relative overflow-hidden group w-full"
              >
                <div className="absolute top-6 right-6 bg-rose-900 dark:bg-rose-500 text-rose-50 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  Alta Eficácia
                </div>
                <div className="bg-white/60 dark:bg-white/10 p-3 rounded-2xl mb-5 group-hover:scale-110 transition-transform text-2xl">❤️‍🩹</div>
                <h3 className="text-xl font-semibold text-rose-900 dark:text-rose-200 mb-3">Reconectar / Reconquistar</h3>
                <p className="text-rose-800/80 dark:text-rose-200/80 leading-relaxed pr-12">O módulo urgente. Como voltar a falar depois de um tempo, com estratégias de reversão de crise guiadas por IA.</p>
              </Link>

            </div>
          </div>

          {/* Trilhas de Aprendizado */}
          <div className="w-full mt-24 pt-16 border-t border-stone-200 dark:border-white/10 text-center">
            <span className="text-rose-600 dark:text-rose-300 font-semibold tracking-wider uppercase text-sm mb-4 block">Exclusivo Assinantes</span>
            <h2 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-100 mb-8">
              Trilhas de Desenvolvimento
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/chat/lilith?action=conselho" className="px-6 py-4 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-white/10 transition-colors border border-stone-100 dark:border-white/10 shadow-sm rounded-2xl text-stone-600 dark:text-stone-300 font-medium">✨ Ame a Si Mesmo Primeiro</Link>
              <Link href="/chat/lilith?action=conselho" className="px-6 py-4 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-white/10 transition-colors border border-stone-100 dark:border-white/10 shadow-sm rounded-2xl text-stone-600 dark:text-stone-300 font-medium">🛑 Contato Zero na Prática</Link>
              <Link href="/chat/lilith?action=conselho" className="px-6 py-4 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-white/10 transition-colors border border-stone-100 dark:border-white/10 shadow-sm rounded-2xl text-stone-600 dark:text-stone-300 font-medium">🔥 Desperte sua Confiança</Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
