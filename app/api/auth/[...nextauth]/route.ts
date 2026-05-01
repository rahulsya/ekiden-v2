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
      console.log("account", account);
      return true;
    },
    async jwt({ token, account }) {
      // Store the access token in the JWT so it can be used for API requests
      console.log("account jwt", account);
      if (account) {
        token.user = account.athlete;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the access token to the client-side session
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
