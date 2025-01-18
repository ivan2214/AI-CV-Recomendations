import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginHero({ onLogin }: { onLogin: () => void }) {
	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
					Inicia sesión en tu cuenta
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
					<form
						className="space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							onLogin();
						}}
					>
						<div>
							<label
								htmlFor="email"
								className="block font-medium text-gray-700 text-sm"
							>
								Correo electrónico
							</label>
							<div className="mt-1">
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block font-medium text-gray-700 text-sm"
							>
								Contraseña
							</label>
							<div className="mt-1">
								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
								/>
							</div>
						</div>

						<div>
							<Button type="submit" className="w-full">
								Iniciar sesión
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
