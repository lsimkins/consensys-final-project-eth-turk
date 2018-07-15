var Bounty = artifacts.require("./Bounty.sol");
var BountyRegistry = artifacts.require("./BountyRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(Bounty, 200, "test description", 3600);
  deployer.deploy(BountyRegistry);
};