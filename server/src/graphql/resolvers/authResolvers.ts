import { AuthService } from "../../services/AuthService";

const authService = new AuthService();

export const authResolvers = {
  Mutation: {
    login: async (_: any, { email }: { email: string }): Promise<any> => {
      return await authService.mockLogin(email);
    },
  },
};
