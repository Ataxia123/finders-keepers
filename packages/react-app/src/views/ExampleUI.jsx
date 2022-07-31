import React from "react";
import { Button } from "antd";
import { useAccount, useConnect, useSignMessage, useEnsAvatar, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Lens } from "lens-protocol";

export default function ExampleUI() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const [refreshToken, setRefreshToken] = React.useState("");
  const [apiToken, setApiToken] = React.useState("");
  const [LatestPublications, setLatestPublications] = React.useState([]);
  const [topProfiles, setTopProfiles] = React.useState([]);

  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify the signature
      VerifySignature(data);
    },
  });

  const authenticate = async () => {
    // Getting the challenge from the server
    const data = await Lens.getChallenge(address);
    let message = data.data.challenge.text;
    // Signing the challenge with the wallet
    signMessage({ message });
  };

  const VerifySignature = async sign => {
    // Sending the signature to the server to verify
    const response = await Lens.Authenticate(address, sign);
    setRefreshToken(response.data.authenticate.refreshToken);
    setApiToken(response.data.authenticate.accessToken);
    console.log("response", response);
    // {
    //  data: {
    //   authenticate: {
    //    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
    //    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
    //   }
    // }
  };
  const getNewToken = () => {
    Lens.RefreshToken(refreshToken).then(res => {
      // New token (access and refresh token)
      console.log(res);
      setApiToken(res.data.refresh.accessToken);
    });
  };

  const getPublications = () => {
    Lens.ExplorePublications("LATEST", ["POST", "COMMENT", "MIRROR"], 10)
      .then(res => {
        console.log(res);
        setLatestPublications([res.data.explorePublications.items[0].metadata.content]);
        console.log(LatestPublications);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getProfiles = () => {
    Lens.ExploreProfiles("MOST_FOLLOWERS", 10)
      .then(res => {
        console.log(res);
        setTopProfiles([res.data.exploreProfiles.items]);
        console.log(topProfiles);
      })
      .catch(err => {
        console.log("error", err);
      });
  };

  if (isConnected)
    return (
      <div style={{ margin: 32 }}>
        Connected to {ensName ?? address} on WAGMI!
        <div style={{ margin: 32 }}>
          <Button onClick={authenticate}>Get Lens API Token</Button>
        </div>
        <div style={{ margin: 32 }}>
          <Button onClick={getNewToken}>Refresh Token</Button>
        </div>
        <div style={{ margin: 32 }}>
          <Button onClick={getPublications}>Explore Publication</Button>
        </div>
        <div className="col">
          <h1>Latest Posts</h1>
          <p>Hot off the press y&apos;all!</p>
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f1f1f1", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            <div>{LatestPublications}</div>
          </span>
        </div>
        <div>
          <Button onClick={getProfiles}>Explore Profiles</Button>
        </div>
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>🛰</span>
          <b> Api Token Is:</b>
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f1f1f1", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            {apiToken}
          </span>
        </div>
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>🛰</span>
          <b> Refresh Token Is:</b>
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f1f1f1", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            {refreshToken}
          </span>
        </div>
      </div>
    );

  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}
