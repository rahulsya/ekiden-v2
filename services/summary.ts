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

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
}

function formatPace(speed: number): string {
  if (!speed || speed === 0) return "--";
  const pace = 1000 / speed / 60;
  const min = Math.floor(pace);
  const sec = String(Math.round((pace % 1) * 60)).padStart(2, "0");
  return `${min}:${sec} min/km`;
}

function buildRunningPrompt(activity: any): string {
  return `
You are a professional running coach and sports analyst.
Analyze the following Strava running activity data and generate
a concise, motivating performance summary in 2-3 sentences.

The summary MUST include:
- Consistency observation (based on splits pace/speed variation)
- Heart rate zone analysis (Zone 1 <120bpm, Zone 2 120-140bpm, 
  Zone 3 140-160bpm, Zone 4 160-175bpm, Zone 5 >175bpm) — calculate % of laps in each zone
- Cadence consistency observation across elevation changes
- Tone: encouraging, coach-like, data-driven

Output format: Plain paragraph, no bullet points, no markdown.
Maximum 3 sentences. Start directly with the insight.

Activity Data:
- Distance: ${(activity.distance / 1000).toFixed(2)} km
- Moving Time: ${formatDuration(activity.moving_time)}
- Average Pace: ${formatPace(activity.average_speed)}
- Average Heart Rate: ${activity.average_heartrate || "--"} bpm
- Max Heart Rate: ${activity.max_heartrate || "--"} bpm
- Average Cadence: ${activity.average_cadence || "--"} spm
- Total Elevation Gain: ${activity.total_elevation_gain || 0} m

Lap Data:
${
  activity.laps
    ?.map(
      (lap: any) =>
        `Lap ${lap.lap_index}: HR ${lap.average_heartrate || "--"} bpm, Cadence ${lap.average_cadence || "--"} spm, Elevation gain ${lap.total_elevation_gain || 0}m`,
    )
    .join("\n") || "No lap data available."
}

Splits (avg speed per km):
${
  activity.splits_metric
    ?.slice(0, 10)
    .map(
      (s: any) =>
        `Split ${s.split}: ${formatPace(s.average_speed)}, HR ${Math.round(s.average_heartrate || 0)} bpm`,
    )
    .join("\n") || "No split data available."
}`;
}

function buildWeightTrainingPrompt(activity: any): string {
  return `
You are a professional strength and conditioning coach.
Analyze the following Strava weight training activity and generate
a concise, motivating performance summary in 2-3 sentences.

The summary MUST include:
- Session duration and effort level observation
- Heart rate analysis if available (zones: Zone 1 <120bpm, Zone 2 120-140bpm,
  Zone 3 140-160bpm, Zone 4 160-175bpm, Zone 5 >175bpm)
- Recovery or progression recommendation
- Tone: motivating, coach-like, practical

Output format: Plain paragraph, no bullet points, no markdown.
Maximum 3 sentences. Start directly with the insight.

Activity Data:
- Duration: ${formatDuration(activity.moving_time)}
- Elapsed Time: ${formatDuration(activity.elapsed_time)}
- Calories Burned: ${activity.calories || "--"} kcal
- Average Heart Rate: ${activity.average_heartrate || "--"} bpm
- Max Heart Rate: ${activity.max_heartrate || "--"} bpm`;
}

function buildCyclingPrompt(activity: any): string {
  return `
You are a professional cycling coach and sports analyst.
Analyze the following Strava cycling activity and generate
a concise, motivating performance summary in 2-3 sentences.

The summary MUST include:
- Speed and power consistency observation
- Heart rate zone distribution if available
- Elevation performance or climbing efficiency
- Tone: encouraging, technical, data-driven

Output format: Plain paragraph, no bullet points, no markdown.
Maximum 3 sentences. Start directly with the insight.

Activity Data:
- Distance: ${(activity.distance / 1000).toFixed(2)} km
- Moving Time: ${formatDuration(activity.moving_time)}
- Average Speed: ${((activity.average_speed || 0) * 3.6).toFixed(1)} km/h
- Max Speed: ${((activity.max_speed || 0) * 3.6).toFixed(1)} km/h
- Average Heart Rate: ${activity.average_heartrate || "--"} bpm
- Max Heart Rate: ${activity.max_heartrate || "--"} bpm
- Total Elevation Gain: ${activity.total_elevation_gain || 0} m
- Average Watts: ${activity.average_watts || "--"} w`;
}

function buildWalkingPrompt(activity: any): string {
  return `
You are a supportive wellness coach.
Analyze the following walking activity and generate
a concise, motivating summary in 2-3 sentences.

The summary MUST include:
- Distance and pace observation
- Effort level based on heart rate if available
- Positive reinforcement or goal-progression note
- Tone: warm, supportive, encouraging

Output format: Plain paragraph, no bullet points, no markdown.
Maximum 3 sentences. Start directly with the insight.

Activity Data:
- Distance: ${(activity.distance / 1000).toFixed(2)} km
- Moving Time: ${formatDuration(activity.moving_time)}
- Average Pace: ${formatPace(activity.average_speed)}
- Average Heart Rate: ${activity.average_heartrate || "--"} bpm
- Total Elevation Gain: ${activity.total_elevation_gain || 0} m`;
}

function buildDefaultPrompt(activity: any): string {
  return `
You are a professional sports coach and wellness analyst.
Analyze the following ${activity.sport_type || activity.type} activity from Strava
and generate a concise, motivating performance summary in 2-3 sentences.

Focus on:
- Overall effort and duration
- Heart rate data if available
- One practical takeaway or encouragement
- Tone: motivating, coach-like

Output format: Plain paragraph, no bullet points, no markdown.
Maximum 3 sentences. Start directly with the insight.

Activity Data:
- Type: ${activity.sport_type || activity.type}
- Distance: ${activity.distance ? (activity.distance / 1000).toFixed(2) + " km" : "N/A"}
- Moving Time: ${formatDuration(activity.moving_time)}
- Calories: ${activity.calories || "--"} kcal
- Average Heart Rate: ${activity.average_heartrate || "--"} bpm
- Max Heart Rate: ${activity.max_heartrate || "--"} bpm
- Total Elevation Gain: ${activity.total_elevation_gain || 0} m`;
}

// ─── Main export ───────────────────────────────────────────────
export function buildActivityPrompt(activity: any): string {
  const type = (activity.sport_type || activity.type || "").toLowerCase();

  const PROMPT_MAP: Record<string, (a: any) => string> = {
    run: buildRunningPrompt,
    trailrun: buildRunningPrompt,
    virtualrun: buildRunningPrompt,
    weighttraining: buildWeightTrainingPrompt,
    workout: buildWeightTrainingPrompt,
    ride: buildCyclingPrompt,
    virtualride: buildCyclingPrompt,
    ebikeride: buildCyclingPrompt,
    walk: buildWalkingPrompt,
    hike: buildWalkingPrompt,
  };

  const builder = PROMPT_MAP[type] ?? buildDefaultPrompt;
  return builder(activity);
}

export async function generateActivitySummary(activity: any) {
  const prompt = buildActivityPrompt(activity);

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
