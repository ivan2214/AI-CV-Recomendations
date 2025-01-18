"use client";

import { useState } from "react";
import CVUploadForm from "./CVUploadForm";
import CVComparisonViewer from "./CVComparisonViewer";
import SuggestionsList from "./SuggestionsList";

export default function CVComparisonPage() {
	const [oldCV, setOldCV] = useState("");
	const [newCV, setNewCV] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const handleUpload = (
		oldCVUrl: string,
		newCVUrl: string,
		newSuggestions: string[],
	) => {
		setOldCV(oldCVUrl);
		setNewCV(newCVUrl);
		setSuggestions(newSuggestions);
	};

	return (
		<div className="grid grid-cols-2 gap-4">
			<CVUploadForm onUpload={handleUpload} />
			<div className="grid gap-4">
				<CVComparisonViewer oldCV={oldCV} newCV={newCV} />
				<SuggestionsList suggestions={suggestions} />
			</div>
		</div>
	);
}
