'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Prevent Hydration Mismatch
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="p-2 h-9 w-9" />; // Placeholder to prevent layout shift
	}

	return (
		<button
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
		>
			{theme === 'dark' ? (
				<Sun className="h-[1.2rem] w-[1.2rem] text-white" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem] text-blue-700 " />
			)}
			<span className="sr-only">Toggle theme</span>
		</button>
	);
}
