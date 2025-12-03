import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { validateCredentials } from './index';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Attempting authentication for user:', credentials?.username);

          if (!credentials?.username || !credentials?.password) {
            console.log('❌ Missing credentials');
            return null;
          }

          const user = await validateCredentials(credentials.username, credentials.password);

          if (user) {
            console.log('✅ Authentication successful for user:', user.username);
            return {
              id: user.id.toString(),
              name: user.username,
              email: user.username,
            };
          }

          console.log('❌ Invalid credentials');
          return null;
        } catch (error) {
          console.error('❌ Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
