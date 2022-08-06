import { gql, useQuery } from "@apollo/client";
import React from "react";

const GET_CURRENT_USER = gql`
  query Profile($id: String!) {
    profile(id: $id) {
      id
      name
    }
  }
`;

function Profile( props ) {
  // get ID from props
  let postId = props.id ? props.id : props.match.params.id;
  console.log(props.match.params.id);
  //Get single profile Query
  const { loading, error, data } = useQuery(GET_CURRENT_USER, {
    variables: { id: postId },
  });
  console.log("Data", data);
  return <div style={{ margin: 100 }}>Stuff goes here{postId}</div>;
}
export default Profile;
