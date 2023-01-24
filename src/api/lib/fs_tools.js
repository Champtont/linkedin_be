import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { createReadStream, createWriteStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
console.log("DATA FOLDER PATH: ", dataFolderPath);

export const getPDFWritableStream = (fileName, contentAsABuffer) =>
  createWriteStream(join(dataFolderPath, fileName), contentAsABuffer);
