# Avoiding Common Attacks

## 1. Reentrancy
This contract implements a withdrawal pattern where the contract is placed in a state in which a user may not toggle further withdrawal immediately *before* transfering funds. `address.transfer()` is used so that the state change reverts if the transfer fails, allowing another attempt at withdrawal.

## 2. Race conditions
The bounty contract makes one external call when the reward is withdrawn. As described in #1 above, the internal state change used to restrict further withdrawals is made *before* transferring funds to prevent the race condition of parallel withdrawals.

## 3. Timestamp Dependence
This contract has one dependency on block timestamp, and that is the expiration. As the result, this contract should not be used by any bounty sensitive to a 30 second time drift, as stated here "https://consensys.github.io/smart-contract-best-practices/recommendations/#timestamp-dependence".

## 4. Multiple Inheritance
No multiple inheritance is used, avoiding the diamond problem.

## 5. Integer Overflow / Underflow
This vulnerability is relevant to two variables in these contracts, BountyRegistry.bountyCount and Bounty.numberClaims. The former tracks bounty count and uses uint256, which allows for several orders of magnitude more bounties than atoms in the galaxy. I'll be long dead when it hits that number so it becomes another programmer's problem. My apologies to she/he/them. For the latter, the number of claims is presently restricted to 10 (more on that later), so wraparound will not occur.

# 6. DoS with (Unexpected) revert
An unexpected revert could occur during transfer of funds to the winner, in which case they're only hurting themselves. The owner of the contract may still destroy it to unlock the funds. The withdrawal pattern is used to prevent this attack from effecting any other function of the contract.

## A vulnerability that does exist.
The bounty contract restricts claims to 10. Claims are presently identified by an address. A bad actor could submit a number of bad claims preventing valid claims from being submitted. A better means would be to identify or fingerprint a claimant by means other than a single ethereum address, such as using UPort to ID a claimant. If this DApp were developed into a production-grade version, this would be a top priority prior to launch.