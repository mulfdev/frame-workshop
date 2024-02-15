/*
 * - Some config updates to allow us to use jsx,
 * - Using c.render now instead of c.text
 * - Set up the layout to be more HTML like (jsx) also intro to props.
 * - Use props to set the base frame image url and the post url
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const Layout = ({ imgUrl, postUrl }: { imgUrl: string; postUrl: string }) => {
  return (
    <html>
      <head>
        <meta property="og:title" content="Our First frame" />
        <meta property="og:image" content={`${imgUrl}`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${imgUrl}`} />
        <meta property="fc:frame:post_url" content={postUrl} />
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

console.log("sever is running");

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
