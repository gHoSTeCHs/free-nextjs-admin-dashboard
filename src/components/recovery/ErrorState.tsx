interface ErrorStateProps {
	error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
	return (
		<div className="text-center py-12">
			<div className="mx-auto h-12 w-12 text-red-400">
				<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			</div>
			<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
				Error Loading Case
			</h3>
			<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
		</div>
	);
}
