import type { ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="flex flex-col justify-center items-center min-h-screen">
			{children}
		</div>
	);
}
