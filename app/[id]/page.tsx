"use client";

import {
  Flame,
  Gauge,
  Heart,
  Mountain,
  TrendingUp,
  RefreshCw,
  CircleX,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { stravaService } from "@/services/strava";
import { useActivityFormat } from "@/hooks/use-activity-format";
import { generateActivitySummary } from "@/services/summary";
import { ActivityMap } from "@/features/main/components/activity-map";
import { ActivityStat } from "@/features/main/components/activity-stat";
import { ShareActivityModal } from "@/features/main/components/share-activity-modal";

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

  const [show, setShow] = useState(false);

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
    <div className="relative flex flex-col min-h-screen p-[32px] bg-[#111317] overflow-y-auto">
      <div className="flex flex-row justify-between pb-4">
        <Link href="/">
          <ArrowLeft className="text-white" />
        </Link>
      </div>
      {activity.map?.polyline || activity.map?.summary_polyline ? (
        <>
          <div className="w-full h-[300px]">
            <ActivityMap
              polyline={activity.map.polyline || activity.map.summary_polyline}
            />
          </div>
          <div className="mt-[10px]"></div>
        </>
      ) : null}

      <div className="font-space-grotesk font-bold text-[10px] text-lime-primary uppercase">
        {formatDate(activity.start_date, activity.timezone)} •{" "}
        {formatTimeOfDay(activity.start_date, activity.timezone)}
      </div>
      <div className="font-lexend font-black text-[36px] text-white">
        {activity.name}
      </div>
      <div className="mt-[10px]"></div>
      {activity.type === "WeightTraining" ||
      activity.sport_type === "WeightTraining" ? (
        <div className="flex flex-row justify-between gap-4 py-[24px] border-t border-b border-[#444933] text-[10px]">
          <ActivityStat
            className="min-w-[80px]"
            label="TIME"
            value={formatTime(activity.moving_time)}
          />
          <ActivityStat
            className="min-w-[80px]"
            label="AVG HR"
            value={
              activity.average_heartrate
                ? Math.round(activity.average_heartrate)
                : "--"
            }
            unit="bpm"
          />
          <ActivityStat
            label="CALORIES"
            value={activity.calories ? Math.round(activity.calories) : "--"}
            unit="kcal"
          />
        </div>
      ) : (
        <div className="flex flex-row justify-between gap-4 py-[24px] border-t border-b border-[#444933] text-[10px]">
          <ActivityStat
            className="min-w-[80px]"
            label="DISTANCE"
            value={formatDistance(activity.distance)}
            unit="km"
          />
          <ActivityStat
            className="min-w-[80px]"
            label="PACE"
            value={formatPace(activity.average_speed)}
            unit="/km"
          />
          <ActivityStat label="TIME" value={formatTime(activity.moving_time)} />
        </div>
      )}

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

      <button
        onClick={() => setShow(true)}
        className="w-full h-10 mt-[40px] bg-lime-primary text-black font-lexend text-[10px] rounded-full font-semibold"
      >
        Share Activity
      </button>

      <ShareActivityModal
        show={show}
        onClose={() => setShow(false)}
        activity={activity}
      />
    </div>
  );
}
