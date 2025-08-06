import { gql } from "apollo-server-express";
import { userTypeDefs } from "./user";
import { courseTypeDefs } from "./course";
import { enrollmentTypeDefs } from "./enrollment";
import { authTypeDefs } from "./auth";

const baseTypeDefs = gql`
  scalar DateTime

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  courseTypeDefs,
  enrollmentTypeDefs,
  authTypeDefs,
];
