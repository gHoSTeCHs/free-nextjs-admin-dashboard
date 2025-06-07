import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
	id: string;
	mode?: 'single' | 'multiple' | 'range' | 'time';
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	defaultDate?: DateOption;
	value?: string;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
};

export default function DatePicker({
	id,
	mode,
	onChange,
	label,
	defaultDate,
	value,
	placeholder,
	disabled = false,
	required = false,
}: PropsType) {
	const flatpickrRef = useRef<flatpickr.Instance | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			flatpickrRef.current = flatpickr(inputRef.current, {
				mode: mode || 'single',
				static: true,
				monthSelectorType: 'static',
				dateFormat: 'Y-m-d',
				defaultDate: value || defaultDate,
				onChange: (selectedDates, dateStr) => {
					if (onChange && inputRef.current) {
						const syntheticEvent = {
							target: {
								value: dateStr,
								name: inputRef.current.name,
								id: inputRef.current.id,
							},
							currentTarget: inputRef.current,
							preventDefault: () => {},
							stopPropagation: () => {},
						} as React.ChangeEvent<HTMLInputElement>;

						onChange(syntheticEvent);
					}
				},
			});
		}

		return () => {
			if (flatpickrRef.current) {
				flatpickrRef.current.destroy();
			}
		};
	}, [mode, onChange, id, defaultDate, value]);

	useEffect(() => {
		if (flatpickrRef.current && value !== undefined) {
			flatpickrRef.current.setDate(value, false);
		}
	}, [value]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e);
		}
	};

	return (
		<div>
			{label && <Label htmlFor={id}>{label}</Label>}

			<div className="relative">
				<input
					ref={inputRef}
					id={id}
					placeholder={placeholder}
					value={value || ''}
					onChange={handleInputChange}
					disabled={disabled}
					required={required}
					className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
				/>

				<span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
					<CalenderIcon className="size-6" />
				</span>
			</div>
		</div>
	);
}
