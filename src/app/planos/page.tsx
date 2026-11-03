import Navbar from "@/components/Navbar";
import { CheckoutButton } from "@/components/checkout-button";

const BENEFICIOS = [
  "Conversas ilimitadas com a Lilith",
  "Análise de conversas e detecção de red flags",
  "Módulo de Reconquista e reversão de crise",
  "Estratégias guiadas por IA, passo a passo",
  "Acesso a todas as ferramentas e trilhas",
  "Suporte prioritário",
];

export default function PlanosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-stone-50 text-stone-800 dark:bg-[#140a0f] dark:text-stone-200 font-sans selection:bg-rose-200 transition-colors">
      <Navbar />

      <div className="w-full max-w-3xl px-5 sm:px-6 py-12 sm:py-16 mx-auto flex flex-col items-center">
        <div className="text-center max-w-2xl mb-10 sm:mb-12">
          <span className="text-rose-600 dark:text-rose-400 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-3 sm:mb-4 block">
            Exclusivo Assinantes
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-stone-900 dark:text-white mb-4 sm:mb-5">
            Desbloqueie tudo da LilithLove
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-stone-600 dark:text-stone-300">
            Um único plano, com acesso total. Cancele quando quiser.
          </p>
        </div>

        {/* Card do Plano */}
        <div className="w-full max-w-md bg-white dark:bg-white/5 rounded-3xl shadow-md dark:shadow-black/40 border border-rose-100 dark:border-rose-400/20 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-5 right-5 sm:top-6 sm:right-6 bg-rose-900 dark:bg-rose-600 text-rose-50 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Mais Popular
          </div>

          <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">
            Premium
          </h2>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              R$ 69,90
            </span>
            <span className="text-stone-500 dark:text-stone-400 mb-2">/mês</span>
          </div>

          <ul className="flex flex-col gap-3 mb-8">
            {BENEFICIOS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                <svg
                  className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <CheckoutButton />

          <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-4">
            Pagamento seguro processado pela Cakto.
          </p>
        </div>
      </div>
    </main>
  );
}
