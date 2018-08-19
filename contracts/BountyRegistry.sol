pragma solidity ^0.4.24;

import "./Bounty.sol";

/**
  Registry of all bounties.
  This registry also acts as a bounty factory contract.
  Presently, this registry makes no decisions on garbage collection or archiving
  of closed/destroyed bounties.
 */
contract BountyRegistry {
  address public owner = msg.sender;
  uint public creationTime = now;

  address[] public bounties;
  uint256 public bountyCount = 0;
  event BountyCreated(address contractAddress);

  modifier greaterThanZero(uint number, string errorMsg) {
    require(number > 0, errorMsg);
    _;
  }

  /**
   * @dev Creates a bounty, adds it to the registry, and returns the address of the
   * new bounty contract.
   * @param _reward          The bounty reward.
   * @param _description     Description of completion requirements to win this bounty.
   * @param timeLimitSeconds Bounty time limit in seconds.
   * @return newContract Address of the new bounty contract.
   */
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
    bountyCount += 1;
    emit BountyCreated(address(newBounty));

    return address(newBounty);
  }

  /**
   * @dev Returns address of all active bounties.
   * Warning: This method would become prohibitively expensive over time.
   * getPaginatedBounties() is a better method of requesting bounties.
   * @return address[] All bounties registered with this registry.
   */
  function getBounties()
    public
    view
    returns (address[] allBounties)
  {
    return bounties;
  }

  /**
   * @dev Returns bounties in a paginated manner.
   * @return address[] All bounties registered with this registry.
   */
  function getPaginatedBounties(uint pageNum, uint resultsPerPage)
    public
    view
    greaterThanZero(pageNum, "Page number must be an integer greater than 0.")
    returns (address[])
  {
    uint pageIndex = (pageNum - 1) * resultsPerPage;

    if (bounties.length == 0 || pageIndex > bountyCount - 1) {
      return new address[](0);
    }

    address[] memory bountyPage = new address[](resultsPerPage);
    uint pageCounter = 0;

    for (
      pageIndex;
      pageIndex < resultsPerPage * pageNum && pageIndex < bountyCount - 1;
      pageIndex++
    ) {
      bountyPage[pageCounter] = bounties[pageIndex];
      pageCounter++;
    }

    return bountyPage;
  }
}