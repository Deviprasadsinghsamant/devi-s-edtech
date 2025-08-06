import { AuthService } from "../../services/AuthService";

const authService = new AuthService();

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authResolvers = {
  Mutation: {
    register: async (_: any, { input }: { input: RegisterInput }): Promise<any> => {
      return await authService.register(input);
    },
    login: async (_: any, { input }: { input: LoginInput }): Promise<any> => {
      return await authService.login(input);
    },
  },
};
