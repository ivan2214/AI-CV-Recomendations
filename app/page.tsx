import CVComparisonPage from "@/components/CVComparisonPage";
import Header from "@/components/Header";
import LoginHero from "@/components/LoginHero";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
	// Get the userId from auth() -- if null, the user is not signed in
	const { userId } = await auth();

	if (userId) {
		// Query DB for user specific information or display assets only to signed in users
	}

	// Get the Backend API User object when you need access to the user's information
	const user = await currentUser();
	// Use `user` to render user details or create UI elements
	const isLoggedIn = !!user;

	return (
		<>
			<Header />
			{isLoggedIn ? (
				<main className="mx-auto h-full w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
					<CVComparisonPage />
				</main>
			) : (
				<LoginHero />
			)}
		</>
	);
}
