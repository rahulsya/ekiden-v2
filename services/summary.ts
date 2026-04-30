import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateWithGroq } from "./groq";

async function generateWithGemini(prompt: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API key not found");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
  const result = await model.generateContent(prompt);
  return await result.response.text();
}

export async function generateActivitySummary(activity: any) {
  const prompt = `
You are a professional running coach and sports analyst. 
Analyze the following Strava running activity data and generate 
a concise, motivating performance summary in 2-3 sentences.

The summary MUST include:
- Consistency observation (based on splits pace/speed variation)
- Heart rate zone analysis (use these zones: Zone 1 <120bpm, 
  Zone 2 120-140bpm, Zone 3 140-160bpm, Zone 4 160-175bpm, 
  Zone 5 >175bpm) — calculate % of laps/splits in each zone
- Cadence consistency observation across elevation changes
- Tone: encouraging, coach-like, data-driven

Output format: Plain paragraph, no bullet points, no markdown.
Maximum 3 sentences. Start directly with the insight.

Activity Data:
- Distance: ${(activity.distance / 1000).toFixed(2)} km
- Moving Time: ${Math.floor(activity.moving_time / 60)} min ${activity.moving_time % 60} sec
- Average Pace: ${(1000 / activity.average_speed / 60).toFixed(0)}:${String(Math.round(((1000 / activity.average_speed / 60) % 1) * 60)).padStart(2, "0")} min/km
- Average Heart Rate: ${activity.average_heartrate || "--"} bpm
- Max Heart Rate: ${activity.max_heartrate || "--"} bpm
- Average Cadence: ${activity.average_cadence || "--"} spm
- Total Elevation Gain: ${activity.total_elevation_gain || 0} m

Lap Data (Heart Rate per lap):
${
  activity.laps
    ?.map(
      (lap: any) =>
        `Lap ${lap.lap_index}: HR ${lap.average_heartrate || "--"} bpm, 
   Cadence ${lap.average_cadence || "--"} spm, 
   Elevation gain ${lap.total_elevation_gain || 0}m`,
    )
    .join("\n") || "No lap data available."
}

Splits (avg speed per km):
${
  activity.splits_metric
    ?.slice(0, 10)
    .map(
      (s: any) =>
        `Split ${s.split}: ${(1000 / s.average_speed / 60).toFixed(0)}:${String(Math.round(((1000 / s.average_speed / 60) % 1) * 60)).padStart(2, "0")} min/km, HR ${Math.round(s.average_heartrate || 0)} bpm`,
    )
    .join("\n") || "No split data available."
}
`;

  try {
    const provider = process.env.NEXT_PUBLIC_AI_PROVIDER;
    
    if (provider === "groq") {
      return await generateWithGroq(prompt);
    } else {
      return await generateWithGemini(prompt);
    }
  } catch (error) {
    console.error("Error generating summary on client:", error);
    throw error;
  }
}
