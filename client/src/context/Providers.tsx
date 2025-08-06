"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/graphql/client";
import { AuthProvider } from "./AuthContext";
import { CourseProvider } from "./CourseContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <CourseProvider>{children}</CourseProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};
