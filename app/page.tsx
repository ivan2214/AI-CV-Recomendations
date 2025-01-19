import CVComparisonPage from "@/components/CVComparisonPage";
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

	return <>{isLoggedIn ? <CVComparisonPage /> : <LoginHero />}</>;
}
