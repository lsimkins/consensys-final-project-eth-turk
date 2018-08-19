import React, { Component } from 'react'
import BountyList from '../containers/bounty-list';
import BountyCard from './bounty-card';
import ReviewBounty from '../containers/review-bounty';
import BountyTabs from './bounty-tabs';
import ClaimBounty from '../containers/claim-bounty';

class ViewBounties extends Component {
  state = {
    viewBounty: null,
    reviewBounty: null,
  }

  onViewBounty = (bounty) => {
    this.setState({
      viewBounty: bounty,
      reviewBounty: null,
      claimBounty: null,
    });
  }

  onReviewBounty = (bounty) => {
    this.setState({
      viewBounty: null,
      reviewBounty: bounty,
      claimBounty: null,
    });
  }

  onClaimBounty = (bounty) => {
    this.setState({
      viewBounty: null,
      reviewBounty: null,
      claimBounty: bounty,
    });
  }

  render() {
    const { viewBounty, reviewBounty, claimBounty } = this.state;
    return (
      <div className="view-bounties">
        <BountyTabs
          onViewBounty={this.onViewBounty}
          onReviewBounty={this.onReviewBounty}
          onClaimBounty={this.onClaimBounty}
        />
        { viewBounty && <BountyCard bounty={viewBounty} />}
        { reviewBounty && <ReviewBounty bounty={reviewBounty} />}
        { claimBounty && <ClaimBounty bounty={claimBounty} />}
      </div>
    );
  }
}

export default ViewBounties