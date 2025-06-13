import type { Metadata } from 'next';
import React from 'react';
import { StakingMetrics } from '@/components/staking/StakingMetrics';
import StakingRewardsChart from '@/components/staking/StakingRewardsChart';
import StakingTarget from '@/components/staking/StakingTarget';
import PerfomanceChart from '@/components/staking/PerformanceChart';
import StakingGeographyCard from '@/components/staking/StakingGeographyCard';
import RecentStakes from '@/components/staking/RecentStakes';

export const metadata: Metadata = {
	title: 'NodeRevert',
	description: 'Triple emcrypted crypto recovery vault',
};

export default function StakingDashboard() {
	return (
		<div className="relative overflow-hidden">
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

			<div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center lg:top-16 lg:left-[90px] xl:left-[290px]">
				<div className="text-center">
					<h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
						FEATURE
					</h1>
					<h2 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-6">
						COMING SOON
					</h2>
					<div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
				</div>
			</div>
		</div>
	);
}
