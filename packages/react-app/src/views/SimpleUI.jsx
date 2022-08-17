import React from "react";
import { Tabs } from "../components";

export default function SimpleUI(props) {
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

  return (
    <div className="simpleUI">
      <Tabs
        page={page}
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
    </div>
  );
}
