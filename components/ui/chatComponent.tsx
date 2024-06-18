"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { MessageSquareIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, how can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
    setInput("");
    setIsLoading(true);

    setTimeout(async () => {
      console.log("API call", messages, input);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
        }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.text },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-md">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-4 right-4 z-50 shadow-lg bg-gradient-to-r from-gray-900 from-60% to-[#666666] to-100% border-[#242424] rounded-full py-7"
          >
            <MessageSquareIcon className="h-6 w-6" color="white" />
            <span className="sr-only">Open chatbot</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col w-[20rem] md:w-[30rem] lg:w-[25rem] h-[70vh] md:h-[60vh] lg:h-[80vh]">
          <DrawerHeader className="flex items-center justify-center z-10 opacity-70 px-4 py-2 flex-col">
            <h1 className="flex justify-center text-2xl font-semibold">
              Sakura
            </h1>
            <h3 className="text-md font-medium">
              Your Personal Medical Companion
            </h3>
          </DrawerHeader>
          <div className={"flex-1 overflow-y-auto px-4 py-6"}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "assistant"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                      message.role === "assistant"
                        ? "bg-gray-100 dark:bg-gray-800 items-start"
                        : "bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900 items-end"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {message.role === "assistant" ? "Chatbot" : "You"}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <DrawerFooter className="border-t px-4 py-3">
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center space-x-2 py-[2px] px-[3px] border rounded-full"
            >
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1 rounded-full border-none"
                autoComplete="off"
                value={input}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                className="h-9 w-9 rounded-full"
                size="icon"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isLoading ? "Loading..." : "Send"}
                </span>
              </Button>
            </form>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function LoadingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
