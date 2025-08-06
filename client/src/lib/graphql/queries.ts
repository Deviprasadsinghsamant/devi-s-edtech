import { gql } from "@apollo/client";

// Course Queries
export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      level
      enrollmentCount
      studentCount
      professorCount
      createdAt
      updatedAt
      enrollments {
        id
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const GET_COURSE_BY_ID = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      title
      description
      level
      enrollmentCount
      studentCount
      professorCount
      createdAt
      updatedAt
      enrollments {
        id
        role
        enrolledAt
        user {
          id
          name
          email
        }
      }
    }
  }
`;

// User Queries
export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      createdAt
      updatedAt
      enrollments {
        id
        role
        enrolledAt
        course {
          id
          title
          description
          level
        }
      }
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      name
      email
      createdAt
      updatedAt
      enrollments {
        id
        role
        enrolledAt
        course {
          id
          title
          description
          level
        }
      }
    }
  }
`;

// Enrollment Queries
export const GET_USER_ENROLLMENTS = gql`
  query GetUserEnrollments($userId: ID!) {
    userEnrollments(userId: $userId) {
      id
      role
      enrolledAt
      course {
        id
        title
        description
        level
        enrollmentCount
      }
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_COURSE_ENROLLMENTS = gql`
  query GetCourseEnrollments($courseId: ID!) {
    courseEnrollments(courseId: $courseId) {
      id
      role
      enrolledAt
      user {
        id
        name
        email
      }
      course {
        id
        title
        description
        level
      }
    }
  }
`;

// Stats Queries
export const GET_COURSE_COUNT = gql`
  query GetCourseCount {
    courseCount
  }
`;

export const GET_USER_COUNT = gql`
  query GetUserCount {
    userCount
  }
`;
