import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../src/db";
import * as schema from "../src/db/schema";

export const auth = betterAuth({
  // Database adapter
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  
  // Email/Password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  basePath: "/api/auth",
  baseURL: process.env.AUTH_URL || "http://localhost:3000",
  
  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  
  // Session
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  // Advanced options
  advanced: {
    cookiePrefix: "my-app",
    crossSubdomainCookies: {
      enabled: true,
      domain: process.env.NODE_ENV === "production" 
        ? ".yourdomain.com" 
        : undefined,
    },
  },
  advanced: { disableOriginCheck: true },
  // Callbacks
  callbacks: {
    async signIn(user, account) {
      console.log(`User ${user.email} signed in with ${account?.provider}`);
      return true;
    },
  },
});

// Export types
export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}