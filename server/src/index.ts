import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Resend } from "resend";
import "./database/db.setup";
import { membersController } from "./controllers/member.controller";
import { organizationController } from "./controllers/organization.controller";
import { organizationAuthController } from "./controllers/organizationAuth.controller";
import { memberAuthController } from "./controllers/memberAuth.controller";
import { authController } from "./controllers/auth.controller";
const resend = new Resend(Bun.env.RESEND_API_KEY);

const app = new Elysia()
  .use(staticPlugin())
  .use(swagger())
  .use(cors())
  .group("/api", (app) =>
    app.use(authController).use(organizationController).use(membersController)
  )
  .listen(Bun.env.PORT || 4000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
