import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('[Debug] Authorize called');
        const parsedCredentials = z
          .object({ password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { password } = parsedCredentials.data;
          const envPassword = process.env.ADMIN_PASSWORD;

          console.log(`[Debug] Input password: ${password}`);
          console.log(`[Debug] Env password: ${envPassword}`);

          if (password === envPassword) {
            console.log('[Debug] Password match!');
            return { id: '1', name: 'Admin', email: 'admin@example.com' };
          } else {
            console.log('[Debug] Password mismatch');
          }
        } else {
            console.log('[Debug] Zod parsing failed');
        }
        return null;
      },
    }),
  ],
});
