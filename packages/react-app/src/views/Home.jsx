import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import { iframe, NFTPreview, NFTFullPage } from "@zoralabs/nft-components";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, zdk, address }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  const BAYC = "0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7";

  const yourNFT = zdk.collection({ address: BAYC });

  const [udscVol, SetUdscVol] = React.useState(null);
  const [nftCount, SetnftCount] = React.useState(null);
  const [chainTokenPrice, SetchainTokenPrice] = React.useState(null);
  const [ownerCount, SetownerCount] = React.useState(null);

  const getStats = () => {
    zdk
      .collectionStatsAggregate({ collectionAddress: BAYC })
      .then(res => {
        console.log(res);
        SetUdscVol(res.aggregateStat.salesVolume.usdcPrice);
        SetnftCount(res.aggregateStat.nftCount);
        SetchainTokenPrice(res.aggregateStat.salesVolume.chainTokenPrice);
        SetownerCount(res.aggregateStat.ownerCount);
      })
      .catch(err => {
        console.log(err);
      });
    console.log("yourNFT", yourNFT);
  };

  return (
    <div>
      <div>ZORA API SHOWCASE</div>
      <NFTPreview contract={BAYC} id="25607" />
      <Button onClick={getStats}>Refresh </Button>
      <div style={{ margin: 32 }}>
        <NFTFullPage contract={BAYC} id="25607" />
        <span style={{ marginRight: 8 }}>📝</span>
        VOLUME STATS:
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          <div> USDC VOLUME {udscVol} </div>
          <div> ETH VOLUME {chainTokenPrice}</div>
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        BAYC is held by:
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          {nftCount} Mokees are owned by {ownerCount} accounts
        </span>
      </div>
    </div>
  );
}

export default Home;
