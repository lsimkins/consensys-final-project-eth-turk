import React, { Component } from 'react'
import { Link } from 'react-router';
import { Button, Tabs } from 'antd';
import BountyList, { BOUNTY_LIST_FILTER } from '../containers/bounty-list';

const { TabPane } = Tabs;

const tabs = [{
  path: '/task/view-all',
  title: 'All Bounties'
}, {
  path: '/task/review',
  title: 'My Posted Bounties'
}, {
  path: '/task/view-won',
  title: 'My Won Bounties'
}];

class BountyTabs extends Component {
  renderBountyList = (filter) => {
    const { onViewBounty, onReviewBounty, onClaimBounty } = this.props;
    return (
      <BountyList
        filter={filter}
        onViewBounty={onViewBounty}
        onReviewBounty={onReviewBounty}
        onClaimBounty={onClaimBounty}
      />
    )
  }

  render() {
    const activeTab = this.props.activeTab || 'all-bounties';

    return (
      <Tabs defaultActiveKey={activeTab}>
        <TabPane tab='All Bounties' key='all-bounties'>
          {this.renderBountyList(BOUNTY_LIST_FILTER.ALL)}
        </TabPane>
        <TabPane tab='My Posted Bounties' key='posted-bounties'>
          {this.renderBountyList(BOUNTY_LIST_FILTER.OWNED)}
        </TabPane>
        <TabPane tab='My Won Bounties' key='won-bounties'>
          {this.renderBountyList(BOUNTY_LIST_FILTER.WON)}
        </TabPane>
      </Tabs>
    );
  }
}

export default BountyTabs
