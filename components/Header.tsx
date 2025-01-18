import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
	return (
		<header className="bg-white shadow-sm">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 justify-between">
					<div className="flex">
						<Link href="/" className="flex flex-shrink-0 items-center">
							<span className="font-bold text-2xl">CV Analyzer</span>
						</Link>
					</div>
					<div className="flex items-center">
						<SignedOut>
							<Button>
								<SignInButton mode="modal">Iniciar sesion</SignInButton>
							</Button>
						</SignedOut>
						<SignedIn>
							<UserButton showName />
						</SignedIn>
					</div>
				</div>
			</div>
		</header>
	);
}
