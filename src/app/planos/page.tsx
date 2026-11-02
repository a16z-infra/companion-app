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
    <main className="flex min-h-screen flex-col items-center bg-stone-50 text-stone-800 font-sans selection:bg-rose-200">
      <Navbar />

      <div className="w-full max-w-3xl px-6 py-16 mx-auto flex flex-col items-center">
        <div className="text-center max-w-2xl mb-12">
          <span className="text-rose-600 font-semibold tracking-wider uppercase text-sm mb-4 block">
            Exclusivo Assinantes
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-stone-900 mb-5">
            Desbloqueie tudo da LilithLove
          </h1>
          <p className="text-lg leading-relaxed text-stone-600">
            Um único plano, com acesso total. Cancele quando quiser.
          </p>
        </div>

        {/* Card do Plano */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-md border border-rose-100 p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 bg-rose-900 text-rose-50 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Mais Popular
          </div>

          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Premium
          </h2>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-5xl font-serif font-bold text-stone-900">
              R$ 69,90
            </span>
            <span className="text-stone-500 mb-2">/mês</span>
          </div>

          <ul className="flex flex-col gap-3 mb-8">
            {BENEFICIOS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-700">
                <svg
                  className="w-5 h-5 text-rose-600 shrink-0 mt-0.5"
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

          <p className="text-center text-xs text-stone-400 mt-4">
            Pagamento seguro processado pela Cakto.
          </p>
        </div>
      </div>
    </main>
  );
}
