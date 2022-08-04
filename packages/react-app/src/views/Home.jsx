import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

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

  const BAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

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
      <Button onClick={getStats}>Refresh </Button>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        BAYC is held by:
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          {udscVol} accounts that own {nftCount}Mokees
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        BAYC is held by:
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          {chainTokenPrice} accounts that own {ownerCount}Mokees
        </span>
      </div>
    </div>
  );
}

export default Home;
