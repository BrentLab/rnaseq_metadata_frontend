import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/cjs/Form';
import Modal from "react-bootstrap/cjs/Modal";

const GeneralAlert = props => {
    return (
            <Modal.Body>
                {props.content}
            </Modal.Body>
    )
}

GeneralAlert.propTypes = {

}

export default GeneralAlert