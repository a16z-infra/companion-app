import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const { userId } = auth();

  return (
    <header className="w-full bg-stone-50/90 dark:bg-[#140a0f]/80 backdrop-blur-md border-b border-stone-200 dark:border-white/10 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo / Nome da Marca */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="text-xl font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight">
            LilithLove
          </span>
        </Link>

        {/* Menu e Autenticação */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/sobre"
            className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors hidden sm:block"
          >
            Como Funciona
          </Link>

          <Link
            href="/planos"
            className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors hidden sm:block"
          >
            Planos
          </Link>

          {userId && (
            <Link
              href="/dashboard/afiliado"
              className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors hidden sm:block"
            >
              Afiliados
            </Link>
          )}

          <ThemeToggle />

          {/* Divisor e Botão de Login/Perfil do Clerk */}
          <div className="pl-4 border-l border-stone-200 dark:border-white/10 flex items-center">
            {userId ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/sign-in"
                className="rounded-full bg-rose-100 dark:bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-900 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-500/30 transition-colors shadow-sm"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
