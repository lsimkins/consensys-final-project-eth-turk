pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Destructible.sol";

contract Bounty is Destructible {
  // Note: As noted by remix, "now" can be manipulated by miners.
  // This creation time is used to calculate the end time of the bounty,
  // this should only be an issue when a bounty expiration time is highly sensitive.
  // A different method of calculating end time should be used in those cases.
  uint public creationTime = now;

  // End timestamp of the bounty.
  uint public endTime;

  // Bounty reward, in wei.
  uint public reward;

  // Description of the bounty.
  string public description;

  // Allows iteration through claims.
  // Currently sets an arbitrary limit of 10 claims.
  address[10] public claimants;

  // Number of claims on this bounty.
  // Tracked in a de-normalized way for efficiency.
  uint public numberClaims = 0;

  // Mapping of claimant addresses to their respective claims.
  mapping( address => Claim ) claims;

  // Winner if this bounty, if any.
  address public winner;

  struct Claim {
    address claimant;
    string validation;
    bool isActive;
  }

  enum Stage {
    AcceptingClaims,
    ClosedInReview,
    ClosedAwaitingWithdrawal,
    ClosedFinalized
  }

  Stage public stage = Stage.AcceptingClaims;

  // Circuit Breaker
  // Normally, this standard functionality would come from a library,
  // but it is implemented here for demonstration purposes.
  bool public paused = false;
  event ContractPaused();
  event ContractUnpaused();
  modifier onlyWhenNotPaused() {
    require(!paused, "Contract is paused.");
    _;
  }
  modifier onlyWhenPaused() {
    require(paused, "May only be called when contract is paused.");
    _;
  }
  /**
   * @dev Pauses this contract. **Important: Does not extend time limit.***
   */
  function pause()
    public
    onlyByOwner()
    onlyWhenNotPaused()
  {
    paused = true;
    emit ContractPaused();
  }

  /**
   * @dev Unpauses this contract.
   */
  function unpause()
    public
    onlyByOwner()
    onlyWhenPaused()
  {
    paused = false;
    emit ContractUnpaused();
  }

  // Emitted when a user has placed a new claim on this bounty.
  event NewBountyClaim(address claimant, string validation);

  // Emitted when the owner accepts a claim on this bounty.
  event BountyWon(address winner);

  // Emitted when the bounty change changes.
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

  modifier mayAcceptMoreClaims() {
    require(numberClaims < 10, "No other claims may be made to this contract.");
    _;
  }

  /**
   * @dev Contructor for a new Bounty contract.
   * @param _reward The bounty reward. Make sure the message contains enough wei to cover the reward.
   * @param _description Description of completion requirements to win this bounty.
   * @param timeLimitSeconds Time limit for bounty to be completed within.
   */
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

  /**
   * @dev Returns a specific bounty claim.
   * @param from The claimant address.
   * @return claimant The claimant address
   * @return proof    Claimant proof of completing bounty.
   * @return isActive Is the claim active?
   */
  function findClaim(address from)
    public
    view
    onlyByOwner()
    returns (address claimant, string proof, bool isActive)
  {
    return claimAsTuple(claims[from]);
  }

  /**
   * @dev Returns the msg sender's claim.
   * @return claimant The claimant address.
   * @return proof    Claimant proof of completing bounty.
   * @return isActive Is the claim active?
   */
  function myClaim()
    public
    view
    returns (address claimant, string proof, bool isActive)
  {
    return claimAsTuple(claims[msg.sender]);
  }

  /**
   * @dev Returns addresses of all claims.
   * @return allClaimAddresses
   */
  function allClaims()
    public
    view
    returns (address[10] allClaimAddresses)
  {
    return claimants;
  }

  /**
   * @dev Closes this contract before expiration for review of claims.
   */
  function closeForReview()
    public
    onlyWhenNotPaused()
    atStage(Stage.AcceptingClaims)
    onlyByOwner()
  {
    setStage(Stage.ClosedInReview);
  }

  /**
   * @dev Submits a claim to this bounty.
   * @param validation Sender's proof of completion.
   */
  function submitClaim(string validation)
    public
    onlyWhenNotPaused()
    mayAcceptMoreClaims()
    checkStage()
    atStage(Stage.AcceptingClaims)
    notBy(owner)
    notClaimant(msg.sender, "Sender is already a claimant of this bounty.")
  {
    numberClaims += 1;
    Claim memory newClaim = Claim(msg.sender, validation, true);
    claims[msg.sender] = newClaim;
    claimants[numberClaims] = msg.sender;

    emit NewBountyClaim(newClaim.claimant, newClaim.validation);
  }

  /**
   * @dev Accepts an claimant's claim to this bounty, and marks them as the winner.
   * @param claimant Address of winning claimant.
   */
  function acceptClaim(address claimant)
    public
    onlyWhenNotPaused()
    checkStage()
    atStage(Stage.ClosedInReview)
    onlyByOwner()
    isClaimant(claimant)
  {
    setStage(Stage.ClosedAwaitingWithdrawal);
    winner = claimant;

    emit BountyWon(winner);
  }

  /**
   * @dev Sends the bounty award to the bounty winner.
   */
  function sendAward()
    public
    onlyWhenNotPaused()
    atStage(Stage.ClosedAwaitingWithdrawal)
    onlyByEither(owner, winner, "Only owner or winner may trigger award withdrawal.")
  {
    setStage(Stage.ClosedFinalized);
    winner.transfer(reward);
  }

  /**
   * @dev Sets the current bounty stage.
   */
  function setStage(Stage _stage)
    internal
    onlyWhenNotPaused()
  {
    stage = _stage;
    emit StageChanged(stage);
  }

  /**
   * @dev Formats a claim struct as a tuple.
   */
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
}