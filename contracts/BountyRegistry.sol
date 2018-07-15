pragma solidity ^0.4.24;

import "./Bounty.sol";

contract BountyRegistry {
  address public owner = msg.sender;
  uint public creationTime = now;

  Bounty test;

  function createBounty(
    uint _reward,
    string _description,
    uint timeLimitSeconds
  )
    public
    returns (address newContract)
  {
    test = new Bounty(_reward, _description, timeLimitSeconds);

    return test;
  }
}