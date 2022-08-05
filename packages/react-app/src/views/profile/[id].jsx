import React from "react";
import { lensClient, reccomendProfiles } from "../../hooks/api.js";
import { useQuery } from "urql";

export default function Profile() {
  const router = React.useRoutes();
  const { id } = router.query;

  return <div>{id}</div>;
}
