import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const prompt = messages
    .map((msg: { role: any; content: any }) => `${msg.role}: ${msg.content}`)
    .join("\n\n");

  const { text } = await generateText({
      model: anthropic('claude-3-haiku-20240307'),
      prompt: `You are a helpful assistant. You explain medical information to users in one sentence.\n\n${prompt}`,
  });

  // let text =
  //   "The chat bot is currently disabled to save AI costs, but it really works, I promise!";

  // if (messages.length == 6) {
  //   text = "Can you stop spamming me? I'm trying to help you!";
  // } else if (messages.length == 8) {
  //   text = "I'm going to ignore you now. Goodbye!";
  // } else if (messages.length >= 9) {
  //   text = "I'm still here, but I'm not going to respond to you anymore.";
  // }

  return Response.json({ text });
}
