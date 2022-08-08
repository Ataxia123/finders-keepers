import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { List, Button } from "antd";
import Balance from "../components/Balance";
import { iframe, NFTFullPage, NFTPreview } from "@zoralabs/nft-components";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ zdk, address, yourLocalBalance, readContracts, askContent, Balance, writeContracts, tx, price, asks }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contrac

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
      <List
        bordered
        dataSource={askContent}
        renderItem={item =>
          item.token ? (
            <List.Item>
              <NFTPreview contract={item.token.collectionAddress} id={item.token.tokenId} />
              <List.Item.Meta title={item.collectionAddress} description={item.token.content} />
            </List.Item>
          ) : (
            "No tokens yet"
          )
        }
      />
    </div>
  );
}
export default Home;
