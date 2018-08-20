# Simple Bounty DApp

## Purpose
This is a simple Bounty DApp to demonstrate basic Solidity contract development. The goal was to create a project MVP modeling the core workflow with a minimalistic UI.

The workflow is as follows.
- An ethereum account holder creates a bounty, specifying a description of what needs to be completed, a time limit, and an award.
- Other users review available bounties.
- Users submit claims to a bounty, but only one claim per address holder. A bounty may have multiple claimants.
- After the time limit is expired, the bounty creator may review claims and select a winner.
- Once a winner has been selected, they may withdraw the award from the bounty.
- Finally, the creator may destroy the bounty and reclaim any funds left within the contract. If the bounty expires without any claims, this allows the creator to reclaim the contract reward.

## Setup
1. Ensure you have nodejs, npm, truffle, and ganache-cli installed.
2. If running in linux, please ensure the `node` command runs nodejs. If you get the error `node: not found` when running this project, you can create a symlink to fix the project.
   - `ln -s /usr/bin/nodejs /usr/bin/node`
3. Install project dependences by running `npm install` in the project root.
4. Start ganache by running `ganache-cli`.
5. Make sure to compile and migrate the contracts using truffle before running the front-end. This project makes use of a registry contract that must be deployed to your development environment. This can be done easily by running the following commands.
   - `truffle console`
   - (In truffle console) `compile`
   - (In truffle console) `migrate`

After following the steps above, your environment should be ready to test and run the DApp.
### Testing
Run `test` in the truffle console.

### Running Front-End
Run `npm run start` to serve the front-end. Your default browser should open to `http://localhost:3000`.

### Additional Requirements
This DApp was tested using the MetaMask web3 browser extension against a locally running development blockchain in MacOS and Ubuntu 16.04. Be sure you have a valid connection to your local development blockchain.

## Tests
See comments in test files.

## Library Demonstration
Solidity contract libary usage is demonstrated in the `ArbitrationLibraryDemo.sol` contract. In addition, the `Bounty.sol` contract inherits from an OpenZepplin library contract.

## Notes on code
I consider the application state management in the front-end portion of this DApp prototype code. Ideally, application state would carefully manage a cache of contract data an avoid unecessary calls to contracts. You'll notice that several components make many calls to retrieve contract data. This is comparable to making api calls within components, which is typically not ideal in data-intensive applications.

## Limitations & Caveats
- Proof is simply text. A feature-rich DApp may allow a creator to specify what type of proof they desire, such as an uploaded photo to PFS. Or better yet, once FOAM's proof-of-location reaches maturity, a user could prove they were in a required location at a particular time.
- For this example, it was necessary to limit the number of claimants to a contract. A bad actor could "game" the system by submitted a claim, and then filling the rest of the available claim slots with bad claims. To do this, they'd need to make each claim from a unique address. This is not much of a deterrent since it is very simple to generate ethereum addresses. A better means would be to identify or fingerprint a claimant by means other than an ethereum address, such as using UPort to ID a claimant.
- Bounty contracts are "Destructible" Zepplin destructable contracts, meaning an owner may submit a sizable reward for a task, wait for a claim, then destroy the contract to reclaim the reward. This was done as a simple means to prevent funds from being locked in a contract with zero claims or only bad claims. A more feature-complete Bounty system could solve this issue through arbitration or strict, well-tested limitations on when a bounty creator may destroy a contract and reclaim their funds.

## Future Development
1. My ideal vision for this application was "Geospatial Mechanical Turk". By using FOAM and registering a contract geospatially, bounties could be viewed on a map and eventually utilize proof-of-location in claims.
2. Allow creators to set up multiple types of bounties, picking from types of proof, features of each bounty, etc.
3. Integrate proof system to PFS to allow upload of photos or other digital proof of completion.
4. A loyalty or rating system to discourage bad actors.
5. A system of arbiration and ability to select arbitors of contract disputes. This project contains a bare-bones example of an arbitration contract, but it is a far cry away from what is needed.