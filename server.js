const express = require("express");
const next = require("next");
const api = require("unsplash-js");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

const server = express();
server.use(cors());
server.use(express.json());

app.prepare().then(() => {
  // Express.js routes and middleware:

  server.listen(8080, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:8080");
  });
});

server.get("/", (req, res) => {
  return handle(req, res);
});

server.get("/images", async (req, res) => {
  const serverApi = api.createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
  });
  const pictures = await serverApi.search.getPhotos({
    query: "nature",
    page: 1,
    perPage: 10,
    color: "green",
    orientation: "portrait",
  });

  return res.json({ message: JSON.stringify(pictures?.response?.results) });
});

server.post("/analyze", (req, res) => {
  const body = req.body;
  const url = body.url;
  // perform operations using the image url..
  console.log(url);
  const tags = ["tree", "leaves", "branches", "natural"];

  return res.json({ message: JSON.stringify(tags) });
});
