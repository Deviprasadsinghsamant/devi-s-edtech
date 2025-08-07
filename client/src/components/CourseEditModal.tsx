"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_COURSE } from "@/lib/graphql/mutations";
import { GET_COURSES } from "@/lib/graphql/queries";
import { Course, CourseLevel } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CourseEditModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CourseEditModal: React.FC<CourseEditModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    level: course.level,
  });

  const [updateCourse, { loading, error }] = useMutation(UPDATE_COURSE, {
    refetchQueries: [{ query: GET_COURSES }],
    onCompleted: () => {
      onSuccess?.();
      onClose();
    },
  });

  useEffect(() => {
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
    });
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateCourse({
        variables: {
          id: course.id,
          input: {
            title: formData.title.trim(),
            description: formData.description.trim(),
            level: formData.level,
          },
        },
      });
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Course</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Title
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter course title"
              required
              disabled={loading}
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
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter course description"
              required
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Level Field */}
          <div>
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Level
            </label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) =>
                handleInputChange("level", e.target.value as CourseLevel)
              }
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={CourseLevel.BEGINNER}>Beginner</option>
              <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
              <option value={CourseLevel.ADVANCED}>Advanced</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm">
              Error updating course: {error.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Update Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
