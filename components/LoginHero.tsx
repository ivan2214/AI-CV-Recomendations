import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton } from "@clerk/nextjs";

export default function LoginHero() {
	return (
		<div className="flex h-1/2 items-center justify-center py-20">
			<div className="flex flex-col items-center justify-center space-y-2 shadow-sm">
				<h1 className="font-bold text-4xl">Bienvenido a CV Analyzer</h1>
				<p className="mt-4 text-lg">
					Analiza y compara tus curriculums de manera fácil y rápida
				</p>
				<SignedOut>
					<Button>
						<SignInButton mode="modal">Iniciar sesion</SignInButton>
					</Button>
				</SignedOut>
			</div>
		</div>
	);
}
