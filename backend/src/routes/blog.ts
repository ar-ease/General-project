import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { isJSDocClassTag } from "typescript";
import { getPrismaClient } from "@prisma/client/runtime/react-native.js";

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

export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.status(401);
    return c.json({ error: "Authentication token required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    // Explicitly type the payload
    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload || !payload.id) {
      c.status(401);
      return c.json({ error: "Invalid token" });
    }

    // Now TypeScript knows payload.id is a string
    c.set("userId", payload.id as string);
    await next();
  } catch (error) {
    c.status(401);
    return c.json({
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");

  const body = await c.req.json();

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });

  return c.json({
    blog: blog,
  });
  // return c.json({ message: "Blog post created", userId });
});

blogRouter.put("/", async (c) => {
  const userId = c.get("userId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  console.log(body);
  const editedContent = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({ message: editedContent });
});

blogRouter.get("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const postsfromthere = await prisma.post.findFirst({
      where: {
        id: body.id,
      },
    });
    return c.json({ postsfromthere });
  } catch {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});
blogRouter.get("/bulk", async (c) => {
  console.log("just entered");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  console.log("hii there");
  try {
    const allPosts = await prisma.post.findMany();
    return c.json({
      allPosts,
    });
  } catch (error) {
    console.error("Server error:", error);
    c.status(500);
    return c.json({
      error: "Internal Server Error",
    });
  }
});
