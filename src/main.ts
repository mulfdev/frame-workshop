import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) =>
  c.text(`
    <!DOCTYPE html>
    <html>
      <head>
         <meta property="og:title" content="Our First frame" />
        <meta property="og:image" content="https://i.imgur.com/sS717ci.jpg" />
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="https://i.imgur.com/sS717ci.jpeg" />
        <meta property="fc:frame:button:1" content="Green" />
        <meta property="fc:frame:button:2" content="Purple" />
        <meta property="fc:frame:button:3" content="Red" />
        <meta property="fc:frame:button:4" content="Blue" />
<meta property="fc:frame:post_url" content="https://frame-workshop-production-55b0.up.railway.app/button1" />
        <meta property="fc:frame:button:1:action content="post"/>
        <meta property="fc:frame:button:1:target" content="https://frame-workshop-production-55b0.up.railway.app/button1" />
      </head>
    </html>
`)
);

app.post("/button1", (c) => {
  // https://i.imgur.com/FDD8qwD.jpeg
  console.log(c)
  c.text(`
     <!DOCTYPE html>
    <html>
      <head>
         <meta property="og:title" content="Our First frame" />
        <meta property="og:image" content="https://i.imgur.com/FDD8qwD.jpeg" />
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="https://i.imgur.com/FDD8qwD.jpeg" />
     </head>
    </html>

  `)
})

console.log("sever is running");
serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
