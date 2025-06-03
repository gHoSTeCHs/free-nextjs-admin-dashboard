import type { Metadata } from "next";
import React from "react";
import { StakingMetrics } from "@/components/staking/StakingMetrics";
import StakingRewardsChart from "@/components/staking/StakingRewardsChart";
import StakingTarget from "@/components/staking/StakingTarget";
import PerfomanceChart from "@/components/staking/PerformanceChart";
import StakingGeographyCard from "@/components/staking/StakingGeographyCard";
import RecentStakes from "@/components/staking/RecentStakes";

export const metadata: Metadata = {
  title:
    "NodeRevert",
  description: "Triple emcrypted crypto recovery vault",
};

export default function StakingDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <StakingMetrics />

        <StakingRewardsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <StakingTarget />
      </div>

      <div className="col-span-12">
        <PerfomanceChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <StakingGeographyCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentStakes />
      </div>
    </div>
  );
}
