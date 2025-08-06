import { gql } from "apollo-server-express";

export const enrollmentTypeDefs = gql`
  type Enrollment {
    id: ID!
    user: User!
    course: Course!
    role: UserRole!
    enrolledAt: String!
  }

  enum UserRole {
    STUDENT
    PROFESSOR
  }

  input EnrollmentInput {
    userId: ID!
    courseId: ID!
    role: UserRole!
  }

  extend type Query {
    userEnrollments(userId: ID!): [Enrollment!]!
    courseEnrollments(courseId: ID!): [Enrollment!]!
  }

  extend type Mutation {
    enrollInCourse(input: EnrollmentInput!): Enrollment!
    unenrollFromCourse(userId: ID!, courseId: ID!): Boolean!
    updateEnrollmentRole(id: ID!, role: UserRole!): Enrollment!
  }
`;
