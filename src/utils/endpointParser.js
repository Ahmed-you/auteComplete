import querystring from "node:querystring";

const endpointParser = (url) =>
  url
    .split(/\?(.*)/s)
    .filter((item) => {
      return Boolean(item);
    })
    .reduce(
      (acc, item, index) =>
        index === 0
          ? { ...acc, endpoint: item }
          : { ...acc, queries: querystring.parse(item) },
      {}
    );

export default endpointParser;
