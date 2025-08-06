import { UserService } from "../../services/UserService";

const userService = new UserService();

export const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }) => {
      return await userService.getUserById(id);
    },

    userByEmail: async (_: any, { email }: { email: string }) => {
      return await userService.getUserByEmail(email);
    },

    userCount: async () => {
      return await userService.getUserCount();
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: { name: string; email: string } }
    ) => {
      return await userService.createUser(input);
    },

    updateUser: async (
      _: any,
      {
        id,
        input,
      }: { id: string; input: Partial<{ name: string; email: string }> }
    ) => {
      return await userService.updateUser(id, input);
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      await userService.deleteUser(id);
      return true;
    },
  },
};
