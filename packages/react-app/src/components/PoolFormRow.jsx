import React, { useState } from "react";
import {Button} from "antd";


export default function PoolFormRow(props) {
  const valueChangeHandler = e => {
    props.changeValueFunction(e.target.value);
  };

  const approvalHandler = () => {
    props.approvalFunction(props.value);
   
  };
  const executeHandler = () => {
    props.executeFunction(props.value);
  };


  return (
    <div className="form-row">
      <input
        type="number"
        step="0.01"
        placeholder="0.0"
        className="pool-row-input"
        value= {props.value} 
        onChange={e => valueChangeHandler(e)}
      ></input>
      
     <div>
      {props.approvalNeeded ? <input type="button" className="btn-approve" value="Approve" onClick={approvalHandler}/>: <input type="button" className="btn-pool-execute" disabled={props.value == 0 || props.value == ""} value={props.buttonLabel} onClick={executeHandler}/>}
      </div>
    </div>
  );
}
