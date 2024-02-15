import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import { postLogin } from "services/auth";
import { responseLoginType } from "types/auth.type";
import jwtDecode from "jwt-decode";

interface User {
  id: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "username", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, req) {
        if (credentials) {
          const res = await postLogin({ username: credentials?.username, password: credentials?.password }) as responseLoginType;
          if (res.success && res) {
            const user: User = jwtDecode(res.results.token);
            return { ...user, token: res.results.token };
          } else {
            return null
          };
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
