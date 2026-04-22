import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [

    Credentials({
      // Credentials provider for easy development
      name: 'Development Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (user && user.password) {
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log('--- Middleware Check ---', { isLoggedIn, pathname: nextUrl.pathname });
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error: Role exists in our schema
        token.role = user.role;
        // @ts-expect-error: id exists in our schema
        token.id = user.id;

        // Ký một token riêng cho Backend (NestJS) verify
        // Sử dụng AUTH_SECRET chung giữa FE và BE
        const jwt = await import('jsonwebtoken');
        token.accessToken = jwt.sign(
          {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          process.env.AUTH_SECRET || 'fallback_secret',
          { expiresIn: '30d' }
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // @ts-expect-error: Role is custom
        session.user.role = token.role;
        // @ts-expect-error: id is custom
        session.user.id = token.id;
        // @ts-expect-error: accessToken is custom
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
});
