import { useActivityFormat } from "@/hooks/use-activity-format";
import { ActivityMap } from "../../../components/commons/activity-map";
import { ActivityStat } from "../../../components/commons/activity-stat";

export function ShareStyle1({ activity }: { activity: any }) {
  const { formatDistance, formatPace, formatTime } = useActivityFormat();

  return (
    <>
      {activity.map?.polyline || activity.map?.summary_polyline ? (
        <div className="w-full h-[300px]">
          <ActivityMap
            polyline={activity.map.polyline || activity.map.summary_polyline}
            lineColor="#fff"
          />
        </div>
      ) : null}

      <div className="flex flex-row justify-between gap-4 py-[8px] border-[#444933] text-[10px]">
        <ActivityStat
          className="min-w-[80px]"
          label="DISTANCE"
          labelClassName="font-medium text-[12px] text-white"
          value={formatDistance(activity.distance)}
          unit="km"
        />
        <ActivityStat
          className="min-w-[80px]"
          label="PACE"
          labelClassName="font-medium text-[12px] text-white"
          value={formatPace(activity.average_speed)}
          unit="/km"
        />
        <ActivityStat
          label="TIME"
          labelClassName="font-medium text-[12px] text-white"
          value={formatTime(activity.moving_time)}
        />
      </div>
      <div className="flex flex-row justify-between gap-4 py-[8px] border-[#444933] text-[10px]">
        <ActivityStat
          className="min-w-[80px]"
          label="HEART RATE"
          labelClassName="font-medium text-[12px] text-white"
          value={activity.average_heartrate || "--"}
          unit="bpm"
        />
        <ActivityStat
          className="min-w-[80px]"
          label="ELEVATION"
          labelClassName="font-medium text-[12px] text-white"
          value={activity.total_elevation_gain}
          unit="m"
        />
        <ActivityStat
          label="CALORIES"
          labelClassName="font-medium text-[12px] text-white"
          value={activity.calories || "--"}
          unit="kcal"
        />
      </div>
    </>
  );
}
