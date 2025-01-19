import { Brain } from "lucide-react";
import Link from "next/link";

export function Header() {
	return (
		<header className="bg-gradient-to-r from-purple-800 to-blue-700 shadow-lg">
			<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
				<div className="flex w-full items-center justify-between py-6">
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<Brain className="h-10 w-10 text-white" />
							<span className="ml-3 font-bold text-2xl text-white">
								AI CV Recomendations
							</span>
						</Link>
						{/* 	<div className="ml-10 hidden space-x-8 lg:block">
							<Link
								href="/"
								className="font-medium text-base text-gray-300 hover:text-white"
							>
								Home
							</Link>
							<Link
								href="/about"
								className="font-medium text-base text-gray-300 hover:text-white"
							>
								About
							</Link>
						</div> */}
					</div>
				</div>
			</nav>
		</header>
	);
}
