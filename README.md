# Simple Bounty DApp

## Purpose
This DApp is an example of a basic bounty DApp. The goal was to create a project MVP modeling the core workflow with a minimalistic UI.

The workflow is as follows.
- An ethereum account holder creates a bounty, specifying a description of what needs to be completed, a time limit, and an award.
- Other users review available bounties.
- Users submit claims to a bounty, but only one claim per address holder. A bounty may have multiple claimants.
- After the time limit is expired, the bounty creator may review claims and select a winner.
- Once a winner has been selected, they may withdraw the award from the bounty.
- Finally, the creator may destroy the bounty and reclaim any funds left within the contract. If the bounty expires without any claims, this allows the creator to reclaim the contract reward.

## Limitations & Caveats
- Proof is simply text. A feature-rich DApp may allow a creator to specify what type of proof they desire, such as an uploaded photo to PFS. Or better yet, once FOAM's proof-of-location reaches maturity, a user could prove they were in a required location at a particular time.
- For this example, it was necessary to limit the number of claimants to a contract. A bad actor could "game" the system by submitted a claim, and then filling the rest of the available claim slots with bad claims. To do this, they'd need to make each claim from a unique address. This is not much of a deterrent since it is very simple to generate ethereum addresses. A better means would be to identify or fingerprint a claimant by means other than an ethereum address, such as using UPort to ID a claimant.
- Bounty contracts are "Destructible" Zepplin destructable contracts, meaning an owner may submit a sizable reward for a task, wait for a claim, then destroy the contract to reclaim the reward. This was done as a simple means to prevent funds from being locked in a contract with zero claims or only bad claims. A more feature-complete Bounty system could solve this issue through arbitration or strict, well-tested limitations on when a bounty creator may destroy a contract and reclaim their funds.