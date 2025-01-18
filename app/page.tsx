"use client";

import CVComparison from "@/components/CVComparison";
import Header from "@/components/Header";
import LoginHero from "@/components/LoginHero";
import { useState } from "react";

export default function Home() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
	};

	return (
		<>
			<Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
			{!isLoggedIn ? (
				<main className="mx-auto h-full w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
					<CVComparison />
				</main>
			) : (
				<LoginHero onLogin={handleLogin} />
			)}
		</>
	);
}
