import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    let { messages } = await request.json();

    let userData = null;
    if (messages[0]?.role === "assistant") {
      try {
        userData = JSON.parse(messages[0].content);
        messages.shift();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const prompt = messages
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role}: ${msg.content}`
      )
      .join("\n\n");

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt: `You are Sakura, a helpful assistant. You explain medical information to users in only one sentence. You are to remember the user's information at all time. ${prompt}, you are to include a secon sentence advicing the user on getting a second opinion through a verified medical professional on Mediassist.`,
    });

    console.log(messages);

    return Response.json({ text });
  } catch (error) {
    console.error("API route error:", error);
    return Response.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
