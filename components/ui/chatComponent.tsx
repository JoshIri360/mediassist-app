"use client";
import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from '../styles/chat.module.css'
import classNames from 'classnames';

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
    console.log("Input")
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(async () => {

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: input }] }),
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
    <div className="w-full max-w-md">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-4 right-4 z-50 shadow-lg bg-gradient-to-r from-gray-900 from-60% to-[#666666] to-100% border-[#242424] rounded-full py-7"
          >
            <MessageSquareIcon className="h-6 w-6" />
            <span className="sr-only">Open chatbot</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col w-[20rem] md:w-[30rem] lg:w-[25rem] h-[70vh] md:h-[60vh] lg:h-[80vh]">
          <h1 className="flex justify-center text-2xl font-semibold">AI Chabot</h1>
          <DrawerHeader className="flex items-center justify-center z-10 opacity-70 px-4 py-3">
            <h3 className="text-lg font-medium">Your Personal Medical Companion</h3>
            {/* <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose> */}
          </DrawerHeader>
          <div className={classNames('flex-1 overflow-y-auto px-4 py-6', styles.successful)}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                >
                  <div
                    className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${message.role === "assistant"
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
              <Button type="submit" className="h-9 w-9 rounded-full" size="icon" disabled={isLoading}>
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

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M13.8234 1.3999L15.6537 6.34611L20.5999 8.17637L15.6537 10.0066L13.8234 14.9528L11.9932 10.0066L7.04696 8.17637L11.9932 6.34611L13.8234 1.3999Z" stroke="white" stroke-width="2" stroke-linejoin="round" />
      <path d="M5.35284 12.694L6.95167 15.0481L9.30579 16.647L6.95167 18.2458L5.35284 20.5999L3.75402 18.2458L1.3999 16.647L3.75402 15.0481L5.35284 12.694Z" stroke="white" stroke-width="2" stroke-linejoin="round" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
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