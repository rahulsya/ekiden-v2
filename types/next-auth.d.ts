import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    // user?: Member;
    accessToken?: string;
    expires_at?: number;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT types
   */
  interface JWT extends DefaultJWT {
    // id: string;
    accessToken?: string;
    expires_at?: number;
    refreshToken?: string;
  }
}
