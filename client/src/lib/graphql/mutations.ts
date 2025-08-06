import { gql } from "@apollo/client";

// Authentication Mutations
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
        enrollments {
          id
          role
          course {
            id
            title
            level
          }
        }
      }
      token
      expiresAt
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        enrollments {
          id
          role
          course {
            id
            title
            level
          }
        }
      }
      token
      expiresAt
    }
  }
`;

// Course Mutations
export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      level
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      description
      level
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

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

// Enrollment Mutations
export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($input: EnrollmentInput!) {
    enrollInCourse(input: $input) {
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
        enrollmentCount
        studentCount
        professorCount
      }
    }
  }
`;

export const UNENROLL_FROM_COURSE = gql`
  mutation UnenrollFromCourse($userId: ID!, $courseId: ID!) {
    unenrollFromCourse(userId: $userId, courseId: $courseId)
  }
`;

export const UPDATE_ENROLLMENT_ROLE = gql`
  mutation UpdateEnrollmentRole($id: ID!, $role: UserRole!) {
    updateEnrollmentRole(id: $id, role: $role) {
      id
      role
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

// User Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
