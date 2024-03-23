import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth";
import type { DecodedJWT, JWT, RefreshedToken, Token } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import {jwtDecode} from "jwt-decode";
import Url from "@/components/api-configue";



async function refreshAccessToken(token: JWT): Promise<JWT | null> {
  try {
    const res = await fetch(
      `${Url}/token/refresh/`,
      {
        method: "POST",
        body: JSON.stringify({ refresh: token.refresh }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const refreshedToken: RefreshedToken = await res.json();
    if (res.status !== 200) throw refreshedToken;
    const { exp }: DecodedJWT = jwtDecode(refreshedToken.access);

    return {
      ...token,
      ...refreshedToken,
      exp,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {

  pages: {
    signIn: '/login',
  },
  session: { strategy: "jwt" },
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Django Rest Framework",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Username",
          type: "username",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${Url}/token/`,
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            }
          );
          const token: Token = await res.json();

          if (res.status !== 200) throw token;

          const {
            username,
            email,
            user_id,
            exp,
            is_superuser,
            is_staff,
          }: DecodedJWT = jwtDecode(token.access);

          return {
            ...token,
            exp,
            user: {
              username,
              email,
              user_id,
              is_staff,
              is_superuser,
            },
          } as User;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
     async signIn({ user, account, profile, email, credentials } : any)
      {
      if(user?.error) {
         throw new Error('custom error to the client')
      }
      return true
   },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)){
        return Promise.resolve(url)
      }else return Promise.resolve(baseUrl)
    },
    async jwt({ token, user, account }) {
      // initial signin
      if (user && account) {
        return user as JWT;
      }

      // Return previous token if the access token has not expired
      if (Date.now() < token.exp * 100) {
        return token;
      }

      // refresh token
      return (await refreshAccessToken(token)) as JWT;
    },
    async session({ session, token } : any) {
      session.access = token.access;
      session.exp = token.exp;
      session.refresh = token.refresh;
      session.refresh = token.access;
      session.user = token.user;
      session.username = token.username;
      session.office = token.office;
      session.rank = token.rank;
      session.department = token.department;
      session.full_name = token.full_name;
      session.perm_tuple = token.perm_tuple;
      return session;
    },
  },
};

export default NextAuth(authOptions);