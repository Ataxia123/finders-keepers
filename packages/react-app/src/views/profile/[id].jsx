import React from "react";
import { Context } from "urql";

export default function Profile() {
  const { id } = React.useContext(Context);
  console.log("ID DONT MISS ME IM IN ALL CAPS", id);
  return (
    <div>
      <h1>Profile</h1>
      <p>ID: {id}</p>
    </div>
  );
}
