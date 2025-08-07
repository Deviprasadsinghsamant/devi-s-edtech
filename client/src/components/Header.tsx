import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-semibold text-gray-900 hover:text-blue-600"
            >
              Devi's EdTech Platform
            </Link>

            {isAuthenticated && (
              <nav className="flex space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Courses
                </Link>

                {user?.role === UserRole.PROFESSOR && (
                  <Link
                    href="/professor"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                {user?.role === UserRole.STUDENT && (
                  <Link
                    href="/my-courses"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Courses
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="text-sm text-gray-700">Not authenticated</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
