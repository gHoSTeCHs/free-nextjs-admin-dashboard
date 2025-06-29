import PhrasesStatsComponent from '@/components/admin/phrase/PhrasesStats';

const AdminPhrases = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="flex">
				<main className="flex-1 ">
					<PhrasesStatsComponent />
				</main>
			</div>
		</div>
	);
};

export default AdminPhrases;
