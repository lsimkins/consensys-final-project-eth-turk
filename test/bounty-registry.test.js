const BountyRegistry = artifacts.require("./BountyRegistry.sol");
const Bounty = artifacts.require("./Bounty.sol");

/**
 * These tests were chosen to verify the registry performs its job as a
 * simple factory and contract registry. Also tested is pagination through the registry contracts.
 */
contract("BountyRegistry", function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  let registry;
  beforeEach(() => {
    return BountyRegistry
      .new()
      .then(instance => registry = instance);
  })

  it("should make the creator of the contract the bounty owner", async () => {
    const result = await registry.createBounty(10, "test", 10);

    const newAddress = result.logs[0].args.contractAddress;
    const newBounty = Bounty.at(newAddress);

    assert.equal(await newBounty.owner.call(), owner, "New bounty not owned by creator");
    assert.equal(await newBounty.reward.call(), 10, "Invalid reward.");
  });

  it("should return all bounties", async () => {
    const result = await registry.createBounty(10, "test", 10);
    const bounties = await registry.getBounties();
    const newAddress = result.logs[0].args.contractAddress;

    assert.equal(bounties[0], newAddress);
  });

  it("should send the msg value to the bounty on creation", async () => {
    const bountyReward = 10;
    const result = await registry.createBounty(bountyReward, "test", 10, { value: bountyReward });
    const newAddress = result.logs[0].args.contractAddress;

    assert.equal(await web3.eth.getBalance(newAddress), bountyReward);
  });

  it("should emit a \"BountyCreated\" event on bounty creation", async () => {
    const bountyReward = 10;
    const result = await registry.createBounty(bountyReward, "test", 10, { value: bountyReward });

    assert.equal(result.logs[0].event, "BountyCreated");
  });

  it("should allow pagination of registry bounties", async () => {
    const bounties = [
      await registry.createBounty(1000, "test", 10, { value: 1000 }),
      await registry.createBounty(1000, "test", 10, { value: 1000 }),
      await registry.createBounty(1000, "test", 10, { value: 1000 }),
      await registry.createBounty(1000, "test", 10, { value: 1000 }),
      await registry.createBounty(1000, "test", 10, { value: 1000 }),
    ];

    const count = await registry.bountyCount.call();
    const result = await registry.getPaginatedBounties(2, 2);

    assert.equal(
      result[0],
      bounties[2].logs[0].args.contractAddress,
    );
    assert.equal(
      result[1],
      bounties[3].logs[0].args.contractAddress,
    );
  });
});
