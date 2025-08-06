import { gql } from "apollo-server-express";

export const authTypeDefs = gql`
  type AuthPayload {
    user: User!
    token: String!
    expiresAt: String!
  }

  extend type Mutation {
    login(email: String!): AuthPayload!
  }
`;
