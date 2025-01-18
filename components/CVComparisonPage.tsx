"use client";

import { useState } from "react";
import CVUploadForm from "./CVUploadForm";
import CVComparisonViewer from "./CVComparisonViewer";

export default function CVComparisonPage() {
	const [oldCV, setOldCV] = useState("");
	const [newCV, setNewCV] = useState("");

	const handleUpload = (oldCVUrl: string) => {
		setOldCV(oldCVUrl);
	};

	const handleNewCVUpload = (newCVUrl: string) => {
		setNewCV(newCVUrl);
	};

	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="flex flex-col gap-4">
				<CVUploadForm
					onUpload={handleUpload}
					handleNewCVUpload={handleNewCVUpload}
				/>
			</div>
			<div className="grid gap-4">
				<CVComparisonViewer oldCV={oldCV} newCV={newCV} />
			</div>
		</div>
	);
}
