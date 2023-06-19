import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { response } from "express";

export default function QAModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [answer, setAnswer] = useState("");
  const [pinecone, setPinecone] = useState(true);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/qa-pg-vector", {
      method: "POST",
      body: JSON.stringify({
        prompt: e.target.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setAnswer(data.text);
    setLoading(false);
    setPinecone(response.url.match("/qa-pinecone") !== null);
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-950 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6 w-full max-w-3xl">
                <div>
                  <input
                    placeholder="Will AI Take All Our Jobs?"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSubmit(e);
                      }
                    }}
                    className="w-full flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm focus:outline-none  sm:text-sm sm:leading-6"
                  ></input>
                  <div className="mt-3 sm:mt-5">
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Ask questions about{" "}
                        <a
                          href="https://a16z.com/2023/06/06/ai-will-save-the-world/"
                          className="underline"
                        >
                          Why AI Will Save the World
                        </a>
                      </p>
                    </div>
                    {answer && !loading && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-200">{answer}</p>
                        <p className="text-sm text-gray-500">
                          Vector store used:{" "}
                          {pinecone ? "Pinecone" : "Supabase pgvector"}
                        </p>
                      </div>
                    )}
                    {loading && (
                      <p className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </p>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
