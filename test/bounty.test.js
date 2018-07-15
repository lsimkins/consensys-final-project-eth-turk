var Bounty = artifacts.require("./Bounty.sol");

contract("Bounty", function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  let newBounty;
  beforeEach(() => {
    return Bounty
      .new(100, "Pass Test Suite", 3600)
      .then(instance => newBounty = instance);
  })

  it("should make the creator of the contract the bounty owner", async () => {
    const bounty = await Bounty.deployed();
    const contractOwner = await bounty.owner.call();

    assert.equal(contractOwner, owner, "Contract owner is not set to contract creator.")
  });

  it("should claims to be submitted", async () => {
    const bounty = await Bounty.deployed();
    const validation = "validation";

    const result = await bounty.submitClaim(validation, { from: alice });
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

  it("should not allow claims to be submitted unless the bounty is open", async () => {
    //TODO
  })
});
