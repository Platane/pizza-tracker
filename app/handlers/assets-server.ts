import { APIGatewayProxyHandler } from "aws-lambda";
import mimeTypes from "mime-types";
import path from "path";
import fs from "fs";

const returnAsset = assetPath => {
  const filename = path.join(__dirname, "assets", assetPath);

  console.log("read file", assetPath, filename);

  const res = fs.readFileSync(filename);

  const contentType = mimeTypes.contentType(path.extname(assetPath));

  const binary = mimeTypes.charset(contentType) !== "UTF-8";

  const headers = { "content-type": contentType };

  return {
    body: res.toString(binary ? "base64" : "utf8"),
    headers,
    statusCode: 200,
    isBase64Encoded: binary
  };
};

export const handle: APIGatewayProxyHandler = async event => {
  /**
   * trim /assets from the path
   * because we serve either  /favicon.ico and /assets/favicon.ico
   */

  try {
    return returnAsset(event.path.replace(/^\/stage\//, ""));
  } catch (err) {
    if (
      err.message.includes("no such file") ||
      err.message.includes("illegal operation on a directory")
    )
      return returnAsset("index.html");

    console.error(err);
    throw err;
  }
};
