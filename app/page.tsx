import Activities from "@/features/main/components/activities";
import { Header } from "@/features/main/components/header";

export default function Home() {
  return (
    <div className="flex flex-col h-full  bg-[#111317] overflow-y-auto">
      <Header />
      <div className="p-[32px] pt-0">
        <div className="font-lexend font-bold text-[32px]">
          Recent Activities
        </div>
        <div className="text-sm text-white-60">
          Reviewing your performance over the last 30 days.
        </div>

        <div className="mt-4">
          <Activities />
        </div>
      </div>
    </div>
  );
}
