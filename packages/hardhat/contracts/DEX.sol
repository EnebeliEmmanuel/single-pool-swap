// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

error notEnoughLiquidity(uint256 requested, uint256 liquidity);

/**
 * @title DEX Template
 * @author kokocodes
 * @dev We want to create an automatic market where our contract will hold reserves of both ETH and 🎈 Balloons. These reserves will provide liquidity that allows anyone to swap between the assets.
 */

contract DEX {
    /* ========== GLOBAL VARIABLES ========== */

    using SafeMath for uint256; //outlines use of SafeMath for uint256 variables
    IERC20 token; //instantiates the imported contract
    uint256 public totalLiquidity; //total amount of liquidity provider tokens (LPTs) minted (NOTE: that LPT "price" is tied to the ratio, and thus price of the assets within this AMM)
    mapping(address => uint256) public liquidity; //liquidity of each depositor

    /* ========== EVENTS ========== */

    /**
     * @notice Emitted when ethToToken() swap transacted
     */
    event EthToTokenSwap(
        address sender,
        string message,
        uint256 ethAmount,
        uint256 tokenOutput
    );

    /**
     * @notice Emitted when tokenToEth() swap transacted
     */
    event TokenToEthSwap(
        address sender,
        string message,
        uint256 ethOutput,
        uint256 tokenInput
    );

    /**
     * @notice Emitted when liquidity provided to DEX and mints LPTs.
     */
    event LiquidityProvided(
        address sender,
        uint256 liquidityAdded,
        uint256 ethAdded,
        uint256 tokenAdded
    );

    /**
     * @notice Emitted when liquidity removed from DEX and decreases LPT count within DEX.
     */
    event LiquidityRemoved(
        address receiver,
        uint256 amount,
        uint256 ethRemoved,
        uint256 tokenRemoved
    );


    /* ========== CONSTRUCTOR ========== */

    constructor(address token_addr) public {
        token = IERC20(token_addr); //specifies the token address that will hook into the interface and be used through the variable 'token'
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @notice initializes amount of tokens that will be transferred to the DEX itself from the erc20 contract mintee (and only them based on how Balloons.sol is written). Loads contract up with both ETH and Balloons.
     * @param tokens amount to be transferred to DEX
     * @return totalLiquidity is the number of LPTs minting as a result of deposits made to DEX contract
     * NOTE: since ratio is 1:1, this is fine to initialize the totalLiquidity (wrt to balloons) as equal to eth balance of contract.
     */
    function init(uint256 tokens) public payable returns (uint256) {
        require(totalLiquidity == 0, "DEX: init - already has liquidity");
        totalLiquidity = address(this).balance;
        liquidity[msg.sender] = totalLiquidity;
        require(
            token.transferFrom(msg.sender, address(this), tokens),
            "DEX: init - transfer did not transact"
        );
        require(
            token.transferFrom(
                msg.sender,
               address(this),
                tokens
            ),
            "DEX: init - didn't send me ballons"
        );
        return totalLiquidity;
    }

    /**
     * @notice returns yOutput, or yDelta for xInput (or xDelta)
     */

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset

    function price(
        uint256 xInput,
        uint256 xReserves,
        uint256 yReserves
    ) public pure returns (uint256 yOutput) {
   // x * y = k
    // x + dx * y - dy = k


    // y - dy = k / (x + dx)
    // dy = k / (x + dx)
    //dy = k / (x + dx) - y


    // x * y = k
   
    // dy = x * y / (x + dx) - y
    // dy = x * y / dx

        uint256 xInputWithFee = xInput.mul(997);
        uint256 numerator = xInputWithFee.mul(yReserves);
        uint256 denominator = (xReserves.mul(1000)).add(xInputWithFee);
        return (numerator / denominator);
    }

    


    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset

    function inversePrice(
        uint256 desiredOutput,
        uint256 xReserves,
        uint256 yReserves
    ) public pure returns (uint256 requiredInput) {
        require(desiredOutput < xReserves);
        uint256 numerator = xReserves.mul(desiredOutput).mul(1000);
        uint256 denominator = yReserves.sub(desiredOutput).mul(997);
        requiredInput = (numerator / denominator).add(1);

        return requiredInput;
    }

    /**
     * @notice returns liquidity for a user. Note this is not needed typically due to the `liquidity()` mapping variable being public and having a getter as a result. This is left though as it is used within the front end code (App.jsx).
     */
    function getLiquidity(address lp) public view returns (uint256) {
        //return liquidity[lp];
    }
    /**
     * @notice sends Ether to DEX in exchange for $BAL
     */
    function ethToToken() public payable returns (uint256 tokenOutput) {
        require(msg.value > 0, "cannot swap 0 ETH");
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 tokenReserve = token.balanceOf(address(this));
        tokenOutput = price(msg.value, ethReserve, tokenReserve);

        require(
            token.transfer(msg.sender, tokenOutput),
            "ethToToken(): reverted swap."
        );
        emit EthToTokenSwap(
            msg.sender,
            "Eth to Balloons",
            msg.value,
            tokenOutput
        );
        return tokenOutput;
    }

    function estimateEthToToken(uint256 ethInput)
        public
        view
        returns (uint256 tokenOutput)
    {
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        tokenOutput = price(ethInput, ethReserve, tokenReserve);

        return tokenOutput;
    }

    function estimateEthRequiredForTokens(uint256 desiredOutput)
        public
        view
        returns (uint256 inputRequired)
    {
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        if (desiredOutput > tokenReserve) {
            revert notEnoughLiquidity({
                requested: desiredOutput,
                liquidity: tokenReserve
            });
        }

        inputRequired = inversePrice(desiredOutput, ethReserve, tokenReserve);

        return inputRequired;
    }

    /**
     * @notice sends $BAL tokens to DEX in exchange for Ether
     */
    function tokenToEth(uint256 tokenInput) public returns (uint256 ethOutput) {
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        ethOutput = price(tokenInput, tokenReserve, ethReserve);
        require(
            token.transferFrom(msg.sender, address(this), tokenInput),
            "tokenToEth(): reverted swap."
        );
        (bool sent, ) = msg.sender.call{value: ethOutput}("");
        require(sent, "tokenToEth: revert in transferring eth to you!");
        emit TokenToEthSwap(
            msg.sender,
            "Balloons to ETH",
            ethOutput,
            tokenInput
        );
        return ethOutput;
    }

    function estimateTokenToEth(uint256 tokenInput)
        public
        view
        returns (uint256 ethOutput)
    {
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        ethOutput = price(tokenInput, tokenReserve, ethReserve);
        return ethOutput;
    }

    function estimateTokensRequiredForEth(uint256 desiredOutput)
        public
        view
        returns (uint256 inputRequired)
    {
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        if (desiredOutput > ethReserve) {
            revert notEnoughLiquidity({
                requested: desiredOutput,
                liquidity: ethReserve
            });
        }

        inputRequired = inversePrice(desiredOutput, tokenReserve, ethReserve);

        return inputRequired;
    }

    /**
     * @notice allows deposits of $BAL and $ETH to liquidity pool
     * NOTE: parameter is the msg.value sent with this function call. That amount is used to determine the amount of $BAL needed as well and taken from the depositor.
     * NOTE: user has to make sure to give DEX approval to spend their tokens on their behalf by calling approve function prior to this function call.
     * NOTE: Equal parts of both assets will be removed from the user's wallet with respect to the price outlined by the AMM.
     */
    function deposit() public payable returns (uint256 tokensDeposited) {
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokenDeposit;

        tokenDeposit = (msg.value.mul(tokenReserve) / ethReserve).add(1);
        uint256 liquidityMinted = msg.value.mul(totalLiquidity) / ethReserve;

        liquidity[msg.sender] = liquidity[msg.sender].add(liquidityMinted);
        totalLiquidity = totalLiquidity.add(liquidityMinted);

        require(token.transferFrom(msg.sender, address(this), tokenDeposit));
        emit LiquidityProvided(
            msg.sender,
            liquidityMinted,
            msg.value,
            tokenDeposit
        );
        return tokenDeposit;
    }

    /**
     * @notice allows withdrawal of $BAL and $ETH from liquidity pool
     * NOTE: with this current code, the msg caller could end up getting very little back if the liquidity is super low in the pool. I guess they could see that with the UI.
     */
    function withdraw(uint256 amount)
        public
        returns (uint256 eth_amount, uint256 token_amount)
    {
        require(
            liquidity[msg.sender] >= amount,
            "Withdraw: revert - not enough liquidity to withdraw"
        );

        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethToWithdraw;
        uint256 tokenToWithdraw;

        ethToWithdraw = amount.mul(ethReserve) / totalLiquidity;
        tokenToWithdraw = amount.mul(tokenReserve) / totalLiquidity;

        liquidity[msg.sender] = liquidity[msg.sender].sub(amount);
        totalLiquidity = totalLiquidity.sub(amount);

        require(
            token.transfer(msg.sender, tokenToWithdraw),
            "Withdraw: revert in transferring token"
        );
        (bool sent, ) = msg.sender.call{value: ethToWithdraw}("");
        require(sent, "Withdraw: revert in transferring Eth");

        emit LiquidityRemoved(
            msg.sender,
            amount,
            ethToWithdraw,
            tokenToWithdraw
        );
        return (ethToWithdraw, tokenToWithdraw);
    }
}
