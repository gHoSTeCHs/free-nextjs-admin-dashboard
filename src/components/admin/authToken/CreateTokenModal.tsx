'use client';

import React, { useState } from 'react';
import { generateSecureToken } from '@/utils/tokenGenerator';
import { X } from 'lucide-react';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { AuthToken, Case } from '@/types';

interface CreateTokenModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateToken: (token: Omit<AuthToken, 'id' | 'createdAt'>) => void;
	cases: Case[];
}

const CreateTokenModal: React.FC<CreateTokenModalProps> = ({
	isOpen,
	onClose,
	onCreateToken,
	cases,
}) => {
	const [formData, setFormData] = useState({
		token: '',
		caseId: '',
		isActive: true,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.token.trim() || !formData.caseId) return;

		const selectedCase = cases.find((c) => c.id === formData.caseId);
		onCreateToken({
			token: formData.token.trim(),
			caseId: formData.caseId,
			caseTitle: selectedCase?.title || '',
			isActive: formData.isActive,
		});

		setFormData({ token: '', caseId: '', isActive: true });
		onClose();
	};

	const generateRandomToken = () => {
		const token = generateSecureToken(32);
		setFormData((prev) => ({ ...prev, token }));
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Create Auth Token
					</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						title="close">
						<X className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Token
						</label>
						<div className="flex gap-2">
							<Input
								value={formData.token}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, token: e.target.value }))
								}
								placeholder="Enter token or generate one"
								required
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={generateRandomToken}
								className="whitespace-nowrap">
								Generate
							</Button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Case
						</label>
						<select
							value={formData.caseId}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, caseId: e.target.value }))
							}
							required
							className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
							title="case">
							<option value="">Select a case</option>
							{cases.map((c) => (
								<option key={c.id} value={c.id}>
									{c.title}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center">
						<input
							type="checkbox"
							id="isActive"
							checked={formData.isActive}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
							}
							className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
						/>
						<label
							htmlFor="isActive"
							className="ml-2 text-sm text-gray-700 dark:text-gray-300">
							Active
						</label>
					</div>

					<div className="flex gap-3 pt-4">
						<Button type="submit" className="flex-1">
							Create Token
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1">
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateTokenModal;
