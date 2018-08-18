pragma solidity ^0.4.24;

import "./Bounty.sol";

contract BountyRegistry {
  address public owner = msg.sender;
  uint public creationTime = now;

  address[] public bounties;
  event BountyCreated(address contractAddress);

  function createBounty(
    uint _reward,
    string _description,
    uint timeLimitSeconds
  )
    public
    payable
    returns (address newContract)
  {
    Bounty newBounty = (new Bounty).value(msg.value)(_reward, _description, timeLimitSeconds);
    newBounty.transferOwnership(msg.sender);
    bounties.push(newBounty);
    emit BountyCreated(address(newBounty));

    return address(newBounty);
  }

  function getBounties()
    public
    view
    returns (address[] allBounties)
  {
    return bounties;
  }
}