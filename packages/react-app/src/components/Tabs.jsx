import React, { useState, useEffect } from "react";
import SwapTab from "./SwapTab";
import PoolTab from "./PoolTab";
import { Button, Col, Menu, Row, List } from "antd";
import { Redirect, Link, Route, Switch, useLocation, useHistory, useRouteMatch } from "react-router-dom";

const Tabs = props => {
  const page = props.page;
  const tx = props.tx;
  const writeContracts = props.writeContracts;
  const localProvider = props.localProvider;
  const mainnetProvider = props.mainnetProvider;
  const blockExplorer = props.blockExplorer;
  const address = props.address;
  const readContracts = props.readContracts;
  const contractConfig = props.contractConfig;
  const userSigner = props.signer;
  const price = props.price;
  const yourLocalBalance = props.yourLocalBalance;

  console.log(`page variable = ${page}`);
  const [activeTab, setActiveTab] = useState("page");
  console.log(`active tab = ${activeTab}`);


  const ifPoolTabActive = activeTab === "pool" ? true : false;
  const ifSwapTabActive = activeTab === "swap" ? true : false;

  //when the route changes, update the active tab state variable to ensure that the correct tab is highlighted
  let match = useRouteMatch("/:page");
  useEffect(() => {
    //runs when path changes
    console.log("my matching function went at least");

    if (match == null) {
      // handle /app/ case
      setActiveTab("swap");
    } else {
      setActiveTab(match.params.page);
    }
  }, [match]);

  //  Functions to handle Tab Switching
  const handleSwapTab = () => {
    // update the state to tab1
    setActiveTab("swap");
  };
  const handlePoolTab = () => {
    // update the state to tab2
    setActiveTab("pool");
  };


  return (
    <div className="tabs">
      <div className="tabNav">
        <Link to="/swap">
          <span onClick={handleSwapTab}>
            <div className={`tabNavItem ${ifSwapTabActive ? "activeTab" : ""}`}>
              <p>Swap</p>
            </div>
          </span>
        </Link>

        <Link to="/pool">
          <span onClick={handlePoolTab}>
            <div className={`tabNavItem ${ifPoolTabActive ? "activeTab" : ""}`}>
              <p>Pool</p>
            </div>
          </span>
        </Link>
      </div>

      {ifSwapTabActive ? (
        <SwapTab
          tx={tx}
          writeContracts={writeContracts}
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
          blockExplorer={blockExplorer}
          address={address} //this is causing issues
          readContracts={readContracts} //this is causing issues
          contractConfig={contractConfig}
          signer={userSigner}
          price={price}
          yourLocalBalance={yourLocalBalance}
        />
      ) : (
        <PoolTab
          tx={tx}
          writeContracts={writeContracts}
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
          blockExplorer={blockExplorer}
          address={address} //this is causing issues
          readContracts={readContracts} //this is causing issues
          contractConfig={contractConfig}
          signer={userSigner}
          price={price}
        />
      )}

      {/* <Switch>
        <Route exact path="/app">
          <Redirect to="/app/swap" />
        </Route>
        <Route path="/app/swap">
          <SwapTab
            tx={tx}
            writeContracts={writeContracts}
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            address={address} //this is causing issues
            readContracts={readContracts} //this is causing issues
            contractConfig={contractConfig}
            signer={userSigner}
            price={price}
            yourLocalBalance={yourLocalBalance}
          />
        </Route>
        <Route path="/app/pool">
          <PoolTab
            tx={tx}
            writeContracts={writeContracts}
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            address={address} //this is causing issues
            readContracts={readContracts} //this is causing issues
            contractConfig={contractConfig}
            signer={userSigner}
            price={price}
          />
        </Route>
      </Switch> */}
    </div>
  );
};
export default Tabs;
