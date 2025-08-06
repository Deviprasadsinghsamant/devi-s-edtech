import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Course, UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { CourseEditModal } from "@/components/CourseEditModal";

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  showProfessorActions?: boolean;
  onViewDetails?: (courseId: string) => void;
  onEditCourse?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showEnrollButton = true,
  showProfessorActions = true,
  onViewDetails,
  onEditCourse,
}) => {
  const { user } = useAuth();
  const { enrollInCourse, loading } = useCourses();
  const { canEnrollInCourse, isProfessorOfCourse, canEditCourse } =
    useRoleAccess();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isEnrolled = course.enrollments?.some(
    (enrollment) => enrollment.user.id === user?.id
  );

  const handleEnroll = async (role: UserRole = UserRole.STUDENT) => {
    if (!user || !canEnrollInCourse(course.id)) return;

    try {
      await enrollInCourse({
        userId: user.id,
        courseId: course.id,
        role: role,
      });
    } catch (error) {
      console.error("Failed to enroll:", error);
    }
  };

  const handleEnrollAsStudent = () => {
    handleEnroll(UserRole.STUDENT);
  };
  
  const handleEnrollAsProfessor = () => {
    handleEnroll(UserRole.PROFESSOR);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.title}
          </h3>
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" size="sm">
              {course.level}
            </Badge>
            {user && (
              <Badge variant="warning" size="sm">
                You: {user.role}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Level: {course.level}</p>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {course.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Level:</span>
            <span className="font-medium">{course.level}</span>
          </div>
          <div className="flex justify-between">
            <span>Students:</span>
            <span className="font-medium">{course.studentCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Professors:</span>
            <span className="font-medium">{course.professorCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Enrolled:</span>
            <span className="font-medium">{course.enrollmentCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span className="font-medium">{formatDate(course.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="space-y-2">
        <div className="flex gap-2 w-full">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(course.id)}
              className="flex-1"
            >
              View Details
            </Button>
          )}



          {/* Student Actions */}
          {!isProfessorOfCourse(course.id) && (
            <>
              {showEnrollButton &&
                !isEnrolled &&
                canEnrollInCourse(course.id) && (
                  <div className="flex gap-2 w-full">
                    <Button
                      size="sm"
                      onClick={handleEnrollAsStudent}
                      loading={loading}
                      className="flex-1"
                      variant="primary"
                    >
                      Enroll as Student
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleEnrollAsProfessor}
                      loading={loading}
                      className="flex-1"
                      variant="secondary"
                    >
                      Enroll as Professor
                    </Button>
                  </div>
                )}

              {isEnrolled && (
                <Badge variant="success" className="flex-1 justify-center">
                  Enrolled
                </Badge>
              )}
            </>
          )}

          {/* Professor Actions */}
          {isProfessorOfCourse(course.id) && showProfessorActions && (
            <div className="flex gap-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (onEditCourse) {
                    onEditCourse(course.id);
                  } else {
                    setIsEditModalOpen(true);
                  }
                }}
                className="flex-1"
              >
                Edit Course
              </Button>
              <Badge
                variant="warning"
                className="flex-1 justify-center text-xs"
              >
                Teaching
              </Badge>
            </div>
          )}
        </div>
      </CardFooter>
      </Card>
      
      {/* Course Edit Modal */}
      <CourseEditModal
        course={course}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          console.log('Course updated successfully!');
        }}
      />
    </>
  );
};
