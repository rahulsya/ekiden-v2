import React from "react";

interface ActivityStatProps {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function ActivityStat({
  label,
  value,
  unit,
  className = "",
  labelClassName = "",
}: ActivityStatProps) {
  return (
    <div
      className={`flex flex-col font-space-grotesk text-white-60 ${className}`.trim()}
    >
      <div className={labelClassName}>{label}</div>
      <div className="text-[18px] lg:text-[30px] font-bold text-white font-lexend">
        {value}
        {unit && (
          <>
            {" "}
            <span className="text-white-60 text-sm font-normal">{unit}</span>
          </>
        )}
      </div>
    </div>
  );
}
