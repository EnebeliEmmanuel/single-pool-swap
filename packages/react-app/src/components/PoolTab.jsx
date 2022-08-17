import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import PoolFormRow from "./PoolFormRow";

const contractName = "DEX";
const tokenName = "Balloons";

export default function PoolTab(props) {

  const tx = props.tx;
  const writeContracts = props.writeContracts;


  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [addingLiquidity, setAddingLiquidity] = useState(true);
  const [addressApproved, setAddressApproved] = useState(true);

  

  const changeAddLiquidity = async value => {

    let valuePlusExtra = ethers.utils.parseEther("" + value * 1.03);

  let allowance = await props.readContracts[tokenName].allowance(
   props.address,
       props.readContracts[contractName].address,
    );
    setLiquidityAmount(value);
    setAddingLiquidity(true);
    if (allowance.lt(valuePlusExtra)) {
      setAddressApproved(false);
    } else {
      setAddressApproved(true);
    }
  }

  const changeWithdrawLiquidity = value => {
      setLiquidityAmount(value);
      setAddingLiquidity(false);
   
      }

  const depositLiquidity = async (value) => {
   console.log(`Depositing ${liquidityAmount} of liquidity`)

     let valueInEther = ethers.utils.parseEther("" + value);
 
    await tx(writeContracts[contractName]["deposit"]({ value: valueInEther, gasLimit: 200000 }));
    setLiquidityAmount("");
    }

 
  
  const withdrawLiquidity = async (value) => {
     console.log(`Withdrawing ${liquidityAmount} of liquidity`)

  
    let valueInEther = ethers.utils.parseEther("" + value);
     let withdrawTxResult = await tx(writeContracts[contractName]["withdraw"](valueInEther));
     console.log("withdrawTxResult:", withdrawTxResult);
     setLiquidityAmount("");

  }
  const approveDeposit = async (value) => {


    
    console.log(`Approving ${liquidityAmount} to be spent`)

    let valuePlusExtra = ethers.utils.parseEther("" + value * 1.03);
  
 
   
     await tx(
        writeContracts[tokenName].approve(props.readContracts[contractName].address, valuePlusExtra, {
        gasLimit: 200000,
        }),
     );
     

    setAddressApproved(true);
  }

  return (
    <div className="simple-ui-card">
      
      <div className="form-group">
        <div className="form-heading"> Add Liquidity</div>
        <PoolFormRow
          changeValueFunction={changeAddLiquidity}
          value={addingLiquidity == true ? liquidityAmount : ""}
          approvalNeeded={!addressApproved}
          executeFunction={depositLiquidity}
          approvalFunction={approveDeposit}
          buttonLabel={"Deposit"}
        />
       
        <div className="form-heading"> Withdraw Liquidity</div>

        <PoolFormRow
          changeValueFunction={changeWithdrawLiquidity}
          value={addingLiquidity == false ? liquidityAmount : ""}
          approvalNeeded={false}
          executeFunction={withdrawLiquidity}
          buttonLabel={"Withdraw"}
        />

      </div>
    </div>
  );
};

