import { gql } from "apollo-server-express";

export const courseTypeDefs = gql`
  type Course {
    id: ID!
    title: String!
    description: String!
    level: CourseLevel!
    enrollments: [Enrollment!]!
    enrollmentCount: Int!
    professorCount: Int!
    studentCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  enum CourseLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  input CourseFilter {
    level: CourseLevel
    hasEnrollments: Boolean
  }

  input CreateCourseInput {
    title: String!
    description: String!
    level: CourseLevel!
  }

  input UpdateCourseInput {
    title: String
    description: String
    level: CourseLevel
  }

  extend type Query {
    courses(filter: CourseFilter): [Course!]!
    course(id: ID!): Course
    courseCount: Int!
  }

  extend type Mutation {
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;
