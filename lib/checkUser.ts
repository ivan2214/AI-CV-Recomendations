import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export const checkUser = async () => {
	const user = await currentUser();

	// Check for current logged in clerck user
	if (!user) {
		return null;
	}

	// Check if the user is already in the database
	const loggedInUser = await prisma.user.findUnique({
		where: {
			clerkUserId: user.id,
		},
	});

	// If user is in database, return the user
	if (loggedInUser) {
		return loggedInUser;
	}

	// If not in database, create new user
	const newUser = await prisma.user.create({
		data: {
			clerkUserId: user.id,
			name: `${user.firstName} ${user.lastName}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,
		},
	});

	return newUser;
};
