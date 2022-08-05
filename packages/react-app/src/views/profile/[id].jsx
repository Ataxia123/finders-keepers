import React from "react";

export default function Profile() {
  const router = React.useRouter();
  const { id } = router.query;
  console.log("ID DONT MISS ME IM IN ALL CAPS", id);
  return (
    <div>
      <h1>Profile</h1>
      <p>ID: {id}</p>
    </div>
  );
}
