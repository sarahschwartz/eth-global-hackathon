import nextConnect from "next-connect";
import multiparty from "multiparty";
import { Web3Storage, getFilesFromPath } from "web3.storage";
const fs = require("fs");
const { resolve, join, dirname } = require("path");

const handler = nextConnect();

handler.use((req, res, next) => {
  const form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    req.body = fields;
    req.files = files;
    next();
  });
});

handler.post(async (req, res) => {
  try {
    const files = await makeFileObjects(req.files);
    const cid = await storeFiles(files);

    return res.status(200).json({ success: true, cid: cid });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error storing the file", success: false });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

async function storeFiles(files) {
  const client = makeStorageClient();
  try {
    const cid = await client.put(files);
    return cid;
  } catch (error) {
    console.log("ERROR", error);
  }
}

async function getNewPath(item) {
  if (item[0].originalFilename && item[0].originalFilename !== "") {
    const filePath = resolve(process.cwd(), item[0].path);
    const newPath = join(dirname(filePath), item[0].originalFilename);
    await fs.promises.rename(filePath, newPath);
    return newPath;
  }
}

async function makeFileObjects(myFiles) {
  let files;
 
  for (let item of Object.values(myFiles)) {
    let newPath = await getNewPath(item);
    if (!files) {
      files = await getFilesFromPath(newPath);
    } else {
      let newFiles = await getFilesFromPath(newPath);
      files = [...files, ...newFiles];
    }
  }

  return files;
}

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
}
