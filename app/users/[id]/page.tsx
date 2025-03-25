'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserCircle2, Mail, ArrowLeft, Calendar  } from 'lucide-react';

type UserDetails = {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  // Add more fields as needed
};

const UserDetailsPage = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = params.id;
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError('Unable to load user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <UserCircle2 className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <p className="mt-4 text-red-600">{error || 'User not found'}</p>
          <button 
            onClick={() => router.push('/users')} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
          <button 
            onClick={() => router.push('/users')}
            className="text-white hover:bg-blue-700 p-2 rounded-full mb-4 transition duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col items-center">
            <UserCircle2 className="h-24 w-24 text-white mb-4" />
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-4">
            <Mail className="h-6 w-6 text-gray-500" />
            <div>
              <p className="text-gray-600">Email</p>
              <p className="text-xl font-semibold">{user.email}</p>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-center space-x-4">
              <Calendar className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-gray-600">Joined</p>
                <p className="text-xl font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;