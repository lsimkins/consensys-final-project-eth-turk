const { catchRevert } = require('./exceptions.test.js');

const Bounty = artifacts.require("./Bounty.sol");

/**
 * These tests were chosen to test the lifecycle of a bounty, from creation to final award.
 * Tests are also written to verify contract restricts actions against the contract
 * to specific users and contract lifecycle stages.
 */
contract("Bounty", function(accounts) {
  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  let newBounty;
  const newBountyReward = 100;
  beforeEach(() => {
    return Bounty
      .new(newBountyReward, "Pass Test Suite", 3600, { value: 100 })
      .then(instance => newBounty = instance);
  })

  it("should make the creator of the contract the bounty owner", async () => {
    const bounty = await Bounty.deployed();
    const contractOwner = await bounty.owner.call();

    assert.equal(contractOwner, owner, "Contract owner is not set to contract creator.")
  });

  it("should allow claims to be submitted", async () => {
    const bounty = await Bounty.deployed();
    const validation = "validation";

    await bounty.submitClaim(validation, { from: alice });
    const claim = await bounty.findClaim(alice)

    assert.deepEqual(claim, [ alice, validation, true ]);
  });

  it("should emit an event when a claim is submitted", async () => {
    const validation = "validation";

    const result = await newBounty.submitClaim(validation, { from: alice });
    const event = result.logs.find(log => log.event === 'NewBountyClaim');

    expect(event, "No event was emitted.").to.not.be.undefined;
    expect(event.args.claimant, "Invalid claimant.").to.be.equal(alice);
    expect(event.args.validation, "Invalid validation").to.be.equal(validation);
  });

  it("should allow the owner to close claim submissions for early review", async () => {
    const validation = "validation";
    await newBounty.submitClaim(validation, { from: alice });
    await newBounty.closeForReview({ from: owner });

    const stage = await newBounty.stage.call({ from: owner });

    expect(parseInt(stage), "Bounty stage should be closed for review.").to.be.equal(1);
  });

  it("should allow the owner to select a bounty winner", async () => {
    const validation = "validation";
    await newBounty.submitClaim(validation, { from: alice });
    await newBounty.closeForReview({ from: owner });
    await newBounty.acceptClaim(alice, { from: owner });
    const winner = await newBounty.winner.call();

    expect(winner, "Incorrect bounty winner").to.be.equal(alice);
  });

  it("should not allow any another address/account to select a bounty winner", async () => {
    const validation = "validation";
    await newBounty.submitClaim(validation, { from: alice });
    await newBounty.closeForReview({ from: owner });
    await catchRevert(newBounty.acceptClaim(alice, { from: bob }));
    await catchRevert(newBounty.acceptClaim(alice, { from: alice }));
  });

  it("should emit \"BountyWon\" event with bounty winner", async () => {
    const validation = "validation";
    await newBounty.submitClaim(validation, { from: alice });
    await newBounty.closeForReview({ from: owner });
    const result = await newBounty.acceptClaim(alice, { from: owner });
    const event = result.logs.find(log => log.event === 'BountyWon');

    expect(event, "No event was emitted.").to.not.be.undefined;
    expect(event.args.winner).to.be.equal(alice);
  });

  it("should allow the owner to trigger award withdrawal", async () => {
    const validation = "validation";
    await newBounty.submitClaim(validation, { from: alice });

    const balanceBefore = await web3.eth.getBalance(alice);

    await newBounty.closeForReview({ from: owner });
    await newBounty.acceptClaim(alice, { from: owner });
    await newBounty.sendAward();

    const balanceAfter = await web3.eth.getBalance(alice);

    expect(balanceAfter.toNumber()).to.be.equal(balanceBefore.toNumber() + newBountyReward)
  });

  it("should not allow claims to be submitted unless the bounty is open", async () => {
    await newBounty.closeForReview({ from: owner });
    await catchRevert(newBounty.submitClaim("validation", { from: alice }));
  });

  it("should implement a circuit breaker, allowing owner to pause contract in emergency", async () => {
    await newBounty.pause({ from: owner });

    // Test pause in "AcceptingClaims" stage.
    await catchRevert(newBounty.submitClaim("validation", { from: alice }));
    await catchRevert(newBounty.closeForReview({ from: owner }));
    await newBounty.unpause({ from: owner });

    // Test pause in "ClosedInReview" stage.
    await newBounty.submitClaim("validation", { from: alice });
    await newBounty.closeForReview({ from: owner });
    await newBounty.pause({ from: owner });
    await catchRevert(newBounty.acceptClaim(alice, { from: owner }));
    await newBounty.unpause({ from: owner });

    // Test pause in "ClosedAwaitingWithdrawal" stage.
    await newBounty.acceptClaim(alice, { from: owner });
    await newBounty.pause({ from: owner });
    await catchRevert(newBounty.sendAward({ from: alice }));
  });
});
