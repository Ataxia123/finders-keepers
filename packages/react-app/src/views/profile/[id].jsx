import { gql, useQuery, useMutation } from "@apollo/client";
import React from "react";
import { FK_COMMENT, GET_FK } from "../../hooks/api";
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

  async function get_fk() {
    const provider = readContracts.getProvider();
  }

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
      <Button onClick={profileId}>Create Comment</Button>
    </div>
  );
}
