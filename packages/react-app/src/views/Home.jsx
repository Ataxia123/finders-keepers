import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { List, Button } from "antd";
import Balance from "../components/Balance";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, askContent, Balance, writeContracts, tx, price }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract

  return (
    <List
      bordered
      dataSource={askContent}
      renderItem={item => {
        console.log("IIIIITTTTEEEMMM", item); ////

        const url =
          "https://embed.zora.co/" +
          item.token.collectionAddress +
          "/" +
          item.token.tokenId +
          "?title=false&controls=false&loop=false&autoplay=false";

        return (
          <List.Item>
            <div>
              <div style={{ float: "right" }}>
                <div>
                  <b>{item && item.token && item.token.name}</b>
                </div>
                <Balance value={item.ask.askPrice} price={price} size={20} />
                <Button
                  onClick={async () => {
                    let result = tx(
                      writeContracts["ASKS"].fillAsk(
                        item.token.collectionAddress,
                        item.token.tokenId,
                        item.ask.askCurrency,
                        item.ask.askPrice,
                        readContracts["YourContract"].address, //finder fee will go here
                        { value: item.ask.askPrice },
                      ),
                    );
                    console.log("result", result);
                    console.log("wait", await result);
                  }}
                  size="large"
                  shape="round"
                >
                  <span style={{ marginRight: 8 }} role="img" aria-label="support">
                    💵
                  </span>
                  FILL ASK
                </Button>
              </div>
            </div>
            <div style={{ width: "320px", height: "320px", margin: "0 auto", position: "relative" }}>
              <iframe
                src={url}
                width="100%"
                height="100%"
                scrolling="no"
                allowtransparency="true"
                sandbox="allow-pointer-lock allow-same-origin allow-scripts allow-popups"
              ></iframe>
            </div>
            <div>
              <Button
                onClick={() => {
                  tx(writeContracts.YourContract.curate(item.token.collectionAddress, item.token.tokenId, true));
                }}
                size="large"
                shape="round"
              >
                <span style={{ marginRight: 8 }} role="img" aria-label="support">
                  👍
                </span>
                bussin
              </Button>

              <Button
                onClick={() => {
                  tx(writeContracts.YourContract.curate(item.token.collectionAddress, item.token.tokenId, false));
                }}
                size="large"
                shape="round"
              >
                <span style={{ marginRight: 8 }} role="img" aria-label="support">
                  👎
                </span>
                mid
              </Button>
            </div>
          </List.Item>
        );
      }}
    />
  );
}

export default Home;
