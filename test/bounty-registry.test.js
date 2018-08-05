var BountyRegistry = artifacts.require("./BountyRegistry.sol");
var Bounty = artifacts.require("./Bounty.sol");

contract("BountyRegistry", function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  let registry;
  beforeEach(() => {
    return BountyRegistry
      .new(100, "Pass Test Suite", 3600)
      .then(instance => registry = instance);
  })

  it("should make the creator of the contract the bounty owner", async () => {
    const result = await registry.createBounty(10, "test", 10);

    const newAddress = result.logs[0].args.contractAddress;
    const newBounty = Bounty.at(newAddress);

    assert.equal(await newBounty.owner.call(), owner, "New bounty not owned by creator");
    assert.equal(await newBounty.reward.call(), 10, "Invalid reward.");
  });

  it("should return the currently active bounties", async () => {
    const result = await registry.createBounty(10, "test", 10);
    const bounties = await registry.getBounties();
    const newAddress = result.logs[0].args.contractAddress;

    assert.equal(bounties[0], newAddress);
  });
});
