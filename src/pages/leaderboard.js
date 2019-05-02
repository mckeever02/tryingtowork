/*
 * NOTE: The Babel plugin will automatically process the `tw()` function, which
 * means we don’t actually need to import it. ESLint will complain about this,
 * however, so we need to add `tw` as a global variable.
 */

/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"
import Avatar from 'react-avatar';
import PageTitle from '../components/pageTitle';


export default class Leaderboard extends React.Component {

  render() {

    const LeaderboardItemWrapper = styled('div')`
        ${tw`relative z-10 mb-6 `}
        &:after, &:before {
            content: "";
            ${tw`border border-solid border-black rounded-sm bg-steel-gray h-full w-full absolute bg-steel-gray`};
        }
        &:before, &:after {
            ${tw`bg-steel-gray`}
        }
        &:before {
            top: .3em;
            right: -.4em;
            z-index: -1;
        }
        &:after {
            top: .6em;
            right: -.75em;
            z-index: -2;
        }

        &:nth-of-type(4) {
            opacity: .8;
        }
        &:nth-of-type(5) {
            opacity: .6;
        }
        &:nth-of-type(6) {
            opacity: .4;
        }
        &:nth-of-type(7) {
            opacity: .2;
        }
        &:nth-of-type(8) {
            opacity: .1;
        }
    `
    const Leaderboard = styled('div')`
        ${tw`flex flex-col max-w-md mx-auto sm:px-5`}
    `

    const LeaderboardItem = styled('a')`
        ${tw`flex relative z-10 flex-row border border-solid border-black rounded-sm bg-steel-gray px-4 py-3 content-center rounded-sm no-underline`}
        .sb-avatar__image {
            ${tw`border border-solid border-black`}
        }
    `

    const LeaderboardItemName = styled('div')`
        ${tw`font-mono ml-3 flex content-center my-auto`}
        h3 {
            ${tw`text-base font-normal m-0 text-white`}
        }
    `
    const LeaderboardItemCount = styled('div')`
        ${tw`font-mono ml-auto flex flex-row justify-center items-end content-center my-auto text-white`}
        h4 {
            ${tw`text-xl font-weight-normal m-0`}
        }
        span {
            ${tw`hidden sm:block text-comet-light text-xs uppercase mr-2 my-auto tracking-wide`}
        }
    `

    const LeaderboardItemPlace = styled('div')`
        ${tw`rounded-full w-7 h-7 flex content-center justify-center text-center bg-water-leaf text-steel-gray absolute text-sm font-bold border-2 border-solid border-black`}
        bottom: .5rem;
        span {
            ${tw`m-auto`}
        }
    `


    let array = this.props.data.allGoogleSheetSpacesRow.edges;

    const results = array.reduce((r, e) => {
      let k = `${e.node.twitter}`;
      if(!r.has(k)) r.set(k, {...e, count: 1})
      else r.get(k).count++
      return r;
    }, new Map);


    let leaderboard = results;
    // console.log(leaderboard.entries());
    // console.log(leaderboard instanceof Array)
    // console.log(leaderboard instanceof Map)

    //console.log(found.count);


    return (
        <Layout>
		<SEO title="Leaderboard" description="Secure your place on the leaderboard by submitting spaces from around your city" />

        <PageTitle title="Leaderboard" description="Secure your place on the leaderboard by submitting spaces from around your city" />


            <Leaderboard>
                {Array.from(leaderboard.entries())
                    .filter(value => !value.includes("null"))
                    .slice(0, 7)
                    .map(([key, content], index) => (
                    <LeaderboardItemWrapper key={key} >
                        <LeaderboardItem target="_blank" rel="noopener noreferrer" href={"//twitter.com/" + content.node.twitter}>
                            <LeaderboardItemPlace>
                                <span>{index + 1}</span>
                            </LeaderboardItemPlace>
                            <Avatar name={content.node.twitter} round={true} twitterHandle={content.node.twitter} size="60" />
                            <LeaderboardItemName>
                                <h3>{content.node.twitter}</h3>
                            </LeaderboardItemName>
                            <LeaderboardItemCount>
                                <span>Submissions</span>
                                <h4>{content.count}</h4>
                            </LeaderboardItemCount>
                        </LeaderboardItem>
                    </LeaderboardItemWrapper>
                ))}
            </Leaderboard>


      </Layout>
    )
  }
}

export const query = graphql`
	query Leaderboard {
		allGoogleSheetSpacesRow {
			edges {
				node {
					twitter
				}
			}
		}
	}
`