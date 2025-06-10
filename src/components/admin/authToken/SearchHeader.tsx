'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface SearchHeaderProps {
	searchToken: string;
	onSearchChange: (value: string) => void;
	onCreateToken: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
	searchToken,
	onSearchChange,
	onCreateToken,
}) => {
	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Auth Tokens
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Manage authentication tokens for your cases
				</p>
			</div>

			<div className="flex items-center space-x-3 w-full sm:w-auto">
				<div className="relative flex-1 sm:flex-initial">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Search tokens..."
						value={searchToken}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
					/>
				</div>

				<button
					onClick={onCreateToken}
					className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap">
					<Plus className="w-4 h-4" />
					<span>New Token</span>
				</button>
			</div>
		</div>
	);
};

export default SearchHeader;
