/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import TextInput from '../components/textInput';

const SearchInputWrapper = styled('div')`
	${tw`max-w-lg mx-auto relative`}
`
export default class Search extends React.Component {
    render() {
        return (
            <SearchInputWrapper>
                <label hidden htmlFor="Search">Search</label>
                <TextInput
                    icon="search"
                    size="lg"
                    placeholder="Search spaces.."
                    type="search"
                    name="search"
                    rounded="rounded-full"
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
            </SearchInputWrapper>
        )
    }
}