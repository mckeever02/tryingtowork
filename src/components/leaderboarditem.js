/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import Avatar from 'react-avatar'


export default class LeaderboardItem extends React.Component {
    render() {
        let value = this.props.value;
        return (
            <LeaderboardItem>
            <a target="_blank" rel="noopener noreferrer" href={"//twitter.com/"+value.node.twitter}>
                <Avatar name={value.node.twitter} round={true} twitterHandle={value.node.twitter} size="100" />
            </a>
            <h3>{value.count}</h3>
            <h3>{value.node.twitter}</h3>
            </LeaderboardItem>
        )

    }
}