"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import { CourseLevel, UserRole } from "@/types";

export default function HomePage() {
  const { user, register, login, isAuthenticated } = useAuth();
  const { courses, loading, error, fetchCourses } = useCourses();
  const [levelFilter, setLevelFilter] = useState<CourseLevel | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
    }
  }, [isAuthenticated, fetchCourses]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) return;
    if (!isLoginMode && !formData.name.trim()) return;

    setAuthLoading(true);
    try {
      if (isLoginMode) {
        await login({ email: formData.email.trim(), password: formData.password });
      } else {
        await register({ 
          name: formData.name.trim(), 
          email: formData.email.trim(), 
          password: formData.password 
        });
      }
    } catch (error) {
      console.error(`${isLoginMode ? 'Login' : 'Registration'} failed:`, error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const filteredCourses = courses.filter((course) => {
    const matchesLevel = !levelFilter || course.level === levelFilter;
    const matchesSearch =
      !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesLevel && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto pt-20 px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Welcome to Devi's EdTech Platform
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Please log in to access courses and learning materials.
            </p>

            <div className="mb-4">
              <div className="flex justify-center space-x-1">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isLoginMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    !isLoginMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLoginMode && (
                <Input
                  type="text"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              )}
              <Input
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              <Input
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <Button
                type="submit"
                className="w-full"
                loading={authLoading}
                disabled={!formData.email.trim() || !formData.password.trim() || (!isLoginMode && !formData.name.trim())}
              >
                {isLoginMode ? 'Login' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-sm text-gray-500 text-center">
              <p className="mb-2">Demo accounts:</p>
              <div className="space-y-1">
                <p>Student: john@example.com</p>
                <p>Professor: jane@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Courses
          </h1>
          <p className="text-gray-600">
            Discover and enroll in courses that match your learning goals.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={levelFilter === "" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setLevelFilter("")}
            >
              All Levels
            </Button>
            {Object.values(CourseLevel).map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? "primary" : "ghost"}
                size="sm"
                onClick={() => setLevelFilter(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <Badge variant="secondary">Total Courses: {courses.length}</Badge>
          <Badge variant="secondary">Filtered: {filteredCourses.length}</Badge>
          {user?.role === UserRole.STUDENT && (
            <Badge variant="success">
              My Enrollments: {user.enrollments?.length || 0}
            </Badge>
          )}
        </div>

        {/* Loading State */}
        {loading && <Loading>Loading courses...</Loading>}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchCourses()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showEnrollButton={true}
                    showProfessorActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No courses found matching your criteria.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("");
                    setLevelFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
