import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./routes/user";

import { blogRouter } from "./routes/blog";

// Define the JWT payload type
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

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

app.use("/*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

// Authentication middleware with proper typing
app.get("/api/v1/test", (c) => {
  return c.json({ message: "API is working!" });
});

app.get("/", (c) => {
  return c.json({ message: "Welcome to the blog API aithere" });
});

export default app;
