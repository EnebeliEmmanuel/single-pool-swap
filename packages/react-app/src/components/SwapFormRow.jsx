import { useTokenBalance } from "eth-hooks/erc/erc-20/useTokenBalance";
import { utils } from "ethers";

export default function SwapFormRow(props) {
  const valueChangeHandler = e => {
    props.changeValueFunction(e.target.value);
  };

  const imgSrc = props.asset == "ether" ? "ethlogo.png" : "ballogo.png";
  const imgSymbol = props.asset == "ether" ? "ETH" : "BAL";

  const tokenContract = props.contracts && props.contracts["Balloons"];
  const balloonsBalance = useTokenBalance(tokenContract, props.address, 1777);
  const ethBalance = props.yourLocalBalance;

  const balance = props.asset == "ether" ? ethBalance : balloonsBalance;

  let floatBalance = parseFloat("0.00");

  const etherBalance = utils.formatEther(balance);
  parseFloat(etherBalance).toFixed(2);
  floatBalance = parseFloat(etherBalance);
  const displayBalance = floatBalance.toFixed(2);

  return (
    <div className="form-row">
      <input
        type="number"
        step="0.01"
        placeholder="0.0"
        className="swap-row-input"
        value={props.value}
        onChange={e => valueChangeHandler(e)}
      ></input>
      <div className="swap-row-right-group">
        
        <div className="swap-row-dropdown">
          <div className="currency-img">
            <img src={`../../images/${imgSrc}`} height="20px" />
          </div>
          <div className="currency-symbol">{imgSymbol}</div>
        </div>
        <div className="swap-row-balance">
          <p>Balance: {displayBalance}</p>
        </div>
      </div>
    </div>
  );
}
