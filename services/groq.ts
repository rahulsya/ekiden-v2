import Groq from "groq-sdk";

export async function generateWithGroq(prompt: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_GROQ_API_KEY is not defined in environment variables.",
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Required to run directly on the client
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating summary with Groq:", error);
    throw error;
  }
}
