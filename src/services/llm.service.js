import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


/**
 * Generate a short summary of previous conversation
 */
export async function generateSummary(messages) {
  if (!messages.length) return "";

  const prompt = `
Summarize the following conversation briefly.
Focus on:
- User intent
- Preferences
- Important context
- Unresolved issues

Conversation:
${messages.map((m) => `${m.sender}: ${m.text}`).join("\n")}
`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.2,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Summary LLM error:", error.message);
    return "";
  }
}

/**
 * Generate final AI reply using summary + recent messages
 */
export async function generateReply({ summary, recentMessages, userMessage }) {
  const systemPrompt = `
You are a helpful support agent for a small e-commerce store.

Store Policies:
- Shipping: Ships worldwide. Delivery in 5–7 business days.
- Returns: 30-day return policy.
- Support Hours: Mon–Fri, 9am–6pm IST.

If previous context is relevant, use it.
If not relevant, ignore it completely.
Be concise and accurate.
`;

  const messages = [
    { role: "system", content: systemPrompt },

    summary
      ? {
        role: "system",
        content: `Conversation summary:\n${summary}`,
      }
      : null,

    ...recentMessages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })),

    {
      role: "user",
      content: userMessage,
    },
  ].filter(Boolean);

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Reply LLM error:", error.message);
    throw new Error("AI service temporarily unavailable.");
  }
}
