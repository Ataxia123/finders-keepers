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
    console.log(response);

    // {
    //  data: {
    //   authenticate: {
    //    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
    //    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
    //   }
    // }
  };

  if (isConnected)
    return (
      <div>
        Connected to {ensName ?? address}
        <div>
          <Button onClick={authenticate}>Login</Button>
        </div>
      </div>
    );

  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}
