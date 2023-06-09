import { AnyZodObject, z } from "zod";
import { TApp } from ".";
import users from "../data/USER_DATA.json";

const UserSchema = z.object({
    first_name: z.string({ required_error: "first_name is a required field" }),
    last_name: z.string({ required_error: "last_name is a required field" }),
    email: z
        .string({ required_error: "email is a required field" })
        .email("please provide a valid email"),
    city: z.string({ required_error: "city is a required field" }),
});

const UserRoutes = (app: TApp) => {
    app.get("/user", (c) => {
        return c.json({ status: "OK", data: users }, 200);
    });
    app.get("/user/:id", (c) => {
        const id = c.req.param("id");
        const user = users.find((item) => item.id === Number(id));
        if (!user) {
            return c.json(
                { status: "OK", message: `user not found with the id: ${id}` },
                404
            );
        } else {
            return c.json({ status: "OK", data: user }, 200);
        }
    });
    app.delete("/user/:id", (c) => {
        const id = c.req.param("id");
        const user = users.find((item) => item.id === Number(id));
        if (!user) {
            return c.json(
                { status: "OK", message: `user not found with the id: ${id}` },
                404
            );
        } else {
            return c.json(
                { status: "OK", message: "user deleted successfully!" },
                200
            );
        }
    });
    app.post("/user", async (c) => {
        const data = await c.req.json();
        const parse = UserSchema.safeParse(data);
        if (parse.success === false) {
            return c.json(
                {
                    status: "ERROR",
                    error: parse.error.issues.map((item) => ({
                        path: item.path[0],
                        message: item.message,
                    })),
                },
                422
            );
        }
        return c.json(
            {
                status: "OK",
                message: "user created successfully!",
            },
            201
        );
    });
};

export default UserRoutes;
