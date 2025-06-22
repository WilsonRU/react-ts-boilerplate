import { type ReactNode, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpClient } from '@/utils/lib/httpClient';
import toast from 'react-hot-toast';

interface AuthProviderProps {
	children: ReactNode;
}

interface Account {
	id: number;
	email: string;
	name: string;
	birthdate: Date;
	phone: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

interface AuthContextType {
	authenticated: boolean;
	user: Account;
	signin: (email: string, password: string) => void;
	signup: (
		email: string,
		password: string,
		name: string,
		birthdate: string,
	) => void;
	forgotPassword: (email: string) => void;
	logout: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const client = new HttpClient();
	const navigate = useNavigate();
	const user = sessionStorage.getItem('account')
		? JSON.parse(sessionStorage.getItem('account') as string)
		: null;

	const signin = async (email: string, password: string) => {
		await client
			.post('core/login', { email, password })
			.then((response) => {
				sessionStorage.setItem('token', response.data.token);
				sessionStorage.setItem('account', JSON.stringify(response.data.user));

				navigate('/dashboard');
			})
			.catch(async (err) => {
				const httpErr = await err.response.json();
				toast.error(httpErr);
			});
	};

	const signup = async (
		email: string,
		password: string,
		name: string,
		birthdate: string,
	) => {
		await client
			.post('core/signup', { email, password, name, birthdate })
			.then((response) => {
				toast.success(response.data.message);
				navigate('/signin');
			})
			.catch(async (err) => {
				const httpErr = await err.response.json();
				toast.error(httpErr);
			});
	};

	const forgotPassword = async (email: string) => {
		await client
			.post('core/forgot-password', { email })
			.then((response) => {
				toast(response.data.message);
				navigate('/');
			})
			.catch(async (err) => {
				const httpErr = await err.response.json();
				toast.error(httpErr);
			});
	};

	const logout = () => {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('account');

		navigate('/signin');
	};

	return (
		<AuthContext.Provider
			value={{
				authenticated: Boolean(user),
				user,
				signin,
				signup,
				forgotPassword,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
