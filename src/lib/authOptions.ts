import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "atakumbel55@gmail.com" &&
          credentials?.password === "atakum55"
        ) {
          return { id: "1", name: "Admin", email: "atakumbel55@gmail.com", role: "admin" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object" && "role" in user) {
        return { ...token, role: (user as { role?: string }).role };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-expect-error: user objesine role ekleniyor, NextAuth tipi izin vermiyor ama runtime'da sorun yok.
        session.user = { ...session.user, role: (token as { role?: string }).role };
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
}; 