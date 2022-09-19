import { Web3Storage, File } from "web3.storage";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await storeData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function storeData(req, res) {
  const body = req.body;
  try {
    const files = await makeFileObjects(body);
    const cid = await storeFiles(files);
    return res.status(200).json({ success: true, cid: cid });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error creating event", success: false });
  }
}

async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  return cid;
}

async function makeFileObjects(body) {
  const buffer = Buffer.from(JSON.stringify(body));
  const files = []
  files.push(new File([buffer], "data.json"));
  console.log(files);
  return files;
}

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
}