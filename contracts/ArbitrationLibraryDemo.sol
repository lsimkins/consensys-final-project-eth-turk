pragma solidity ^0.4.24;

/**
  This file is a library usage demo, not intended to represent a fully functional
  arbitration process.
 */

/**
  Aribitration Library contract containing re-usable arbitration functions and structs.
 */
library ArbitrationLib {
  /**
    Contains data representing a single dispute in arbitration.
   */
  struct Dispute {
    // The arbitor of the dispute who determines the verdict.
    address arbitor;
    // Address of the bounty in dispute.
    address bounty;
    // Verdict of the dispute.
    Verdict verdict;
  }

  /**
    Contains data representing a single dispute in arbitration.
   */
  enum Verdict {
    Pending,
    FinalNoChange,
    FinalBountyReopened,
    FinalAwardRevoked,
    FinalAwardSplit,
    FinalWinnerChanged
  }

  modifier onlyBy(address account) {
    require(account == msg.sender, "You may not perform this action");
    _;
  }

  modifier mustBePending(Dispute self) {
    require(self.verdict == Verdict.Pending, "Verdict must be pending.");
    _;
  }

  /**
   * @dev Declares a verdict for a bounty dispute.
   * @return dispute The relevant dispute.
   * @return verdict Verdict of the arbitration.
   */
  function declareVerdict(Dispute storage self, Verdict verdict)
    internal
    onlyBy(self.arbitor)
    mustBePending(self)
  {
    self.verdict = verdict;
  }
}

contract Arbitration {
  using ArbitrationLib for ArbitrationLib.Dispute;

  ArbitrationLib.Dispute public dispute;

  /**
   * @dev Condtructor for an arbitration contract.
   * @param arbitor Address of arbitor over the dispute.
   * @param bounty  Address disputed bounty contract.
   */
  constructor(address arbitor, address bounty)
    public
  {
    dispute = ArbitrationLib.Dispute(
      arbitor,
      bounty,
      ArbitrationLib.Verdict.Pending
    );
  }

  /**
   * @dev Declares a verdict for a bounty dispute.
   * This method relies on a valid cast of uint256 to a enum Verdict.
   * If an invalid verdict is specified, an exception will be thrown and the call reverted.
   * @return verdict Verdict of the arbitration.
   */
  function declareVerdict(uint256 verdict)
    public
  {
    return dispute.declareVerdict(ArbitrationLib.Verdict(verdict));
  }
}