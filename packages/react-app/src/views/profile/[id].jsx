import React from "react";

export default function Profile() {
  const router = React.useRouter();
  const { id } = router.query;
  console.log("ID DONT MISS ME IM IN ALL CAPS", id);
  return id;
}
