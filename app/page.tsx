// app/page.tsx
"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-xl p-8 text-center transform transition-all hover:scale-105 hover:shadow-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Streamline your user administration with our intuitive platform.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-700 italic">
            Manage users efficiently and effectively
          </p>
        </div>

        <Link
          href="/users"
          className="inline-flex items-center justify-center w-full py-3 px-6 
                     bg-blue-500 text-white font-semibold rounded-lg 
                     hover:bg-blue-600 transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to User Management
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
