"use client";

import { useState } from "react";
import CVUploadForm from "./CVUploadForm";
import CVComparisonViewer from "./CVComparisonViewer";
import SuggestionsList from "./SuggestionsList";

export default function CVComparisonPage() {
	const [oldCV, setOldCV] = useState("");
	const [recomendations, setRecomendations] = useState<string[]>([]);

	const handleUpload = (oldCVUrl: string) => {
		setOldCV(oldCVUrl);
	};

	const handleRecomendations = (recomendations: string[]) => {
		setRecomendations(recomendations);
	};

	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="flex flex-col gap-4">
				<CVUploadForm
					onUpload={handleUpload}
					handleRecomendations={handleRecomendations}
				/>
			</div>
			<div className="grid gap-4">
				<CVComparisonViewer oldCV={oldCV} />
			</div>
			{recomendations.length > 0 && (
				<div className="grid gap-4">
					<SuggestionsList suggestions={recomendations} />
				</div>
			)}
		</div>
	);
}
