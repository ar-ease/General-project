import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

interface JWTPayload {
  id: string;
  [key: string]: any;
}

// Define your app types
type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

type Variables = {
  userId: string;
};

export const userRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();

  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "input not correct",
    });
  }
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    // Create JWT with proper payload type
    const payload: JWTPayload = { id: user.id };
    const token = await sign(payload, c.env.JWT_SECRET);

    return c.json({
      message: "User created successfully",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    c.status(500);
    return c.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
userRouter.post("/signin", async (c) => {
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "input not correct",
    });
  }

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    // In production, compare hashed passwords
    if (user.password !== body.password) {
      c.status(401);
      return c.json({ error: "Invalid credentials" });
    }

    // Create JWT with proper payload type
    const payload = { id: user.id };
    const token = await sign(payload, c.env.JWT_SECRET);

    return c.json({
      message: "Login successful",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Signin error:", error);
    c.status(500);
    return c.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
