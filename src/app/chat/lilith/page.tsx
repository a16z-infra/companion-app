"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface Attachment {
  name: string;
  mimeType: string;
  data: string;
  previewUrl: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachment?: Attachment;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
  bonusLimit?: number;
}

const STORAGE_KEY = "lilithlove_sessions_v1";
const CHECKOUT_URL = "/planos";

export default function LilithChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [bonusLimit, setBonusLimit] = useState<number>(0);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limite de 5 respostas da Lilith por caso (+ bônus se assistir anúncio)
  const BASE_FREE_LIMIT = 5;
  const totalAllowed = BASE_FREE_LIMIT + bonusLimit;
  const assistantRepliesCount = messages.filter((m) => m.role === "assistant").length;
  const isLimitReached = assistantRepliesCount >= totalAllowed;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ChatSession[] = JSON.parse(raw);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
          setBonusLimit(parsed[0].bonusLimit || 0);
        } else {
          createNewSession([]);
        }
      } else {
        createNewSession([]);
      }
    } catch (_) {
      createNewSession([]);
    }

    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (action === "conselho") setInput("Preciso de um conselho. A situação é a seguinte: ");
    if (action === "analise") setInput("Analise esta conversa para mim: ");
    if (action === "responder") setInput("A pessoa me mandou isso. O que eu respondo agora para virar o jogo? ");
    if (action) {
      window.history.replaceState(null, "", "/chat/lilith");
    }
  }, []);

  const saveToHistory = (updatedMsgs: Message[], newBonus = bonusLimit) => {
    setSessions((prev) => {
      const firstUserMsg = updatedMsgs.find((m) => m.role === "user")?.content || "Novo Caso";
      const cleanTitle = firstUserMsg.slice(0, 34) + (firstUserMsg.length > 34 ? "..." : "");

      const lightMessages = updatedMsgs.map((m) =>
        m.attachment ? { ...m, attachment: undefined } : m
      );

      const updatedSession: ChatSession = {
        id: activeSessionId || Date.now().toString(),
        title: updatedMsgs.length > 0 ? cleanTitle : "Novo Caso",
        updatedAt: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
        messages: lightMessages,
        bonusLimit: newBonus,
      };

      const exists = prev.some((s) => s.id === updatedSession.id);
      const nextSessions = exists
        ? prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
        : [updatedSession, ...prev];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSessions));
      } catch (_) {}

      return nextSessions;
    });
  };

  const createNewSession = (currentList = sessions) => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: "Novo Caso",
      updatedAt: "Agora",
      messages: [],
      bonusLimit: 0,
    };
    const updated = [newSession, ...currentList];
    setSessions(updated);
    setActiveSessionId(newId);
    setMessages([]);
    setBonusLimit(0);
    setIsSidebarOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  const selectSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setBonusLimit(session.bonusLimit || 0);
    setIsSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (_) {}

    if (activeSessionId === id) {
      if (filtered.length > 0) {
        selectSession(filtered[0]);
      } else {
        createNewSession([]);
      }
    }
  };

  const handleUnlockAdBonus = () => {
    setIsWatchingAd(true);
    setTimeout(() => {
      const nextBonus = bonusLimit + 3;
      setBonusLimit(nextBonus);
      saveToHistory(messages, nextBonus);
      setIsWatchingAd(false);
      setShowPaywallModal(false);
    }, 2500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("O arquivo é muito grande! Envie um print, áudio ou vídeo curto de até 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      setAttachment({
        name: file.name,
        mimeType: file.type,
        data: base64Data,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const formatText = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*|\*[^*\n]+?\*)/g);
    return tokens.map((token, index) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-rose-950 dark:text-rose-300">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
        return (
          <em key={index} className="italic text-stone-700 dark:text-stone-300 font-medium">
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLimitReached) {
      setShowPaywallModal(true);
      return;
    }
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || (attachment ? "Analise este arquivo que estou enviando." : ""),
      attachment: attachment || undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveToHistory(updatedMessages);
    setInput("");
    setAttachment(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      const withReply: Message[] = [
        ...updatedMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply || "Não consegui processar a resposta.",
        },
      ];
      setMessages(withReply);
      saveToHistory(withReply);
    } catch (err) {
      const withError: Message[] = [
        ...updatedMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oscilação momentânea na rede. Clique em enviar novamente.",
        },
      ];
      setMessages(withError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#faf7f5] dark:bg-[#140a0f] font-sans overflow-hidden transition-colors">
      {/* BARRA LATERAL DE HISTÓRICO DE CASOS */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[82%] max-w-xs lg:w-72 bg-white dark:bg-[#1c1016] border-r border-rose-100 dark:border-rose-400/15 flex flex-col transition-transform duration-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-rose-100 dark:border-rose-400/15 flex items-center justify-between">
          <span className="font-serif font-bold text-stone-800 dark:text-stone-100 text-base">Meus Casos</span>
          <button
            onClick={() => createNewSession()}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-900 dark:bg-rose-600 text-white hover:bg-rose-800 dark:hover:bg-rose-500 transition-colors"
          >
            + Novo Caso
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => selectSession(s)}
              className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all text-left border ${
                s.id === activeSessionId
                  ? "bg-rose-50/80 dark:bg-rose-500/15 border-rose-200 dark:border-rose-400/30 text-rose-950 dark:text-rose-200 font-medium"
                  : "bg-stone-50/60 dark:bg-white/5 border-transparent hover:bg-stone-100 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300"
              }`}
            >
              <div className="truncate pr-2">
                <p className="text-xs truncate">{s.title}</p>
                <span className="text-[10px] text-stone-400 dark:text-stone-500">{s.updatedAt}</span>
              </div>
              {sessions.length > 1 && (
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  className="opacity-60 lg:opacity-0 lg:group-hover:opacity-100 text-stone-400 hover:text-rose-700 dark:hover:text-rose-400 text-xs px-1.5"
                  title="Excluir caso"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-stone-100 dark:border-rose-400/15 text-[11px] text-stone-400 dark:text-stone-500 text-center">
          Seus relatos ficam salvos neste dispositivo para consulta rápida.
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DO CHAT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4 bg-white/90 dark:bg-[#1c1016]/90 backdrop-blur-md border-b border-rose-100 dark:border-rose-400/15 shadow-sm shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-base px-2.5 py-2 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-400/30 shrink-0"
              title="Meus Casos"
            >
              📂
            </button>
            <Link href="/" className="hidden sm:inline-block text-sm font-medium px-3 py-1.5 rounded-full bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 transition-colors text-stone-700 dark:text-stone-200">
              ← Voltar
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-rose-900 to-rose-600 flex items-center justify-center text-white font-serif font-bold shadow-sm shrink-0">
                L
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-bold text-stone-900 dark:text-white leading-tight truncate">Lilith</span>
                <span className="text-[11px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Especialista Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setShowPaywallModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-400/30 hover:bg-rose-100 dark:hover:bg-rose-500/25 transition-colors"
            >
              <span>✨</span>
              <span><span className="hidden sm:inline">Mensagens: </span>{Math.max(0, totalAllowed - assistantRepliesCount)}/{totalAllowed}</span>
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Mensagens */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-4xl w-full mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-rose-100 to-orange-50 dark:from-rose-500/20 dark:to-rose-900/10 border border-rose-200 dark:border-rose-400/20 rounded-full flex items-center justify-center text-4xl shadow-sm mb-2">
                🔮
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 dark:text-stone-100">
                Me mostre a verdade.
              </h2>
              <p className="text-stone-500 dark:text-stone-400 max-w-md text-sm sm:text-base leading-relaxed">
                Desabafe sem filtros, cole o histórico do WhatsApp ou clique no clipe abaixo para enviar o <strong>print da conversa, áudio ou vídeo</strong>.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-3xl px-4 py-3 sm:px-6 sm:py-4 shadow-sm whitespace-pre-wrap leading-relaxed text-[15px] ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-rose-900 to-rose-800 text-rose-50 rounded-tr-sm shadow-md"
                      : "bg-white dark:bg-white/5 text-stone-800 dark:text-stone-200 border border-rose-100/80 dark:border-rose-400/20 border-l-4 border-l-rose-800 dark:border-l-rose-500 rounded-tl-sm shadow-md"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="text-[11px] font-bold uppercase tracking-widest text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                      <span>✦</span> DIAGNÓSTICO DE LILITH
                    </div>
                  )}

                  {m.attachment && (
                    <div className="mb-3 rounded-xl overflow-hidden bg-black/10 p-1">
                      {m.attachment.mimeType.startsWith("image/") && (
                        <img src={m.attachment.previewUrl} alt="Print enviado" className="max-h-72 rounded-lg object-contain mx-auto" />
                      )}
                      {m.attachment.mimeType.startsWith("audio/") && (
                        <audio controls src={m.attachment.previewUrl} className="w-full max-w-xs" />
                      )}
                      {m.attachment.mimeType.startsWith("video/") && (
                        <video controls src={m.attachment.previewUrl} className="max-h-72 rounded-lg mx-auto" />
                      )}
                    </div>
                  )}

                  <div>{formatText(m.content)}</div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-white/5 border border-rose-100 dark:border-rose-400/20 border-l-4 border-l-rose-800 dark:border-l-rose-500 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-700 dark:bg-rose-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-rose-700 dark:bg-rose-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-rose-700 dark:bg-rose-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Lilith está analisando as entrelinhas...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Rodapé de Digitação: Enter envia, Shift + Enter pula linha */}
        <footer className="p-3 sm:p-4 bg-white dark:bg-[#1c1016] border-t border-rose-100 dark:border-rose-400/15 shrink-0">
          <div className="max-w-4xl mx-auto">
            {attachment && (
              <div className="mb-3 flex items-center justify-between bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-400/30 px-4 py-2 rounded-2xl text-xs text-rose-900 dark:text-rose-200">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">📎</span>
                  <span className="font-medium truncate">{attachment.name}</span>
                  <span className="text-rose-600 dark:text-rose-400 hidden sm:inline">(Pronto para análise)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="ml-3 text-rose-800 dark:text-rose-300 hover:text-rose-950 font-bold px-2 py-0.5 rounded-full hover:bg-rose-200/50 dark:hover:bg-rose-500/20"
                >
                  ✕
                </button>
              </div>
            )}

            {isLimitReached ? (
              <div className="bg-rose-950 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="text-center sm:text-left">
                  <p className="font-serif font-bold text-sm sm:text-base text-amber-300">
                    Você atingiu o limite de {totalAllowed} análises gratuitas deste caso.
                  </p>
                  <p className="text-xs text-rose-100">
                    Desbloqueie o Plano de Ação Premium para liberar o roteiro completo e mensagens ilimitadas.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowPaywallModal(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow transition-colors"
                  >
                    🔓 Desbloquear Agora
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="relative flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,audio/*,video/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Enviar Print, Áudio ou Vídeo"
                  className="p-3 sm:p-3.5 bg-stone-100 dark:bg-white/5 hover:bg-rose-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 hover:text-rose-900 rounded-full transition-colors shrink-0 border border-stone-200 dark:border-white/10 mb-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                </button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Se apertar Enter SEM segurar o Shift, envia a mensagem. Com Shift+Enter, pula linha.
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={Math.min(5, Math.max(1, input.split("\n").length))}
                  placeholder="Conte o caso ou cole a conversa..."
                  className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-100 dark:placeholder-stone-500 rounded-3xl pl-5 pr-14 py-3 sm:py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-500/40 focus:border-rose-400 transition-all shadow-inner text-sm sm:text-base resize-none max-h-40 overflow-y-auto"
                />

                <button 
                  type="submit" 
                  disabled={isLoading || (!input.trim() && !attachment)}
                  className="absolute right-2 bottom-1.5 p-3 bg-rose-900 dark:bg-rose-600 text-white rounded-full hover:bg-rose-800 dark:hover:bg-rose-500 disabled:opacity-40 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </footer>
      </div>

      {/* MODAL DE PAYWALL QUANDO ATINGE O LIMITE DE 5 MENSAGENS */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1c1016] border border-rose-100 dark:border-rose-400/20 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 flex items-center justify-center text-stone-600 dark:text-stone-300 font-bold"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/15 text-rose-900 dark:text-rose-300 flex items-center justify-center text-2xl mb-4">
              👑
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Acesso VIP • LilithLove
            </span>
            <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-1 mb-2">
              Desbloqueie o Plano de Ação Completo
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-5">
              Tenha acesso imediato à mensagem exata para virar o jogo e consultas ilimitadas com a Lilith:
            </p>

            <ul className="space-y-2.5 text-sm text-stone-700 dark:text-stone-300 mb-6">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong>A Mensagem Cirúrgica:</strong> O texto exato para copiar, colar e quebrar o silêncio.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong>Guia de Stories e Postura:</strong> O que postar para ativar gatilho de perda.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong>Consultas Ilimitadas:</strong> Envie quantos prints, áudios e textos quiser.</span>
              </li>
            </ul>

            <a
              href={CHECKOUT_URL}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white font-bold text-center rounded-2xl shadow-lg block transition-all mb-3"
            >
              Desbloquear Acesso Premium Ilimitado →
            </a>

            <button
              type="button"
              onClick={handleUnlockAdBonus}
              disabled={isWatchingAd}
              className="w-full py-3 px-4 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 font-semibold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 border border-stone-200 dark:border-white/10"
            >
              {isWatchingAd ? (
                <span>⏳ Carregando patrocinador... Aguarde 2s</span>
              ) : (
                <span>📺 Assistir 1 Anúncio para liberar +3 Mensagens Grátis</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
