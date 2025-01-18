"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Header({
	isLoggedIn,
	onLogout,
}: { isLoggedIn: boolean; onLogout: () => void }) {
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
						{isLoggedIn ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-8 w-8 rounded-full"
									>
										<Avatar className="h-8 w-8">
											<AvatarImage
												src="/placeholder-avatar.jpg"
												alt="User avatar"
											/>
											<AvatarFallback>U</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>Perfil</DropdownMenuItem>
									<DropdownMenuItem>Configuración</DropdownMenuItem>
									<DropdownMenuItem onClick={onLogout}>
										Cerrar sesión
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button>Iniciar sesión</Button>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
