import { Elysia,t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { bearer } from '@elysiajs/bearer'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { staticPlugin } from '@elysiajs/static'
import {Resend} from 'resend'
import { events } from "./routes/eventRoutes";
import { members } from "./routes/memberRoutes";
const resend = new Resend(Bun.env.RESEND_API_KEY)

const app = new Elysia()
  .use(swagger())
  .use(bearer())
  .use(cors())
  .use(jwt({name: 'jwt',secret: "FischlDydwiddimynhoffirhaglennuonddwinhoffigwiriorhaglenoeddfymhrosiectmwyafhydynhynvonLuftschlossNarfidort"}))
  .use(staticPlugin())
  .use(members)
  .use(events)
  .get("/", () => {
    console.log(Bun.env.SERVER_URL);
    return "hello world";
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

