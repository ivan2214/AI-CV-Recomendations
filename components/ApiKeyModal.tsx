"use client";

import { saveApiKey } from "@/actions/saveApiKey";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ApiKeyModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
	const [apiKey, setApiKey] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (apiKey) {
			await saveApiKey(apiKey);
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-gray-800 text-white sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Enter your API Key</DialogTitle>
					<DialogDescription>
						We need your API key to process CV and job descriptions. It will be
						encrypted and stored securely.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						type="password"
						placeholder="Enter your API key"
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						className="border-gray-600 bg-gray-700 text-white"
					/>
					<Button type="submit" className="w-full">
						Save API Key
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
