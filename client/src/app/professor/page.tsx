"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { UserRole, CourseLevel } from "@/types";
import { useMutation } from "@apollo/client";
import { CREATE_COURSE } from "@/lib/graphql/mutations";

interface CreateCourseForm {
  title: string;
  description: string;
  level: CourseLevel;
}

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const { courses, loading, fetchCourses } = useCourses();
  const { canCreateCourse, isProfessorOfCourse } = useRoleAccess();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateCourseForm>({
    title: "",
    description: "",
    level: CourseLevel.BEGINNER,
  });

  const [createCourseMutation, { loading: createLoading }] =
    useMutation(CREATE_COURSE);

  // Filter courses where user is a professor
  const professorCourses = courses.filter((course) =>
    isProfessorOfCourse(course.id)
  );

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateCourse()) return;

    try {
      await createCourseMutation({
        variables: {
          input: formData,
        },
      });

      // Reset form and refresh courses
      setFormData({
        title: "",
        description: "",
        level: CourseLevel.BEGINNER,
      });
      setShowCreateForm(false);
      await fetchCourses();
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ProtectedRoute requiredRole={UserRole.PROFESSOR}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professor Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Manage your courses and track student
              progress.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  My Courses
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {professorCourses.length}
                </div>
                <p className="text-gray-500 text-sm">Courses you teach</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Students
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {professorCourses.reduce(
                    (acc, course) => acc + course.studentCount,
                    0
                  )}
                </div>
                <p className="text-gray-500 text-sm">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Enrollments
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {professorCourses.reduce(
                    (acc, course) => acc + course.enrollmentCount,
                    0
                  )}
                </div>
                <p className="text-gray-500 text-sm">Including professors</p>
              </CardContent>
            </Card>
          </div>

          {/* Create Course Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Management
              </h2>
              {canCreateCourse() && (
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  variant={showCreateForm ? "ghost" : "primary"}
                >
                  {showCreateForm ? "Cancel" : "Create New Course"}
                </Button>
              )}
            </div>

            {showCreateForm && (
              <Card className="mb-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Create New Course
                  </h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Course Title
                      </label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter course title"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter course description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="level"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Course Level
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value={CourseLevel.BEGINNER}>Beginner</option>
                        <option value={CourseLevel.INTERMEDIATE}>
                          Intermediate
                        </option>
                        <option value={CourseLevel.ADVANCED}>Advanced</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={createLoading}>
                        {createLoading ? "Creating..." : "Create Course"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* My Courses Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              My Courses
            </h2>

            {loading && <Loading>Loading your courses...</Loading>}

            {!loading && professorCourses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">
                    You haven't created any courses yet.
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            )}

            {!loading && professorCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professorCourses.map((course) => (
                  <Card key={course.id} className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {course.title}
                        </h3>
                        <Badge variant="secondary" size="sm">
                          {course.level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                        {course.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Students:</span>
                          <span className="font-medium">
                            {course.studentCount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Enrollments:</span>
                          <span className="font-medium">
                            {course.enrollmentCount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Created:</span>
                          <span className="font-medium">Jan 15, 2024</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            (window.location.href = `/course/${course.id}/edit`)
                          }
                        >
                          Edit Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
