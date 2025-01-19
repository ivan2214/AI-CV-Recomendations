import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CVComparisonViewerProps = {
	oldCV: string;
};

export default function CVComparisonViewer({ oldCV }: CVComparisonViewerProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Comparación de CV</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Badge>CV Original</Badge>
					{oldCV && (
						<iframe src={oldCV} title="CV Original" className="h-72 w-full" />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
