import { apolloClient } from "../apollo-client";
import { gql } from "@apollo/client";
import { signedTypeData, splitSignature } from '../utils/ethers-service';
import { lensHub } from '../utils/lensHub';
import { v4 as uuidv4 } from 'uuid';

const CREATE_POST_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
  }
}
`;


const createPostTypedData = (createPostTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_POST_TYPED_DATA),
    variables: {
      request: createPostTypedDataRequest,
    },
  });
};

const uploadContent = async (content) => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (response.status !== 200) {
        alert("Oops! Something went wrong. Please refresh and try again.");
      } else {
        console.log("Form successfully submitted!");
        const responseJSON = await response.json();
        return responseJSON.cid;
      }
    } catch (error) {
      alert(
        `Oops! Something went wrong. Please refresh and try again. Error ${error}`
      );
    }
  };

const createPost = async (profile) => {
  const profileId = profile.id
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  const CID = await uploadContent({
    version: '1.0.0',
    metadata_id: uuidv4(),
    description: 'Description for my first post!',
    content: 'Content for my first post!',
    external_url: null,
    image: null,
    imageMimeType: null,
    name: 'Name of my first post!',
    attributes: [],
    media: [
      // {
      //   item: 'https://scx2.b-cdn.net/gfx/news/hires/2018/lion.jpg',
      //   // item: 'https://assets-global.website-files.com/5c38aa850637d1e7198ea850/5f4e173f16b537984687e39e_AAVE%20ARTICLE%20website%20main%201600x800.png',
      //   type: 'image/jpeg',
      // },
    ],
    appId: 'testing123',
  });

  // hard coded to make the code example clear
  const createPostRequest = {
    profileId,
    contentURI: "ipfs://" + CID,
    collectModule: {
      // feeCollectModule: {
      //   amount: {
      //     currency: currencies.enabledModuleCurrencies.map(
      //       (c: any) => c.address
      //     )[0],
      //     value: '0.000001',
      //   },
      //   recipient: address,
      //   referralFee: 10.5,
      // },
      // revertCollectModule: true,
      freeCollectModule: { followerOnly: true },
      // limitedFeeCollectModule: {
      //   amount: {
      //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      //     value: '2',
      //   },
      //   collectLimit: '20000',
      //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
      //   referralFee: 0,
      // },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };
  console.log("CREATE POST REQUEST", createPostRequest)

  const result = await createPostTypedData(createPostRequest);
  console.log('create post: createPostTypedData', result);

  const typedData = result.data.createPostTypedData.typedData;
  console.log('create post: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('create post: signature', signature);

  const { v, r, s } = splitSignature(signature);
  const contract = lensHub()

  const tx = await contract.postWithSig({
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleInitData: typedData.value.collectModuleInitData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleInitData: typedData.value.referenceModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log('create post: tx hash', tx.hash);

//   const indexedResult = await pollUntilIndexed(tx.hash);
  console.log('tx', tx);

//   console.log('create post: profile has been indexed', result);

//   const logs = indexedResult.txReceipt.logs;

//   console.log('create post: logs', logs);

//   const topicId = utils.id(
//     'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
//   );
//   console.log('topicid we care about', topicId);

//   const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
//   console.log('create post: created log', profileCreatedLog);

//   let profileCreatedEventLog = profileCreatedLog.topics;
//   console.log('create post: created event logs', profileCreatedEventLog);

//   const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

//   console.log('create post: contract publication id', BigNumber.from(publicationId).toHexString());
//   console.log(
//     'create post: internal publication id',
//     profileId + '-' + BigNumber.from(publicationId).toHexString()
//   );

//   return result.data;
};

export default function HackLensPost({profile}){

    const handleCreatePost = async (e) => {
        e.preventDefault();
        await createPost(profile)
    }

    return(
        <div>
            <button onClick={handleCreatePost}>Create Post</button>
        </div>
    )
}