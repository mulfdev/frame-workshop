import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception'

type FrameDataRes = {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
};

const app = new Hono();

const Layout = () => {
  return (
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
        <meta property="fc:frame:post_url" content="https://frame-workshop.up.railway.app/res" />
      </head>
    </html>
  )
}

app.get("/", (c) => {
  return c.render(<Layout />)
})

app.post("/res", async (c) => {
  const frameData: { untrustedData: FrameDataRes } = await c.req.json()

  if (!frameData.untrustedData.buttonIndex) {
    throw new HTTPException(400, { message: "frame data missing" })
  }

  return c.text(`
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
