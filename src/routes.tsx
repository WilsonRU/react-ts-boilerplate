import type { ReactNode } from 'react';
import {
	Route,
	useLocation,
	Routes as Routing,
	Navigate,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/utils/contexts/authContexts';
import { ShieldWarningIcon } from '@phosphor-icons/react';
import useAuth from '@/utils/hooks/useAuth';

// Modules
import { ForgotPassword, Signin, Signup } from '@/modules/core';

interface GuardProps {
	children: ReactNode;
}

export default function Routes() {
	const location = useLocation();

	const Guard: React.FC<GuardProps> = ({ children }) => {
		const { authenticated } = useAuth() as {
			authenticated: boolean;
		};

		if (!authenticated) {
			return <Navigate to={'signin'} />;
		}
		return <>{children}</>;
	};

	return (
		<AuthProvider>
			<AnimatePresence mode="wait">
				<Routing key={location.pathname} location={location}>
					<Route index element={<Signin />} />

					<Route path="/login" element={<Signin />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />

					<Route
						path="*"
						element={
							<div className="flex flex-col gap-2 items-center justify-center h-screen">
								<ShieldWarningIcon size={36} />
								<span className="text-bold uppercase">No content found</span>
							</div>
						}
					/>
				</Routing>
			</AnimatePresence>
		</AuthProvider>
	);
}
