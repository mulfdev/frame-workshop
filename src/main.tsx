import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception'

type FrameDataRes = {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  buttonIndex: 1 | 2 | 3 | 4;
  castId: {
    fid: number;
    hash: string;
  };
};


const app = new Hono();

const ButtonRenderer = ({ buttonData }: { buttonData: string[] }) => {
  return (
    <>
      {buttonData.map((content, idx) => <meta property={`fc:frame:button:${idx + 1}`} content={`${content}`} />)}
    </>
  )
}


const Layout = ({ imgUrl }: { imgUrl: string }) => {
  const buttonData = ["Btn 1", "Btn 2", "Btn 3", "Btn 4"]
  return (
    <html>
      <head>
        <meta property="og:title" content="Our First frame" />
        <meta property="og:image" content={`${imgUrl}`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${imgUrl}`} />
        <meta property="fc:frame:post_url" content="https://frame-workshop.up.railway.app/res" />
        {<ButtonRenderer buttonData={buttonData} />}
      </head>
    </html>
  )
}

app.get("/", (c) => {
  return c.render(<Layout imgUrl="https://i.imgur.com/sS717ci.jpg" />)
})

app.post("/res", async (c) => {
  const frameData: { untrustedData: FrameDataRes } = await c.req.json()

  if (!frameData?.untrustedData?.buttonIndex) {
    throw new HTTPException(400, { message: "frame data missing" })
  }

  const { buttonIndex } = frameData.untrustedData

  switch (buttonIndex) {
    case 1: {
      return (<Layout imgUrl="https://i.imgur.com/g4Ll2Dj.png" />)
    }
    case 2: {
      return (<Layout imgUrl="https://i.imgur.com/mnSybOx.jpeg" />)
    }
    case 3: {
      return (<Layout imgUrl="https://i.imgur.com/eOw6ff3.jpeg" />)
    }
    case 4: {
      return (<Layout imgUrl="https://i.imgur.com/5CBUsN1.jpeg" />)
    }

    default: {
      //const buttonData = ["Btn 1 d", "Btn 2 d", "Btn 3 d", "Btn 4 d"]
      return (
        <Layout imgUrl="https://i.imgur.com/sS717ci.jpg" />
      )
    }
  }
})

console.log("sever is running");
serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
