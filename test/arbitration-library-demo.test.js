const Arbitration = artifacts.require("./Arbitration.sol");
const Bounty = artifacts.require("./Bounty.sol");
const { catchRevert } = require('./exceptions.test.js');

const Verdicts = {
  0: "Pending",
  1: "FinalNoChange",
  2: "FinalBountyReopened",
  3: "FinalAwardRevoked",
  4: "FinalAwardSplit",
  5: "FinalWinnerChanged"
};

/**
 * These tests were chosen to test basic arbitration.
 * Since the arbitration contract is meant to demonstrate library usage,
 * these test for only very basic functionality.
 */
contract("Arbitration", function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  let arbitration;

  it("should create a new arbitration contract with", async () => {
    const bounty = await Bounty.deployed();
    const contract  = await Arbitration.new(bob, bounty.address);
    const [ arbitor, bountyAddress ] = await contract.dispute.call();

    expect(arbitor).to.be.equal(bob);
    expect(bountyAddress).to.be.equal(bounty.address);
  });

  it("should create a new arbitration with the verdict pending", async () => {
    const bounty = await Bounty.deployed();
    const contract  = await Arbitration.new(bob, bounty.address);
    const [ arbitor, bountyAddress, verdict ] = await contract.dispute.call();

    expect(Verdicts[verdict]).to.be.equal("Pending");
  });

  it("should allow the arbitor to make a verdict", async () => {
    const bounty = await Bounty.deployed();
    const contract = await Arbitration.new(bob, bounty.address);
    await contract.dispute.call();

    await contract.declareVerdict(1, { from: bob });

    const [ arbitor, bountyAddress, verdict ] = await contract.dispute.call();

    expect(Verdicts[verdict]).to.be.equal("FinalNoChange");
  });

  it("should prevent any other address from declaring a verdict", async () => {
    const bounty = await Bounty.deployed();
    const contract = await Arbitration.new(bob, bounty.address);
    await contract.dispute.call();

    await catchRevert(contract.declareVerdict(2, { from: alice }));
    await catchRevert(contract.declareVerdict(3, { from: owner }));
  });

  it("should prevent additional changes once a verdict has been declared", async () => {
    const bounty = await Bounty.deployed();
    const contract = await Arbitration.new(bob, bounty.address);
    await contract.dispute.call();

    await contract.declareVerdict(4, { from: bob });
    await catchRevert(contract.declareVerdict(2, { from: bob }));
  });
});
