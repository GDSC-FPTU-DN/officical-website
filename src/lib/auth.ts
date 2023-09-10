import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions, Session, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/lib/db';
import { isPasswordValid } from '@lib/hashHelper';
import { ROLE } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await db.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user) return null;

        const isValid = isPasswordValid(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        picture: dbUser.image,
      };
    },
  },
};

export function getSessionServerSide() {
  return getServerSession(authOptions);
}

export function isUserAuthenticated(session: Session | null, exceptRoles: ROLE[] = []) {
  if (!session) return false;
  const user = session.user;

  if (exceptRoles.length) {
    if (exceptRoles.includes(user.role)) return false;
  }

  return true;
}
