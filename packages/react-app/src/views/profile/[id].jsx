import React from "react";
import { InMemoryCache } from "@apollo/client";

export default function Profile() {
  const router = new InMemoryCache({});
  const { id } = router.query;
  return (
    <div>
      <h1>Profile</h1>
      <p>ID: {id}</p>
    </div>
  );
}
