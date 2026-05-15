import { Fragment, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { CircleX } from "lucide-react";
import { toPng } from "html-to-image";
import { ShareStyle1 } from "./share-style-1";
import { ShareStyle2 } from "./share-style-2";

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
            {style === "style1" && <ShareStyle1 activity={activity} />}
            {style === "style2" && <ShareStyle2 activity={activity} />}
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
