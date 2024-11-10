import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    const client = await clientPromise
    const db = client.db("travel_planner")
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error during signup:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}