import { AuthContext } from '@/utils/contexts/authContexts';
import { useContext } from 'react';

export default function useAuth() {
	return useContext(AuthContext);
}
