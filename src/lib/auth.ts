import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
    accessToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    accessToken?: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const client = await clientPromise
        const db = client.db("travel_planner")
        const user = await db.collection("users").findOne({ email: credentials.email })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        )

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          token
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.accessToken = token.accessToken
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  }
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
  } catch {
    return null
  }
}