/* global tw */
import PropTypes from "prop-types"
import React from "react"
import styled from '@emotion/styled'
import Icon from "./icon";
import Modal from 'react-modal';
import Form from '../components/form'
import Nav from '../components/navigation'


Modal.setAppElement('body');

const HeaderWrapper = styled('header')`
  ${tw`sm:pb-12 py-6 sm:p-6`}
`

const StyledModal = styled(Modal)`
	${tw`fixed w-full h-full p-6 sm:p-16 overflow-hidden flex flex-row align-items-center justify-content-center`}
`

const ModalDialog = styled('div')`
	${tw`bg-mirage w-full text-white shadow-xl flex flex-row w-full h-full z-50 mx-auto self-center`}
	max-width: 1560px;
	max-height: 1000px;
`

const ModalClick = styled('div')`
  ${tw`absolute pin-t pin-l w-full h-full`}
  button {
    ${tw`appearance-none text-comet-lighter border-none bg-transparent absolute pin-t pin-r cursor-pointer outline-none p-2 md:p-5 z-60`}
    &:hover, &:focus {
      ${tw`text-white`}
    }
  }
`

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
      this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
      document.body.style.overflow = "hidden";
      document.querySelector('.geosuggest__input').focus();
  }

  closeModal() {
      this.setState({modalIsOpen: false});
      document.body.style.overflow = "auto";
  }

  render() {
    Header.propTypes = {
      siteTitle: PropTypes.string,
      headerTitle: PropTypes.string,
      headerDescription: PropTypes.string,
    }

    Header.defaultProps = {
      siteTitle: ``,
      headerTitle: `Trying to work`
    }
    return(
      <>
        <HeaderWrapper>
          <Nav menuLinks={this.props.menuLinks} openModal={this.openModal}  />
        </HeaderWrapper>

        <StyledModal
            closeTimeoutMS={300}
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            shouldCloseOnOverlayClick={true}
            contentLabel="Form Modal"
            style={{
              overlay: {
                backgroundColor: 'rgba(22, 24, 35, 0.95)',
                overflow: 'hidden'
              }
            }}
            >
          <ModalClick onClick={this.closeModal}>
            <button>
              <Icon name="close" size="xl" />
            </button>
          </ModalClick>
          <ModalDialog id="ModalDialog">
            <Form modal={this.state.modalIsOpen}/>
          </ModalDialog>
        </StyledModal>
      </>
    )
  }
}