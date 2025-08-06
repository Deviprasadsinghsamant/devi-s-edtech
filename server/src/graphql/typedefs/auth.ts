import { gql } from "apollo-server-express";

export const authTypeDefs = gql`
  type AuthPayload {
    user: User!
    token: String!
    expiresAt: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;
