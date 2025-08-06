import { userResolvers } from "./userResolvers";
import { courseResolvers } from "./courseResolvers";
import { enrollmentResolvers } from "./enrollmentResolvers";
import { authResolvers } from "./authResolvers";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

// Simple DateTime scalar
const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime custom scalar type",
  serialize(value: any) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers: any = {
  DateTime: DateTimeScalar,

  Query: {
    ...userResolvers.Query,
    ...courseResolvers.Query,
    ...enrollmentResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...enrollmentResolvers.Mutation,
    ...authResolvers.Mutation,
  },

  Course: {
    ...courseResolvers.Course,
  },
};
