"use client";

import React from "react";
import ActivityItem from "@/features/main/components/activity-item";
import { useQuery } from "@tanstack/react-query";
import { stravaService } from "@/services/strava";

function Activities() {
  const {
    data: activities,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () => stravaService.getActivities({ page: 1, per_page: 10 }),
  });

  if (isLoading) {
    return (
      <div className="text-white font-space-grotesk animate-pulse">
        Loading activities...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 font-space-grotesk">
        Failed to load activities.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {activities?.length > 0 ? (
        activities.map((activity: any) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))
      ) : (
        <div className="text-white-60 font-space-grotesk">
          No activities found.
        </div>
      )}
    </div>
  );
}

export default Activities;
