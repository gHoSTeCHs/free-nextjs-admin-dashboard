import type { NextConfig } from 'next';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
	/* config options here */
	webpack(config, { isServer }) {
		if (isServer) {
			config.plugins = [...config.plugins, new PrismaPlugin()];
		}

		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});
		return config;
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
