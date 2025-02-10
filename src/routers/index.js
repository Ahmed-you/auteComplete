import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url"; // lets us turn `import.meta.url` into __dirname-like behavior

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { suggestedWord } from "../controllers/suggestedWord.controller.js";
import endpointParser from "../utils/endpointParser.js";

export const router = (req, res) => {
  try {
    const { url, method } = req;
    const { endpoint, queries } = endpointParser(url);

    // Attach query parameters to the request object
    req.queries = queries;

    if (endpoint === "/") {
      // Build the file path to `index.html`
      const filePath = path.join(__dirname, "..", "..", "public", "index.html");

      fs.readFile(filePath, (error, file) => {
        if (error) {
          console.error(error);
          res.writeHead(500, { "content-type": "text/html" });
          return res.end("<h1>Server Error</h1>");
        }

        res.writeHead(200, { "content-type": "text/html" });
        res.end(file);
      });
    } else if (endpoint === "/api/suggestedWord") {
      switch (method) {
        case "GET":
          suggestedWord(req, res);
          break;
        default:
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "This method not supported" }));
          break;
      }
    } else if (endpoint.includes(".")) {
      //The Path We Gana Use
      const filePath = path.join(__dirname, "..", "..", "public", endpoint);

      fs.readFile(filePath, (error, file) => {
        if (error) {
          console.log(error);
          res.writeHead(404, { "content-type": "text/html" });
        } else {
          let extension = path.extname(endpoint);
          let contentType = "text/plain";
          switch (extension) {
            case ".html":
              contentType = "text/html";
              break;
            case ".css":
              contentType = "text/css";
              break;
            case ".js":
              contentType = "application/javascript";
              break;
            case ".json":
              contentType = "application/json";
              break;
            case ".jpg":
            case ".jpeg":
              contentType = "image/jpeg";
              break;
            case ".png":
              contentType = "image/png";
              break;
            case ".ico":
              contentType = "image/x-icon";
              break;
          }
          res.writeHead(200, { "content-type": contentType });
          res.end(file);
        }
      });
    } else {
      // Optional: handle unknown endpoints
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  } catch (error) {
    console.error(error); // so you can see what actually went wrong
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "something went wrong" }));
  }
};
