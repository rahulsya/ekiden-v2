import { useActivityFormat } from "@/hooks/use-activity-format";
import { ActivityStat } from "../../../components/commons/activity-stat";
import Image from "next/image";

export function ShareStyle3({ activity }: { activity: any }) {
  const { formatDistance, formatPace, formatTime } = useActivityFormat();

  return (
    <div className="relative w-full ">
      <div className="flex flex-col rounded-[18px] p-4 bg-slate-400/50 backdrop-blur-sm">
        <div className="text-[48px] font-semibold">
          {formatDistance(activity.distance)}
          <span className="text-base font-normal">km</span>
        </div>
        <div className="flex flex-wrap justify-between flex-row gap-4">
          <div className="flex flex-col font-bold">
            {formatTime(activity.moving_time)}
            <span className="text-xs font-normal">Activity Time</span>
          </div>
          <div className="flex flex-col font-bold">
            <div className="flex gap-2 items-center">
              {activity.calories || "--"}
              <span className="text-sm font-normal">kcal</span>
            </div>
            <span className="text-xs font-normal">Calories</span>
          </div>
          <div className="flex flex-col font-bold">
            <div className="flex gap-1 items-center">
              {formatPace(activity.average_speed)}
              <span className="text-sm font-normal">/km</span>
            </div>
            <span className="text-xs font-normal">Average Pace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
