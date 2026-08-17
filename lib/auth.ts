import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export type Role = 'ADMIN' | 'ANALYST' | 'VIEWER';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@acme.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { workspace: true },
        });

        if (!user) {
          throw new Error('Invalid email or password.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
          workspaceId: user.workspaceId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as SessionUser).role;
        token.workspaceId = (user as unknown as SessionUser).workspaceId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).id = token.id as string;
        (session.user as SessionUser).role = token.role as Role;
        (session.user as SessionUser).workspaceId = token.workspaceId as string;
      }
      return session;
    },
  },
};

export async function getAuthSession(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as SessionUser;
}

export async function requireAuth(): Promise<{ sessionUser: SessionUser; errorResponse?: NextResponse }> {
  const sessionUser = await getAuthSession();
  if (!sessionUser) {
    return {
      sessionUser: null as unknown as SessionUser,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to access this resource.' },
        { status: 401 }
      ),
    };
  }
  return { sessionUser };
}

export async function requireRole(allowedRoles: Role[]): Promise<{ sessionUser: SessionUser; errorResponse?: NextResponse }> {
  const { sessionUser, errorResponse: authError } = await requireAuth();
  if (authError) return { sessionUser: null as unknown as SessionUser, errorResponse: authError };

  if (!allowedRoles.includes(sessionUser.role)) {
    return {
      sessionUser,
      errorResponse: NextResponse.json(
        {
          error: 'Forbidden',
          message: `Forbidden: User role '${sessionUser.role}' lacks permission. Required: [${allowedRoles.join(', ')}]`,
        },
        { status: 403 }
      ),
    };
  }

  return { sessionUser };
}
