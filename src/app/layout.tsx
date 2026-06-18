import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import './globals.css';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Photo Gallery & Portfolio',
	description:
		'A curated collection of photographs and creative works showcasing a personal portfolio.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem={false}
					disableTransitionOnChange
				>
					{/* Navigation Header */}
					<header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
						<div className="container mx-auto px-4 py-4">
							<div className="flex items-center justify-between">
								<Link
									href="/"
									className="flex items-center gap-2"
								>
									<Camera className="h-8 w-8 text-blue-600" />
									<h1 className="text-2xl font-bold text-slate-900 dark:text-white">
										Portfolio Gallery
									</h1>
								</Link>
								<div className="flex gap-2 items-center justify-center">
									<nav className="flex items-center gap-6">
										<Link
											href="/gallery"
											className="nav-link"
										>
											Gallery
										</Link>
										<Link
											href="/upload"
											className="nav-link"
										>
											Upload
										</Link>
										<Link
											href="/admin"
											className="btn-primary"
										>
											Admin
										</Link>
									</nav>
									<ThemeToggle />
								</div>
							</div>
						</div>
					</header>
					{children}
				</ThemeProvider>
				{/* REPLACE THIS COMMENT */}
			</body>
		</html>
	);
}
