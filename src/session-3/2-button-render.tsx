/*
 * Add button renderer
 *
 * - ButtonRenderer function maps over an array of strings to display
 *   a given frame's buttons (max of 4)
 *
 * - render metatags with the fc button option using
 *   the index + 1 (since js arrays are zero based)
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const ButtonRenderer = ({ buttonData }: { buttonData: string[] }) => (
  <>
    {buttonData.map((content, idx) => (
      <meta property={`fc:frame:button:${idx + 1}`} content={`${content}`} />
    ))}
  </>
);

const Layout = ({ imgUrl, postUrl }: { imgUrl: string; postUrl: string }) => {
  const buttonData = ["Btn 1", "Btn 2", "Btn 3", "Btn 4"];
  return (
    <html>
      <head>
        <meta property="og:title" content="Our First frame" />
        <meta property="og:image" content={`${imgUrl}`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${imgUrl}`} />
        <meta property="fc:frame:post_url" content={postUrl} />
        {<ButtonRenderer buttonData={buttonData} />}
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
