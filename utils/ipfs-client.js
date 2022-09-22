import { create } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
const secret = process.env.NEXT_PUBLIC_INFURA_IPFS_SECRET;

if (!projectId || !secret) {
  throw new Error('Must define INFURA_PROJECT_ID and INFURA_SECRET in the .env to run this');
}

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(`${projectId}:${secret}`, 'utf-8').toString('base64')}`,
  },
});

export const uploadIpfsMetadata = async (data) => {
  const result = await client.add(JSON.stringify(data));

  return result;
};

export async function getLinks(cid) {
  const url = 'https://dweb.link/api/v0';
  const ipfs = create({ url });

  const links = [];
  for await (const link of ipfs.ls(cid)) {
    links.push(link);
  }
  return links
}

export async function uploadFiles(filesArray) {
  let formData = new FormData();
  filesArray.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });
  let cid = await uploadToIPFS(formData);
  return cid;
}

async function uploadToIPFS(formData) {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (response.status !== 200) {
      console.log("ERROR", response);
    } else {
      let responseJSON = await response.json();
      return responseJSON.cid;
    }
  } catch (error) {
    alert(
      `Oops! Something went wrong. Please refresh and try again. Error ${error}`
    );
  }
}