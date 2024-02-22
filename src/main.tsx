/*
 * Added dotenv
 * added redis lib upstash
 * added hono-og
 */

import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Redis } from "@upstash/redis";
import { ImageResponse } from "hono-og";

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
          content={
            postUrl || "https://frame-workshop-production.up.railway.app"
          }
        />
        {<ButtonRenderer buttonData={buttonData || defaultButtonData} />}
      </head>
    </html>
  );
};

app.get("/", (c) =>
  c.render(
    <Layout
      imgUrl="https://frame-workshop-production.up.railway.app/img"
      postUrl="https://frame-workshop-production.up.railway.app"
    />,
  ),
);

app.post("/res", async (c) => {
  const frameData: { untrustedData: FrameDataRes } = await c.req.json();

  if (!frameData?.untrustedData.buttonIndex) {
    throw new HTTPException(400, { message: "frame data missing" });
  }

  const { buttonIndex } = frameData.untrustedData;

  switch (buttonIndex) {
    case 1: {
      return c.render(<Layout imgUrl="https://i.imgur.com/EWFu70H.jpeg" />);
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
      return c.render(<Layout imgUrl="https://i.imgur.com/sS717ci.jpg" />);
    }
  }
});

app.post("/redis", async (c) => {
  if (!process.env.REDIS_TOKEN) {
    throw new HTTPException(400, { message: "redis token required" });
  }
  const redis = new Redis({
    url: "https://usw2-engaged-mallard-31353.upstash.io",
    token: process.env.REDIS_TOKEN,
  });

  const frameData: { untrustedData: FrameDataRes } = await c.req.json();

  if (!frameData?.untrustedData.fid || !frameData.untrustedData.buttonIndex) {
    throw new HTTPException(400, {
      message: "frame data missing: fid or button index",
    });
  }

  const hasVoted = await redis.sismember(
    "alreadyVoted",
    frameData.untrustedData.fid,
  );

  if (hasVoted) {
    throw new HTTPException(400, { message: "fid has already voted" });
  }

  const data = await redis.hincrby(
    "workshopPoll",
    frameData.untrustedData.buttonIndex.toString(),
    1,
  );
  await redis.sadd("alreadyVoted", frameData.untrustedData.fid);

  console.log(data);

  return c.json({
    message: "recieved",
  });
});

app.get("/img", async () => {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "black",
          backgroundSize: "150px 150px",
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flexWrap: "nowrap",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            color: "white",
            marginTop: 30,
            padding: "0 120px",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
        >
          hello hono
        </div>
      </div>
    ),
  );
});

console.log("sever is running");
serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
