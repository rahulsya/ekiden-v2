import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    // user?: Member;
    accessToken?: string;
  }
}
