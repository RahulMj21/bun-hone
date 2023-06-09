import { Hono } from "hono";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import UserRoutes from "./users";

const app = new Hono();
export type TApp = typeof app;

app.use("*", etag(), logger());

app.get("/", (c) => {
    return c.json({ status: "OK", message: "Hello World!" }, 200);
});

app.get("/healthcheck", (c) => {
    return c.json({ status: "OK", message: "Everything is working fine" });
});

app.notFound((c) =>
    c.json({ status: "ERROR", message: "path not found" }, 404)
);

UserRoutes(app);

export default app;
