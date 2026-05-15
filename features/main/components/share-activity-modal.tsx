import { Fragment, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { CircleX } from "lucide-react";
import { toPng } from "html-to-image";
import { ActivityMap } from "./activity-map";
import { ActivityStat } from "./activity-stat";
import { useActivityFormat } from "@/hooks/use-activity-format";

interface ShareActivityModalProps {
  show: boolean;
  onClose: () => void;
  activity: any;
}

export function ShareActivityModal({
  show,
  onClose,
  activity,
}: ShareActivityModalProps) {
  const shareImgRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState<"style1" | "style2">("style1");

  const { formatDistance, formatPace, formatTime } = useActivityFormat();

  const downloadImage = () => {
    if (shareImgRef.current) {
      setLoading(true);
      toPng(shareImgRef.current, {
        cacheBust: true,
        backgroundColor: undefined, // ← kunci utama, jangan set backgroundColor
        style: {
          background: "transparent",
        },
      })
        .then((dataUrl) => {
          setLoading(false);
          const link = document.createElement("a");
          link.download = `activity-${activity.id}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transition-all duration-300 ease-in-out"
      enterFrom={"translate-y-full opacity-0"}
      enterTo={"translate-y-0 opacity-100"}
      leave="transition-all duration-300 ease-in-out"
      leaveFrom={"translate-y-0 opacity-100"}
      leaveTo={"translate-y-full opacity-0"}
    >
      <div className="h-auto w-full absolute bottom-0 left-0 px-4 shadow-lg z-50">
        <div className="w-full bg-[#1A1C1F] h-full rounded-t-lg p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <div className="font-lexend font-bold text-lg text-white">
              Share Activity
            </div>
            <button
              onClick={onClose}
              className="text-white-60 hover:text-white transition-colors"
            >
              <CircleX />
            </button>
          </div>
          <div className="flex gap-2 text-sm py-4">
            <button
              onClick={() => setStyle("style1")}
              className={`cursor-pointer rounded-full text-xs px-3 py-1 flex items-center justify-center transition-colors ${
                style === "style1"
                  ? "bg-lime-primary text-black font-bold"
                  : "bg-gray-500 text-white"
              }`}
            >
              Style 1
            </button>
            <button
              onClick={() => setStyle("style2")}
              className={`cursor-pointer rounded-full text-xs px-3 py-1 flex items-center justify-center transition-colors ${
                style === "style2"
                  ? "bg-lime-primary text-black font-bold"
                  : "bg-gray-500 text-white"
              }`}
            >
              Style 2
            </button>
          </div>

          <div
            ref={shareImgRef}
            className="relative flex flex-col p-2 rounded-lg"
          >
            {style === "style1" && (
              <>
                {activity.map?.polyline || activity.map?.summary_polyline ? (
                  <div className="w-full h-[300px]">
                    <ActivityMap
                      polyline={
                        activity.map.polyline || activity.map.summary_polyline
                      }
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
            )}

            {style === "style2" && (
              <div className="flex flex-col items-center justify-center py-10 bg-black/20 rounded-xl">
                <div className="text-white text-lg font-space-grotesk opacity-50">
                  Style 2 Placeholder
                </div>
                <div className="text-white-60 text-sm mt-2">
                  Add more styles here!
                </div>
              </div>
            )}
          </div>

          <button
            disabled={loading}
            onClick={downloadImage}
            className="w-full h-10 mt-[40px] bg-lime-primary text-black font-lexend text-[10px] rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating" : "Generate"}
          </button>
        </div>
      </div>
    </Transition>
  );
}
