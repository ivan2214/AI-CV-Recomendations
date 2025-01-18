import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CVComparisonViewerProps = {
	oldCV: string;
	newCV: string;
};

export default function CVComparisonViewer({
	oldCV,
	newCV,
}: CVComparisonViewerProps) {
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
				<div className="my-4 h-px w-full bg-gray-400" />
				<div className="space-y-2">
					<Badge>CV Generado</Badge>
					{newCV && (
						<iframe src={newCV} title="CV Generado" className="h-72 w-full" />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
