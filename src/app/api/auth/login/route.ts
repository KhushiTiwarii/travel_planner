import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const client = await clientPromise
    const db = client.db("travel_planner")
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )
    // console.log(token);
    
    const response = NextResponse.json({
      message:"Logged in success",
      success:true,
  })

  response.cookies.set("token",token,{
      httpOnly:true, //matlab in cookie ko ab sirf server manipulate kar skta h
      // expires: new Date(Date.now()+1*60*1000)
  })

  return response;
    
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}