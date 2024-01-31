import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) =>
  c.text(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Vote Recorded">
        <meta property="og:image" content="https://i.imgur.com/sS717ci.jpg">
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="https://i.imgur.com/sS717ci.jpeg" />
      </head>
    </html>
`)
);
console.log("sever is running");
serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
