import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="flex items-center">
      <span className="block font-medium text-theme-sm text-gray-700 dark:text-gray-400">
        {user?.email || 'Usuario'}
      </span>
    </div>
  );
} 