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
  return <div style={{ margin: 100 }}>Stuff goes here{postId}</div>;
}
export default Profile;
