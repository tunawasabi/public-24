import NextAuth, { NextAuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.OAUTH_CLIENTID!,
            clientSecret: process.env.OAUTH_SECRET!,
            profile(profile) {
                return {
                    id: profile.id,
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // ワシしかログインできないようにする
            return user.id == '807572778148298792';
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            session.user.id = token.id;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token;
        },
    },
}

export default NextAuth(authOptions)

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
    }
}
