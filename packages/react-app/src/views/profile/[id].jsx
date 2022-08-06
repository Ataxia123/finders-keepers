import { gql, useQuery } from "@apollo/client";
import React from "react";
import { GET_PROFILES } from "../../hooks/api";

function Profile(props) {
  // get ID from props
  let postId = props.match.params.id;
  console.log(props.match.params.id);
  //Get single profile Query
  const { loading, error, data } = useQuery(GET_PROFILES, {
    variables: {
      id: postId,
    },
  });
  console.log("Data", data);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  return (
    <div style={{ margin: 100 }}>
      <h1>Stuff goes here</h1>
      <div>{data.profiles.items[0].handle}</div>
      {data.profiles.items[0].picture ? (
        data.profiles.items[0].picture.__typename === "NftImage" ? (
          <img
            alt="..."
            style={{ width: "300px", height: "300px", borderRadius: "10px" }}
            src={data.profiles.items[0].picture.uri}
          />
        ) : (
          <img
            alt="..."
            style={{ width: "300px", height: "300px", borderRadius: "10px" }}
            src={data.profiles.items[0].picture.original.url}
          />
        )
      ) : (
        <img
          alt="..."
          style={{ width: "300px", height: "300px", borderRadius: "10px" }}
          src="https://lh3.googleusercontent.com/SnPeYEbN776UygTg05HUfamo4CTSAxMt1cvfsDEDT3NkPmZ5RIEX70B80hUHIqO66LIpepSe8u0yDZEdKZYKHEc2FdL5cLsrVYttZ_Q=w600"
        />
      )}
    </div>
  );
}
export default Profile;
