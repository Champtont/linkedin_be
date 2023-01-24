import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import { promisify } from "util";
import { getPDFWritableStream } from "./fs_tools.js";
import imageToBase64 from "image-to-base64";

export const getPDFReadableStream = async (userInfo) => {
  async function createBase64(url) {
    let base64Encoded = await imageToBase64(url);
    return "data:image/jpeg;base64, " + base64Encoded;
  }
  const dataUrl = userInfo.image.toString();
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { image: "profilePic" },
      { text: userInfo.name, style: "header" },
      { text: userInfo.bio },
    ],
    images: {
      profilePic: await createBase64(dataUrl),
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};

export const asyncPDFGeneration = async (userInfo) => {
  const source = getPDFReadableStream(userInfo);
  const destination = getPDFWritableStream(`${userInfo.name}sCV.pdf`);

  const promiseBasedPipeline = promisify(pipeline);

  await promiseBasedPipeline(source, destination);
};
