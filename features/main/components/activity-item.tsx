import React from "react";
import { useRouter } from "next/navigation";
import { useActivityFormat } from "@/hooks/use-activity-format";

function ActivityItem({ activity }: { activity?: any }) {
  const router = useRouter();
  const { formatDate, formatTimeOfDay, formatDistance, formatPace, formatTime } = useActivityFormat();

  // Fallback to old dummy content if no activity is provided (for testing or before API loads)
  if (!activity) {
    return (
      <div className="flex flex-col border-b pb-[32px] border-b-[#444933]">
        <div className="font-space-grotesk text-lime-primary text-[10px] uppercase">
          Yesterday
        </div>
        <div className="text-[20px] font-lexend text-white">Morning Run</div>
        <div className="text-white-60 text-xs mt-1">
          07:14 AM • Technical Urban Track
        </div>

        <div className="flex flex-row gap-4 pt-[24px] text-[10px]">
          <div className="flex flex-col font-space-grotesk text-white-60 min-w-[80px]">
            <div>DISTANCE</div>
            <div className="text-[18px] text-white font-lexend">
              7.24 <span className="text-white-60 text-xs">km</span>
            </div>
          </div>
          <div className="flex flex-col font-space-grotesk text-white-60 min-w-[80px]">
            <div>PACE</div>
            <div className="text-[18px] text-white font-lexend">
              5:12 <span className="text-white-60 text-xs">/km</span>
            </div>
          </div>
          <div className="flex flex-col font-space-grotesk text-white-60">
            <div>TIME</div>
            <div className="text-[18px] text-white font-lexend">43:46</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-b pb-[32px] border-b-[#444933]">
      <div
        onClick={() => router.push(`/${activity.id}`)}
        className="flex flex-col cursor-pointer"
      >
        <div
          className={`font-space-grotesk text-lime-primary text-[10px] uppercase`}
        >
          {formatDate(activity.start_date, activity.timezone)}
        </div>
        <div className="text-[20px] font-lexend text-white">
          {activity.name}
        </div>
        <div className="text-white-60 text-xs mt-1">
          {formatTimeOfDay(activity.start_date, activity.timezone)} •{" "}
          {activity.type}
        </div>
      </div>

      <div className="flex flex-row gap-4 pt-[24px] text-[10px]">
        <div className="flex flex-col font-space-grotesk text-white-60 min-w-[80px]">
          <div>DISTANCE</div>
          <div className="text-[18px] text-white font-lexend">
            {formatDistance(activity.distance)}{" "}
            <span className="text-white-60 text-xs">km</span>
          </div>
        </div>
        <div className="flex flex-col font-space-grotesk text-white-60 min-w-[80px]">
          <div>PACE</div>
          <div className="text-[18px] text-white font-lexend">
            {formatPace(activity.average_speed)}{" "}
            <span className="text-white-60 text-xs">/km</span>
          </div>
        </div>
        <div className="flex flex-col font-space-grotesk text-white-60">
          <div>TIME</div>
          <div className="text-[18px] text-white font-lexend">
            {formatTime(activity.moving_time)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityItem;
