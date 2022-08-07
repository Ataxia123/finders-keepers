import { signedTypeData, getAddressFromSigner, splitSignature } from "./ethers-service";
import { gql } from "@apollo/client";

export default function Comment({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
  client,
}) {
  const createComment = async () => {
    // hard coded to make the code example clear
    const createCommentRequest = {
      profileId: "0x03",
      publicationId: "0x01-0x01",
      contentURI: "ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl",
      collectModule: {
        timedFeeCollectModule: {
          amount: {
            currency: "0xD40282e050723Ae26Aeb0F77022dB14470f4e011",
            value: "0.01",
          },
          recipient: "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
          referralFee: 10.5,
        },
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    const CREATE_COMMENT_TYPED_DATA = `
  mutation($request: CreatePublicCommentRequest!) { 
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
        profileIdPointed
        pubIdPointed
        referenceModuleData
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
    const createCommentTypedData = createCommentTypedDataRequest => {
      return props.client.mutate({
        mutation: gql(CREATE_COMMENT_TYPED_DATA),
        variables: {
          request: createCommentTypedDataRequest,
        },
      });
    };

    const result = createCommentTypedData(createCommentRequest);
    const typedData = result.data.createCommentTypedData.typedData;

    const signature = signedTypeData(typedData.domain, typedData.types, typedData.value);
    const { v, r, s } = splitSignature(signature);

    const tx = await client.commentWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      profileIdPointed: typedData.value.profileIdPointed,
      pubIdPointed: typedData.value.pubIdPointed,
      referenceModuleData: typedData.value.referenceModuleData,
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
    console.log(tx.hash);
    // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
    // you can look at how to know when its been indexed here:
    //   - https://docs.lens.dev/docs/has-transaction-been-indexed
  };
}
