"use client";
import { RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const { data } = useSession();
  return (
    <div className="pt-[16px] px-[32px] flex justify-between">
      <div className="font-lexend font-bold text-[24px]">
        {/* Hi {data?.user?.firstname} */}
      </div>

      <Link
        href="/profile"
        className="flex items-center gap-1 text-lime-primary cursor-pointer text-xs"
      >
        <RefreshCcw className="w-[16px] h-[16px]" />
        <span>Sync Settings</span>
      </Link>
    </div>
  );
};
