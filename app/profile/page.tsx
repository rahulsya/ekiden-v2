"use client";
import { signIn, useSession } from "next-auth/react";

export default function page() {
  const { data, status } = useSession();
  console.log(status, data);

  const SyncStrava = async () => {
    await signIn("strava", {
      scope: "read_all",
      callbackUrl: "/profile",
    });
  };

  return (
    <div className="flex flex-col align-center justify-center h-screen px-4">
      <div className="p-[32px] rounded-[32px] flex flex-col items-center bg-white">
        <div className="font-bold text-xl">Connect Sources</div>
        <div className="text-muted-foreground text-sm">
          Select your primary training platforms
        </div>

        <div
          onClick={() => SyncStrava()}
          className="rounded-[16px] flex p-[20px] items-center bg-[#F2F3FE] gap-2 mt-8 cursor-pointer hover:bg-[#E7E7F2]"
        >
          <div className="w-[48px] h-[48px] bg-[#FC6100]/10 items-center justify-center flex rounded-[12px]">
            <img
              className="w-[16px] h-[21px]"
              src="/images/run.png"
              alt="run"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-[16px] font-bold">Sign in with Strava</div>
            <div className="text-sm">Sync segments and heart rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
