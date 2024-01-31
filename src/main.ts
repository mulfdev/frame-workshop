import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.html(`
    <!DOCTYPE html>
    <html>
      <head>
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="https://i.imgur.com/sS717ci.jpeg" />
      </head>
    </html>
`));
console.log("sever is running")
serve(app);
