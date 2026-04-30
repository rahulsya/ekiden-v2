import Activities from "@/features/main/components/activities";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col h-full p-[32px] bg-[#111317] overflow-y-auto">
      <div className="font-lexend font-bold text-[32px]">Recent Activities</div>
      <div className="text-sm text-white-60">
        Reviewing your performance over the last 30 days.
      </div>

      <div className="mt-4">
        <Activities />
      </div>
    </div>
  );
}
