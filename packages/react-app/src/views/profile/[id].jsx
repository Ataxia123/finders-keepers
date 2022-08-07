import { gql, useQuery } from "@apollo/client";
import React from "react";
import { FK_COMMENT, GET_FK } from "../../hooks/api";
import { signedTypeData, getAddressFromSigner, splitSignature } from "./ethers-service";
import { createCommentTypedData } from "./create-comment-typed-data.js";
import { Button } from "antd";

export default function Profile(props, userSigner, readContracts) {
  const profileId = props.match.params.id;
  const { loading, error, data } = useQuery(FK_COMMENT, {
    variables: {
      request: { publicationId: profileId }, //"0x8c50-0x1a"
    },
    skip: !profileId,
    fetchPolicy: "no-cache",
  });
  console.log("get_fk", data);
  console.log("id", profileId);

  const CreateComment = async () => {
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

    const result = await createCommentTypedData(createCommentRequest);
    const typedData = result.data.createCommentTypedData.typedData;
    console.log("typedData", typedData);

    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    const { v, r, s } = splitSignature(signature);

    const tx = await readContracts.LENS.commentWithSig({
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
    console.log("Post", tx.hash);
  };

  // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
  // you can look at how to know when its been indexed here:
  //   - https://docs.lens.dev/docs/has-transaction-been-indexed

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error...</div>;
  }
  return (
    <div>
      {data.publication.profile.coverPicture ? (
        data.publication.profile.coverPicture.__typename === "NftImage" ? (
          <img
            alt="..."
            style={{ width: "300px", height: "300px", borderRadius: "10px" }}
            src={data.publication.profile.coverPicture.uri}
          />
        ) : (
          <img
            alt="..."
            style={{ width: "300px", height: "300px", borderRadius: "10px" }}
            src={data.publication.profile.coverPicture.original.url}
          />
        )
      ) : (
        <img
          alt="..."
          style={{ width: "300px", height: "300px", borderRadius: "10px" }}
          src="https://lh3.googleusercontent.com/SnPeYEbN776UygTg05HUfamo4CTSAxMt1cvfsDEDT3NkPmZ5RIEX70B80hUHIqO66LIpepSe8u0yDZEdKZYKHEc2FdL5cLsrVYttZ_Q=w600"
        />
      )}
      <h1>Post {profileId}</h1>
      <h2>Source: {data.publication.appId} </h2>
      <Button onClick={CreateComment}>Create Comment</Button>

    </div>
  );
}
