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
import { SendIcon, BotMessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface Message {
  role: "assistant" | "user" | "system";
  content: string;
}

interface UserData {
  name: string;
  age: string;
  weight: string;
  familyHistory: string;
  allergies: string;
  immunizations: string;
  gender: string;
  phoneNumber: string;
  address: string;
  bloodType: string;
  pastSurgeries: string;
  hospitalNumber?: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, how can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        setUserData(userData);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setIsLoading(true);

    let messagesToSend = [...messages, newUserMessage];

    // Inject user data for the first message only
    if (messages.length === 1 && userData) {
      const userDataMessage: Message = {
        role: "user",
        content: `Here are my details ${JSON.stringify(userData)}`,
      };
      messagesToSend = [userDataMessage, ...messagesToSend];
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.text },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-md">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            title="Open Chatbot"
            variant="outline"
            className="fixed bottom-4 right-4 z-50 shadow-lg bg-gradient-to-r from-gray-900 from-60% to-[#666666] to-100% border-[#242424] rounded-full py-7 px-2"
          >
            <SakuraIcon className="h-10 w-10 relative right-2" color="white" />
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
          <div className={"flex-1 overflow-y-auto px-4 py-6 successful"}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "assistant"
                    ? "justify-start"
                    : "justify-end"
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
            <span className="text-[12px] flex justify-center">
              Sakura can make mistakes. Please double-check responses
            </span>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function SakuraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 421.95 421.95"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M266.146,183.011c38.797,11.465,26.51-50.785-4.785-24.51c-1.541,1.295-2.043,1.016-0.678-0.635 c25.672-30.996-38.6-42.023-24.368-2.543c0.334,0.926,0.014,1.045-0.517,0.16c-22.221-37.119-54.038,23.451-11.018,21.551 c1.808-0.08,1.918,0.344,0.174,0.746c-40.99,9.488,11.184,56.52,17.734,17.27c0.306-1.828,0.551-1.553,0.616,0.41 c1.252,36.951,55.334,5.959,22.626-11.701C263.967,182.697,264.003,182.376,266.146,183.011z" />
      <path d="M133.503,323.326c30.992,9.156,21.178-40.568-3.822-19.578c-1.231,1.033-1.633,0.811-0.541-0.508 c20.507-24.764-30.834-33.57-19.467-2.031c0.267,0.74,0.011,0.836-0.412,0.129c-17.75-29.654-43.168,18.732-8.8,17.215 c1.442-0.062,1.532,0.273,0.138,0.596c-32.745,7.578,8.934,45.15,14.168,13.797c0.244-1.463,0.439-1.24,0.492,0.326 c1.001,29.52,44.203,4.764,18.075-9.348C131.764,323.074,131.792,322.82,133.503,323.326z" />
      <path d="M330.852,237.12c31.347,9.264,21.419-41.029-3.864-19.802c-1.246,1.046-1.649,0.819-0.548-0.513 c20.74-25.043-31.185-33.952-19.688-2.057c0.271,0.748,0.011,0.846-0.417,0.131c-17.951-29.989-43.66,18.945-8.9,17.41 c1.46-0.064,1.551,0.276,0.142,0.604c-33.117,7.664,9.034,45.664,14.328,13.951c0.246-1.477,0.443-1.254,0.498,0.332 c1.013,29.854,44.705,4.814,18.279-9.453C329.09,236.867,329.121,236.609,330.852,237.12z" />
      <path d="M399.03,124.963c36.632,10.826,25.031-47.951-4.519-23.141c-1.456,1.223-1.93,0.959-0.64-0.6 c24.238-29.268-36.444-39.678-23.01-2.402c0.314,0.875,0.014,0.988-0.486,0.152c-20.98-35.049-51.024,22.143-10.401,20.348 c1.705-0.074,1.812,0.324,0.163,0.705c-38.703,8.959,10.56,53.367,16.745,16.307c0.288-1.729,0.521-1.467,0.583,0.387 c1.184,34.889,52.246,5.627,21.363-11.049C396.972,124.666,397.006,124.365,399.03,124.963z" />
      <path d="M343.035,152.609c1.392-1.074,0.66-1.727,0.274-2.146c-3.893-4.242-6.592-9.471-7.213-14.904 c-0.015-0.129-0.028-0.268-0.043-0.414c-0.049-0.549-0.379-1.734-1.869-0.834c-11.098,7.057-21.022,13.029-35.828,21.066 c-1.742,1.242-0.862,2.021-0.606,2.656c1.408,3.504,2.149,7.303,2.15,11.064c0,2.623-0.335,5.102-0.964,7.406 c-0.158,0.586,0.177,1.344,2.032,0.371C318.581,167.65,330.071,160.775,343.035,152.609z" />
      <path d="M367.451,207.882c-4.324,1.496-5.668,2.109-9.858,3.464c-2.229,0.688-0.92,1.984-0.54,2.718 c1.432,2.76,2.349,5.807,2.704,8.9c0.058,0.494,0.045,1.506,1.262,1.09c3.918-1.34,6.967-2.447,10.79-3.891 c0.432-0.162,1.39-0.629,1.013-1.326l-3.989-10.512C368.828,208.329,368.571,207.495,367.451,207.882z" />
      <path d="M273.482,230.841c-0.854-1.481-1.503-3.07-1.953-4.725c-0.142-0.52-0.249-1.604-1.745-1.604 c-11.547-0.225-20.518-1.18-29.364-2.473c-11.593-1.691-20.137-3.607-28.212-5.895c-0.843-0.404-0.765-0.621,0.172-0.938 c0.858-0.365-0.06-1.246-0.65-1.707c-5.169-4.012-9.199-9.549-10.915-15.557c-0.195-0.682-0.531-1.961-2.748-1.486 c-58.277,15.138-122.495,20.355-190.06-0.385c0,0-5.059-1.084-5.659,4.293c-0.458,4.098-1.37,11.629-2.187,18.016 c-0.962,7.525,2.715,7.896,2.715,7.896c15.997,4.908,26.146,6.945,43.261,8.943c2.468,0.146,4.192,1.236,4.872,1.711 c12.205,8.557,28.721,22.604,41.261,44.938c0.555,0.857,1.189,0.564,1.588,0.514c0.816-0.105,1.643-0.168,2.476-0.168 c1.188,0,2.489,0.102,3.865,0.383c0.433,0.088,0.636,0.021,0.808-0.258c0.461-0.746,0.849-1.479,1.294-2.113 c1.538-2.188,3.013-3.697,5.26-5.105c0.556-0.371,0.261-0.838,0.154-1.104c-6-14.855-13.342-26.756-21.438-35.025 c-0.457-0.465-1.036-1.086,0.464-1.369c17.842,0,34.335-1.461,53.072-4.398c8.768-1.375,17.636-3.09,26.584-5.107 c0.988-0.225,2.219-0.416,4.707-0.416c19.428,2.957,45.935,6.896,66.393,9.93c10.506,1.557,22.952,2.639,37.077,2.689 c1.375-0.018,1.505-0.611,1.587-0.92c0.246-0.932,0.565-1.855,0.976-2.77c0.128-0.285,0.021-1.098-0.771-1.982 C275.117,233.255,274.134,231.968,273.482,230.841z" />
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
