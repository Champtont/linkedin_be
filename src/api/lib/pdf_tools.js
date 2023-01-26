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

  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      {
        alignment: "center",
        columns: [
          { image: "profilePic", width: 150, heigth: 200, margin: 10 },
          {
            text: userInfo.name + " " + userInfo.surname,
            style: { fontSize: 35 },
            margin: [0, 60],
          },
        ],
      },
      {
        text: "Bio",
        style: { fontSize: 25, color: "darkblue" },
        margin: [0, 5],
      },
      { text: userInfo.bio, style: { fontSize: 20, alignment: "left" } },
      {
        text: "Experiences",
        style: { fontSize: 25, color: "darkred" },
        margin: [0, 5],
      },
      {
        ul: [
          userInfo.experiences?.map(function (experience) {
            return {
              ul: [
                experience.role +
                  " at " +
                  experience.company +
                  "." +
                  "\n" +
                  "Description: " +
                  experience.description +
                  "\n" +
                  "Area: " +
                  experience.area,
              ],
              margin: [0, 3, 0, 3],
            };
          }),
        ],

        lineHeight: 2,
      },
    ],
    images: {
      profilePic: await createBase64(userInfo.image),
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
