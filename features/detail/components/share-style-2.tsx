import { useActivityFormat } from "@/hooks/use-activity-format";
import { ActivityStat } from "../../../components/commons/activity-stat";

export function ShareStyle2({ activity }: { activity: any }) {
  const { formatDistance, formatPace, formatTime } = useActivityFormat();

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-between flex-row gap-4 py-[8px] border-[#444933] text-[10px]">
        {activity.distance > 0 && (
          <ActivityStat
            className="min-w-[100px]"
            label="DISTANCE"
            labelClassName="font-bold text-[12px] text-white"
            value={formatDistance(activity.distance)}
            unit="km"
          />
        )}
        {activity.average_speed > 0 && (
          <ActivityStat
            className="min-w-[100px]"
            label="PACE"
            labelClassName="font-bold text-[12px] text-white"
            value={formatPace(activity.average_speed)}
            unit="/km"
          />
        )}
        {activity.moving_time > 0 && (
          <ActivityStat
            label="TIME"
            labelClassName="font-bold text-[12px] text-white"
            value={formatTime(activity.moving_time)}
          />
        )}
        {activity.average_heartrate && (
          <ActivityStat
            className="min-w-[100px]"
            label="HEART RATE"
            labelClassName="font-bold text-[12px] text-white"
            value={activity.average_heartrate || "--"}
            unit="bpm"
          />
        )}
        {activity.total_elevation_gain > 0 && (
          <ActivityStat
            className="min-w-[100px]"
            label="ELEVATION"
            labelClassName="font-bold text-[12px] text-white"
            value={activity.total_elevation_gain}
            unit="m"
          />
        )}
        {activity.calories && (
          <ActivityStat
            label="CALORIES"
            labelClassName="font-bold text-[12px] text-white"
            value={activity.calories || "--"}
            unit="kcal"
          />
        )}
      </div>
    </div>
  );
}
