import React from "react";
import { RECOMEND_PROFILES, GET_FK, COMMENT_FEED_QUERY } from "../hooks/api.js";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Grid from "antd/lib/card/Grid.js";

export default function ExampleUI() {
  //Work w API to get recommended profiles
  const useMultiple = () => {
    const id = "0x8c50-0x1a";
    const get_fk = useQuery(GET_FK);
    const getFkPosts = useQuery(COMMENT_FEED_QUERY, {
      variables: {
        request: { commentsOf: id, limit: 10 },
      },
      skip: !id,
      fetchPolicy: "no-cache",
    });
    const recProfiles = useQuery(RECOMEND_PROFILES);
    //setRecommendedProfiles({ data });
    return [get_fk, recProfiles, getFkPosts];
  };

  const [
    { loading: loading1, error: error1, data: data1 },
    { loading: loading2, error: error2, data: data2 },
    { loading: loading3, error: error3, data: data3 },
  ] = useMultiple();
  console.log("Data1", data1);
  console.log("Data2", data2);
  console.log("Data3", data3);
  //Work w API to get recommended profiles
  if (loading1 || loading2 || loading3) {
    return <div>Loading...</div>;
  }
  if (error1 || error2 || error3) {
    return <div>Error...</div>;
  }
  return (
    <div style={{ margin: 32 }}>
      {data3.publications.items.map((items, index) => (
        <Link key={index} to={`/profile/${items.id}`}>
          <a href={`/profile/${items.id}`}>
            <div
              style={{
                backgroundColor: "rgb(97, 255, 150)",
                display: "inline-block",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "42px",
                margin: "1.5%",
                overflow: "hidden",
                textAlign: "top center",
              }}
            >
              <p>Classifieds</p>
              {items.profile.picture ? (
                items.profile.picture.__typename === "NftImage" ? (
                  <img
                    alt="..."
                    style={{ width: "300px", height: "300px", borderRadius: "10px" }}
                    src={items.profile.picture.uri}
                  />
                ) : (
                  <img
                    alt="..."
                    style={{ width: "300px", height: "300px", borderRadius: "10px" }}
                    src={items.profile.picture.original.url}
                  />
                )
              ) : (
                <img
                  alt="..."
                  style={{ width: "300px", height: "300px", borderRadius: "10px" }}
                  src="https://lh3.googleusercontent.com/SnPeYEbN776UygTg05HUfamo4CTSAxMt1cvfsDEDT3NkPmZ5RIEX70B80hUHIqO66LIpepSe8u0yDZEdKZYKHEc2FdL5cLsrVYttZ_Q=w600"
                />
              )}
              <h4>
                {items.metadata.content}
                {/* <p style={{ inlineSize: '150px', overflowWrap: 'break-word', }}>{profile.bio}</p>
                 */}
                <br></br>
                <button style={{ display: "inline-block", margin: "10px" }}>Buy</button>
                <button>Sell</button>
              </h4>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
