pragma solidity ^0.4.24;

contract Bounty {
  address public owner = msg.sender;

  // Note: As noted by remix, "now" can be manipulated by miners.
  // This creation time is used to calculate the end time of the bounty,
  // this should only be an issue when a bounty expiration time is highly sensitive.
  // A different method of calculating end time should be used in those cases.
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
  // Currently sets an arbitrary limit of 10 claims.
  address[10] claimants;
  uint public numberClaims = 0;
  mapping( address => Claim ) claims;
  address public winner;

  enum Stage {
    AcceptingClaims,
    ClosedInReview,
    ClosedAwaitingWithdrawal,
    ClosedFinalized
  }
  Stage public stage = Stage.AcceptingClaims;

  event NewBountyClaim(address claimant, string validation);
  event BountyWon(address claimant);
  event StageChanged(Stage stage);

  modifier onlyBy(address account, string errorMsg) {
    require(msg.sender == account, errorMsg);
    _;
  }

  modifier onlyByOwner() {
    require(msg.sender == owner, "Only the bounty owner can perform this action.");
    _;
  }

  modifier onlyByEither(address account1, address account2, string errorMsg) {
    require(msg.sender == account1 || msg.sender == account2, errorMsg);
    _;
  }

  modifier notBy(address account) {
    require(msg.sender != account, "Message sender may not perform this action");
    _;
  }

  modifier isClaimant(address maybeClaimant) {
    require(claims[maybeClaimant].isActive, "Address must be a valid bounty claimant.");
    _;
  }

  modifier notClaimant(address maybeClaimant, string errorMsg) {
    require(!claims[maybeClaimant].isActive, errorMsg);
    _;
  }

  modifier atStage(Stage _stage) {
    require(stage == _stage, "Contract is not in the correct stage.");
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
    emit StageChanged(stage);
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
  ) public payable {
    require(msg.value >= reward, "Bounty reward must be sent with contract");
    reward = _reward;
    description = _description;
    endTime = creationTime + timeLimitSeconds;
  }

  function allClaims()
    public
    view
    onlyByOwner()
    returns (address[10])
  {
    return claimants;
  }

  function findClaim(address from)
    public
    view
    onlyByOwner()
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
    onlyByOwner()
  {
    owner = to;
  }

  function closeForReview()
    public
    atStage(Stage.AcceptingClaims)
    onlyByOwner()
  {
    setStage(Stage.ClosedInReview);
  }

  function submitClaim(string validation)
    public
    checkStage()
    atStage(Stage.AcceptingClaims)
    notBy(owner)
    notClaimant(msg.sender, "Sender is already a claimant of this bounty.")
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
    onlyByOwner()
    isClaimant(claimant)
  {
    setStage(Stage.ClosedAwaitingWithdrawal);
    winner = claimant;

    emit BountyWon(winner);
  }

  function sendAward()
    public
    atStage(Stage.ClosedAwaitingWithdrawal)
    onlyByEither(owner, winner, "Only owner or winner may trigger award withdrawal.")
  {
    setStage(Stage.ClosedFinalized);
    winner.transfer(reward);
  }
}