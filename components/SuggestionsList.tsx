import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SuggestionsListProps = {
	suggestions: string[];
};

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Sugerencias y Recomendaciones</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{suggestions.map((suggestion) => (
						<li key={suggestion} className="mb-2 list-disc">
							{suggestion}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
