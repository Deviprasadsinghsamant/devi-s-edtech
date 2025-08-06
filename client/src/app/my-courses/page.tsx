"use client";

import React from "react";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/CourseCard";
import { Loading } from "@/components/ui/Loading";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import { UserRole } from "@/types";

export default function MyCourses() {
  const { user } = useAuth();
  const { courses, loading } = useCourses();

  // Get courses the student is enrolled in
  const enrolledCourses = courses.filter((course) =>
    course.enrollments?.some((enrollment) => enrollment.user.id === user?.id)
  );

  return (
    <ProtectedRoute requiredRole={UserRole.STUDENT}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Courses
            </h1>
            <p className="text-gray-600">
              Track your learning progress and access your enrolled courses.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Enrolled Courses
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {enrolledCourses.length}
                </div>
                <p className="text-gray-500 text-sm">Courses you're taking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Learning Levels
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => {
                    const count = enrolledCourses.filter(
                      (course) => course.level === level
                    ).length;
                    return (
                      <div key={level} className="flex justify-between text-sm">
                        <span className="capitalize">
                          {level.toLowerCase()}:
                        </span>
                        <Badge variant="secondary" size="sm">
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Progress
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {enrolledCourses.length > 0 ? "100%" : "0%"}
                </div>
                <p className="text-gray-500 text-sm">
                  {enrolledCourses.length > 0
                    ? "Actively enrolled"
                    : "No enrollments"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enrolled Courses Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Enrolled Courses
              </h2>
              <Badge variant="secondary">
                {enrolledCourses.length} course
                {enrolledCourses.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {loading && <Loading>Loading your courses...</Loading>}

            {!loading && enrolledCourses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Courses Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You haven't enrolled in any courses yet. Browse available
                    courses and start learning!
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Courses
                  </a>
                </CardContent>
              </Card>
            )}

            {!loading && enrolledCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showEnrollButton={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/"
                className="flex items-center p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mr-3">🔍</div>
                <div>
                  <div className="font-medium text-gray-900">
                    Browse Courses
                  </div>
                  <div className="text-sm text-gray-500">
                    Discover new learning opportunities
                  </div>
                </div>
              </a>

              <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
                <div className="text-2xl mr-3">📊</div>
                <div>
                  <div className="font-medium text-gray-900">
                    Track Progress
                  </div>
                  <div className="text-sm text-gray-500">
                    Monitor your learning journey
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
