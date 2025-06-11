import PhrasesStatsComponent from '@/components/admin/phrase/PhrasesStats';

const AdminPhrases = () => {
	// const [phrases, setPhrases] = useState<Phrase | null>();

	// const mockPhraseStats = {
	// 	totalPhrases: 47832,
	// 	phraseGrowth: 8.5,
	// 	phraseGrowthAmount: 3764,
	// };

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
