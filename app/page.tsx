import CVComparisonPage from "@/components/CVComparisonPage";

export const metadata = {
	robots: {
		index: true,
		follow: true,
	},
};

export default function Home() {
	return <CVComparisonPage />;
}
