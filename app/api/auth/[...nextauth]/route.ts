import { stravaService } from "@/services/strava";
import NextAuth, { AuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";

export const authOptions: AuthOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "activity:read_all",
          // redirect_uri: "http://localhost:3000",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // console.log("account", account);
      return true;
    },
    async jwt({ token, account }) {
      // Store the access token in the JWT so it can be used for API requests

      if (account) {
        token.user = account.athlete;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires_at = account.expires_at;
        token.error = null;
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (token.expires_at && token.expires_at < currentTime) {
        const data = await stravaService.refreshToken(token.refreshToken!);
        if (data) {
          token.accessToken = data.access_token;
          token.refreshToken = data.refresh_token;
          token.expires_at = data.expires_at;
          token.error = null;
        } else {
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Pass the access token to the client-side session
      // console.log("token", token);
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
