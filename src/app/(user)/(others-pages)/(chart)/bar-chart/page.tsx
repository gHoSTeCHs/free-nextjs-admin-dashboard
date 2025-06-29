import BarChartOne from '@/components/charts/bar/BarChartOne';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	title: 'Next.js Bar Chart | NodeRevert - Next.js Dashboard Template',
	description:
		"A system dedicated to your comfort and satisfaction in crypto trading, while securing your assets for what's to come",
};

export default function page() {
	return (
		<div>
			<PageBreadcrumb pageTitle="Bar Chart" />
			<div className="space-y-6">
				<ComponentCard title="Bar Chart 1">
					<BarChartOne />
				</ComponentCard>
			</div>
		</div>
	);
}
