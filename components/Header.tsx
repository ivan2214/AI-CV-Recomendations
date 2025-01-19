import Link from "next/link";
import { Brain } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

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
						<div className="ml-10 hidden space-x-8 lg:block">
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
						</div>
					</div>

					<div className="ml-10 space-x-4">
						<SignedOut>
							<SignInButton mode="modal">
								<Button className="rounded-md border border-transparent bg-blue-500 px-4 py-2 font-medium text-lg text-white transition duration-150 ease-in-out hover:bg-blue-600">
									Iniciar sesión
								</Button>
							</SignInButton>
						</SignedOut>

						<SignedIn>
							<UserButton showName />
						</SignedIn>
					</div>
				</div>
			</nav>
		</header>
	);
}
