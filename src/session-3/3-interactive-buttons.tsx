/*
* Adding interactivity
*
* - Add post route handler as defined in the layout
* - Warpcast will send a object in this format:
* {
    "untrustedData": {
      "fid": 2,
      "url": "https://fcpolls.com/polls/1",
      "messageHash": "0xd2b1ddc6c88e865a33cb1a565e0058d757042974",
      "timestamp": 1706243218,
      "network": 1,
      "buttonIndex": 2,
      "inputText": "hello world", // "" if requested and no input, undefined if input not requested
      "castId": {
        "fid": 226,
        "hash": "0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9"
      }
    },
    "trustedData": {
      "messageBytes": "d2b1ddc6c88e865a33cb1a565e0058d757042974..."
    }
  }

*
* We compose our dynamic logic around which buttonIndex is sent back
* and render a different frame depending on which button index is send
*
* Since the data is being send over the wire, we are checking that it does
* in fact exist and if not, throwing an error
*
*/

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

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

const ButtonRenderer = ({ buttonData }: { buttonData: string[] }) => (
  <>
    {buttonData.map((content, idx) => (
      <meta property={`fc:frame:button:${idx + 1}`} content={`${content}`} />
    ))}
  </>
);

const Layout = ({
  imgUrl,
  postUrl,
  buttonData,
}: {
  imgUrl: string;
  postUrl?: string;
  buttonData?: string[];
}) => {
  const defaultButtonData = ["Btn 1", "Btn 2", "Btn 3", "Btn 4"];
  return (
    <html>
      <head>
        <meta property="og:title" content="Our First frame" />
        <meta property="og:image" content={`${imgUrl}`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${imgUrl}`} />
        <meta
          property="fc:frame:post_url"
          content={postUrl || "https://frame-workshop.up.railway.app/res"}
        />
        {<ButtonRenderer buttonData={buttonData || defaultButtonData} />}
      </head>
    </html>
  );
};

app.get("/", (c) =>
  c.render(
    <Layout
      imgUrl="https://i.imgur.com/sS717ci.jpg"
      postUrl="https://frame-workshop.up.railway.app/res"
    />,
  ),
);

app.post("/res", async (c) => {
  const frameData: { untrustedData: FrameDataRes } = await c.req.json();

  console.log(frameData);

  if (!frameData?.untrustedData?.buttonIndex) {
    throw new HTTPException(400, { message: "frame data missing" });
  }

  const { buttonIndex } = frameData.untrustedData;

  switch (buttonIndex) {
    case 1: {
      return c.render(<Layout imgUrl="https://i.imgur.com/g4Ll2Dj.png" />);
    }
    case 2: {
      return c.render(<Layout imgUrl="https://i.imgur.com/mnSybOx.jpeg" />);
    }
    case 3: {
      return c.render(<Layout imgUrl="https://i.imgur.com/eOw6ff3.jpeg" />);
    }
    case 4: {
      return c.render(<Layout imgUrl="https://i.imgur.com/5CBUsN1.jpeg" />);
    }

    default: {
      //const buttonData = ["Btn 1 d", "Btn 2 d", "Btn 3 d", "Btn 4 d"]
      return c.render(<Layout imgUrl="https://i.imgur.com/sS717ci.jpg" />);
    }
  }
});

console.log("sever is running");
serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
