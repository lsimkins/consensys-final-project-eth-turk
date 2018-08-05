pragma solidity ^0.4.24;

contract Bounty {
  address public owner = msg.sender;
  uint public creationTime = now;
  uint public endTime;

  uint public reward;
  string public description;

  struct Claim {
    address claimant;
    string validation;
    bool isActive;
  }

  // Allows iteration through claims.
  // Currently sets an arbitrary limit of 100 claims.
  address[100] claimants;
  uint public numberClaims = 0;
  mapping( address => Claim ) claims;
  address winner;

  enum Stage {
    AcceptingClaims,
    ClosedInReview,
    ClosedAwaitingWithdrawal,
    ClosedFinalized
  }
  Stage stage = Stage.AcceptingClaims;

  event NewBountyClaim(address claimant, string validation);

  modifier onlyBy(address account) {
    require(msg.sender == account);
    _;
  }

  modifier onlyByEither(address account1, address account2) {
    require(msg.sender == account1 || msg.sender == account2);
    _;
  }

  modifier notBy(address account) {
    require(msg.sender != account);
    _;
  }

  modifier isClaimant(address maybeClaimant) {
    require(claims[maybeClaimant].isActive);
    _;
  }

  modifier notClaimant(address maybeClaimant) {
    require(!claims[maybeClaimant].isActive);
    _;
  }

  modifier atStage(Stage _stage) {
    require(stage == _stage);
    _;
  }

  modifier checkStage() {
    if (stage == Stage.AcceptingClaims && now >= endTime) {
      setStage(Stage.ClosedInReview);
    }
    _;
  }

  function setStage(Stage _stage) internal {
    stage = _stage;
  }

  function claimAsTuple(Claim claim)
    internal
    pure
    returns(address, string, bool)
  {
    return (
      claim.claimant,
      claim.validation,
      claim.isActive
    );
  }

  constructor(
    uint _reward,
    string _description,
    uint timeLimitSeconds
  ) public {
    reward = _reward;
    description = _description;
    endTime = creationTime + timeLimitSeconds;
  }

  function allClaims()
    public
    view
    onlyBy(owner)
    returns (address[100])
  {
    return claimants;
  }

  function findClaim(address from)
    public
    view
    onlyBy(owner)
    returns (address, string, bool)
  {
    return claimAsTuple(claims[from]);
  }

  function myClaim()
    public
    view
    returns (address, string, bool)
  {
    return claimAsTuple(claims[msg.sender]);
  }

  function transferOwnership(address to)
    public
    onlyBy(owner)
  {
    owner = to;
  }

  function submitClaim(string validation)
    public
    checkStage()
    atStage(Stage.AcceptingClaims)
    notBy(owner)
    notClaimant(msg.sender)
  {
    Claim memory newClaim = Claim(msg.sender, validation, true);
    claims[msg.sender] = newClaim;
    claimants[numberClaims] = msg.sender;
    numberClaims += 1;

    emit NewBountyClaim(newClaim.claimant, newClaim.validation);
  }

  function acceptClaim(address claimant)
    public
    checkStage()
    atStage(Stage.ClosedInReview)
    onlyBy(owner)
    isClaimant(claimant)
  {
    setStage(Stage.ClosedAwaitingWithdrawal);
    winner = claimant;
  }

  function sendAward()
    public
    atStage(Stage.ClosedAwaitingWithdrawal)
    onlyByEither(owner, winner)
  {
    setStage(Stage.ClosedFinalized);
    winner.transfer(reward);
  }
}