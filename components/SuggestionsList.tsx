import { CheckCircle, XCircle } from "lucide-react";

type SuggestionsListProps = {
	recommendations: string[];
};

export default function SuggestionsList({
	recommendations,
}: SuggestionsListProps) {
	return (
		<ul className="space-y-4">
			{recommendations.map((rec, index) => {
				// Calculamos el retraso progresivo basado en el índice
				const delay = `${index * 0.3}s`; // Aumentamos el retraso por cada elemento
				return (
					<li
						key={rec}
						className={
							"flex translate-y-5 transform animate-fade-in items-start opacity-0 duration-500 ease-out"
						}
						style={{
							animationDelay: delay, // Usamos el retraso
						}}
					>
						{rec.startsWith("No") || rec.startsWith("no") ? (
							<XCircle className="mt-1 mr-2 h-5 w-5 flex-shrink-0 text-red-500" />
						) : (
							<CheckCircle className="mt-1 mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
						)}
						<span className="text-white">{rec}</span>
					</li>
				);
			})}
		</ul>
	);
}
