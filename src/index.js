import http from "node:http";
import { router } from "./routers/index.js";

const server = http.createServer(router);
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 4001;

server.listen(port, () => {
  console.log(`server up and running Visit The link: http://${host}:${port} `);
});
