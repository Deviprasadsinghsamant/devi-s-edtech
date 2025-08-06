"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { CourseLevel, UserRole } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_COURSE, DELETE_COURSE } from "@/lib/graphql/mutations";
import { GET_COURSE_BY_ID } from "@/lib/graphql/queries";

interface UpdateCourseForm {
  title: string;
  description: string;
  level: CourseLevel;
}

export default function EditCourse() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { user } = useAuth();
  const { fetchCourses } = useCourses();
  const { canEditCourse, canDeleteCourse } = useRoleAccess();

  const [formData, setFormData] = useState<UpdateCourseForm>({
    title: "",
    description: "",
    level: CourseLevel.BEGINNER,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery(GET_COURSE_BY_ID, {
    variables: { id: courseId },
    skip: !courseId,
  });

  const [updateCourseMutation, { loading: updateLoading }] =
    useMutation(UPDATE_COURSE);
  const [deleteCourseMutation, { loading: deleteLoading }] =
    useMutation(DELETE_COURSE);

  // Check if user can edit this course
  const canEdit = canEditCourse(courseId);
  const canDelete = canDeleteCourse(courseId);

  useEffect(() => {
    if (courseData?.course) {
      const course = courseData.course;
      setFormData({
        title: course.title,
        description: course.description,
        level: course.level,
      });
    }
  }, [courseData]);

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

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    try {
      await updateCourseMutation({
        variables: {
          id: courseId,
          input: formData,
        },
      });

      await fetchCourses();
      router.push("/professor");
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!canDelete) return;

    try {
      await deleteCourseMutation({
        variables: { id: courseId },
      });

      await fetchCourses();
      router.push("/professor");
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  if (courseLoading) {
    return (
      <ProtectedRoute requiredRole={UserRole.PROFESSOR}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loading>Loading course details...</Loading>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (courseError || !courseData?.course) {
    return (
      <ProtectedRoute requiredRole={UserRole.PROFESSOR}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Course Not Found
                </h2>
                <p className="text-gray-600 mb-4">
                  The course you're looking for doesn't exist or you don't have
                  permission to edit it.
                </p>
                <Button onClick={() => router.push("/professor")}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const course = courseData.course;

  return (
    <ProtectedRoute requiredRole={UserRole.PROFESSOR}>
      <RoleGuard allowedRoles={[UserRole.PROFESSOR]} courseId={courseId}>
        <div className="min-h-screen bg-gray-50">
          <Header />

          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Edit Course
                  </h1>
                  <p className="text-gray-600">
                    Update course information and manage enrollment
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/professor")}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>

            {/* Course Info Card */}
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Information
                </h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateCourse} className="space-y-4">
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
                      rows={4}
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

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={updateLoading || !canEdit}>
                      {updateLoading ? "Updating..." : "Update Course"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.push("/professor")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Statistics
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {course.studentCount}
                    </div>
                    <div className="text-sm text-gray-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {course.enrollmentCount}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Enrollments
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">Created</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            {canDelete && (
              <Card className="border-red-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-red-900">
                    Danger Zone
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Delete Course
                      </h4>
                      <p className="text-sm text-gray-600">
                        Permanently delete this course and all enrollment data.
                        This action cannot be undone.
                      </p>
                    </div>
                    {!showDeleteConfirm ? (
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete Course
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleDeleteCourse}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "Deleting..." : "Confirm Delete"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
