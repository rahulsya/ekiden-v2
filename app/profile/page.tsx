"use client";
import { ArrowLeft, RefreshCw, SquareArrowOutUpRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

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
    <div className="flex flex-col h-screen p-[32px] bg-[#111317]">
      <div className="flex flex-row justify-between pb-8">
        <Link href="/">
          <ArrowLeft className="text-white" />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="w-[296px] h-[44px] font-lexend font-bold text-[28px]">
          Profile
        </div>
      </div>
      <div className="text-sm text-white-60">
        Manage your account settings and preferences.
      </div>

      <div className="mt-4">
        {status == "authenticated" ? (
          <>
            <div className="rounded-[16px] flex p-[20px] items-start bg- gap-2 mt-8 cursor-pointer border border-lime-primary">
              <div>
                <SquareArrowOutUpRight className="text-lime-primary" />
              </div>
              <div className="flex flex-col">
                <div className="text-[16px] font-bold text-lime-primary">
                  Connected to Strava
                </div>
                <div className="text-sm">
                  Your runs, rides, and swims are automatically synced.
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            onClick={() => SyncStrava()}
            className="rounded-[16px] flex p-[20px] items-start bg- gap-2 mt-8 cursor-pointer border border-lime-primary"
          >
            <div>
              <SquareArrowOutUpRight className="text-lime-primary" />
            </div>
            <div className="flex flex-col">
              <div className="text-[16px] font-bold text-lime-primary">
                Connect To Strava
              </div>
              <div className="text-sm">
                Automatically sync your runs, rides, and swims to get deep
                performance analysis.
              </div>
            </div>
          </div>
        )}

        <div className="font-space-grotesk font-bold sm mt-8">
          Reconnect to Strava
        </div>
        <div className="text-sm text-white-60">
          Reconnect if you got problem with your data.
        </div>
        <button
          onClick={SyncStrava}
          className="mt-4 px-4 py-2 bg-lime-primary text-black font-bold rounded-full cursor-pointer"
        >
          Reconnect to Strava
        </button>
      </div>
    </div>
  );
}
