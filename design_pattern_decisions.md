# Design Pattern Decisions

## 1. Access Restriction
The Bounty contracts contain strict access modifiers for each function that may be called against the contract. Multiple types of users may take actions against a Bounty, such as the "owner/creator", "claimant", or "winner". Each contract function with the potential to mutate the state of the contract implements careful access modifiers.

## 2. Contract Expiration / Deprecation
Each bounty contract has a time limit, specified on creation. This prevents bounties from being open indefinitely.

## 3. Destructable / Mortal
A bounty contract may be destroyed by its creator. This prevents funds from being locked up in the contract in an emergency or if the contract expires without any claimants.

## 4. Push Payments / Withdrawal Pattern
Once a winner has been selected, the bounty enters an "AwaitingWithdrawal" stage, at which point the bounty owner or winner may trigger a withdrawal. This separates the actions of fund withdrawal from selecting a winner, isolating each flow (greater simplicity and single responsibility assists identifying vulnerabilities).

In addition, restricting withdrawal to a specific stage and setting the contract stage to "ClosedFinalized" *before* transfering the funds prevents reentrancy attacks.

## 5. State Machine
The bounty contract is a simple stage machine with four stages, "AcceptingClaims", "ClosedInReview", "ClosedAwaitingWithdrawal", and "ClosedFinalized". Each state represents a part of the bounty lifecycle where the contract acts differently.