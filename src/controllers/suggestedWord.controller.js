import fs from "node:fs";
import endpointParser from "../utils/endpointParser.js";
export const suggestedWord = (req, res) => {
  const pathToFile =
    "/home/luffy/Documents/Gaza Sky Geeks Training/Week4 /auteComplete/src/data/words.txt";

  // use read file function to access dictionary data and search it

  fs.readFile(pathToFile, "utf-8", (error, file) => {
    if (error) {
      console.log(error);
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error }));
    } else {
      //dictionary words turned into an array
      const wordsArray = file.split("\n").map((word) => word.trim());

      //url query
      const query = endpointParser(req.url);
      const queryValue = query.queries.word;
      //query validation
      if (Object.keys(query.queries)[0] != "word") {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Missing query parameter 'word'" })
        );
      }
      const selectedSearchWord =
        typeof queryValue == "object" ? "Error" : queryValue;
      const suggestedWords = {};

      // array of suggested searched words
      if (selectedSearchWord == "Error") {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            error:
              "You Cant Send More Than 1 single Request parameter at a Time",
          })
        );
      } else if (selectedSearchWord == "") {
        res.writeHead(400, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            error: "There Is No Search Word",
          })
        );
      } else {
        suggestedWords.words = [];
        for (const word of wordsArray) {
          if (word.toLowerCase().startsWith(selectedSearchWord.toLowerCase())) {
            console.log(suggestedWords.words.push(word));
            if (suggestedWords.words.length >= 10) break;
          }
        }
      }
      if (suggestedWords.words?.length == 0) {
        suggestedWords.words = "Nothing Found";
      }

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(suggestedWords));
    }
  });
};
