"use client";

import {
  Flame,
  Gauge,
  Heart,
  Mountain,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { stravaService } from "@/services/strava";
import { useActivityFormat } from "@/hooks/use-activity-format";
import { generateActivitySummary } from "@/services/summary";

export default function ActivityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    formatDate,
    formatTimeOfDay,
    formatDistance,
    formatPace,
    formatTime,
  } = useActivityFormat();

  const {
    data: activity,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["activity", id],
    queryFn: () => stravaService.getActivity(id),
  });

  const {
    data: aiSummary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isFetching: isSummaryFetching,
  } = useQuery({
    queryKey: ["ai-summary", id],
    queryFn: async () => {
      if (!activity) return null;

      const cached = localStorage.getItem(`summary-${id}`);
      if (cached) return cached;

      const summary = await generateActivitySummary(activity);

      localStorage.setItem(`summary-${id}`, summary);
      return summary;
    },
    enabled: !!activity,
    staleTime: Infinity,
  });

  const handleRegenerate = () => {
    localStorage.removeItem(`summary-${id}`);
    refetchSummary();
  };

  if (isLoading) {
    return (
      <div className="bg-[#111317] flex items-center justify-center h-full text-white font-space-grotesk">
        Loading activity...
      </div>
    );
  }

  if (isError || !activity) {
    return (
      <div className="bg-[#111317] flex items-center justify-center h-full text-red-500 font-space-grotesk">
        Failed to load activity.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-[32px] bg-[#111317] overflow-y-auto">
      <div className="flex flex-row justify-between pb-8">
        <Link href="/">
          <ArrowLeft className="text-white" />
        </Link>
      </div>
      <div className="font-space-grotesk font-bold text-[10px] text-lime-primary uppercase">
        {formatDate(activity.start_date, activity.timezone)} •{" "}
        {formatTimeOfDay(activity.start_date, activity.timezone)}
      </div>
      <div className="font-lexend font-black text-[36px] text-white">
        {activity.name}
      </div>
      <div className="mt-[10px]"></div>
      <div className="flex flex-row justify-between gap-4 py-[24px] border-t border-b border-[#444933] text-[10px]">
        <div className="flex flex-col font-space-grotesk text-white-60 min-w-[80px]">
          <div>DISTANCE</div>
          <div className="text-[30px] font-bold text-white font-lexend">
            {formatDistance(activity.distance)}{" "}
            <span className="text-white-60 text-sm font-normal">km</span>
          </div>
        </div>
        <div className="flex flex-col font-space-grotesk text-white-60 min-w-[80px]">
          <div>PACE</div>
          <div className="text-[30px] font-bold text-white font-lexend">
            {formatPace(activity.average_speed)}{" "}
            <span className="text-white-60 text-sm font-normal">/km</span>
          </div>
        </div>
        <div className="flex flex-col font-space-grotesk text-white-60">
          <div>TIME</div>
          <div className="text-[30px] font-bold text-white font-lexend">
            {formatTime(activity.moving_time)}
          </div>
        </div>
      </div>

      <div className="mt-[40px]"></div>

      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <TrendingUp className="text-lime-primary" />
            <span className="font-space-grotesk text-xs">
              PERFORMANCE ANALYSIS
            </span>
          </div>
          {/* <button
            onClick={handleRegenerate}
            disabled={isSummaryFetching}
            className="flex flex-row items-center gap-1 text-xs text-white-60 hover:text-white transition-colors"
          >
            <RefreshCw
              className={`w-3 h-3 ${isSummaryFetching ? "animate-spin" : ""}`}
            />
            <span>Regenerate</span>
          </button> */}
        </div>
        <div className="text-pretty text-white-60 mt-2 text-sm min-h-[60px]">
          {isSummaryLoading || isSummaryFetching ? (
            <div className="animate-pulse">Generating AI summary...</div>
          ) : (
            aiSummary || "Unable to generate summary."
          )}
        </div>
      </div>

      <div className="mt-[40px]"></div>

      <div className="flex flex-row justify-between">
        <div className="flex gap-4">
          <div className="flex gap-2 text-white-60 font-space-grotesk text-xs items-center">
            <Gauge className="text-lg" />
            <span className="text-[10px]">
              MAX <br /> SPEED
            </span>
          </div>
          <div className="flex flex-col text-white font-lexend text-[18px]">
            {activity.max_speed ? (activity.max_speed * 3.6).toFixed(1) : "--"}
            <span className="text-white-60 text-sm">km/h</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 text-white-60 font-space-grotesk text-xs items-center">
            <Heart className="text-lg" />
            <span className="text-[10px]">
              HEART
              <br />
              RATE
            </span>
          </div>
          <div className="flex flex-col text-white font-lexend text-[18px]">
            {activity.average_heartrate || "--"}
            <span className="text-white-60 text-sm">bpm</span>
          </div>
        </div>
      </div>

      <div className="mt-[20px]"></div>
      <div className="flex flex-row justify-between">
        <div className="flex gap-4">
          <div className="flex gap-2 text-white-60 font-space-grotesk text-xs items-center">
            <Mountain className="text-lg" />
            <span className="text-[10px]">ELEVATION</span>
          </div>
          <div className="flex flex-col text-white font-lexend text-[18px]">
            {activity.total_elevation_gain > 0 ? "+" : ""}
            {activity.total_elevation_gain}
            <span className="text-white-60 text-sm">m</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 text-white-60 font-space-grotesk text-xs items-center">
            <Flame className="text-lg" />
            <span className="text-[10px]">CALORIES</span>
          </div>
          <div className="flex flex-col text-white font-lexend text-[18px]">
            {activity.calories || "--"}
            <span className="text-white-60 text-sm">kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
