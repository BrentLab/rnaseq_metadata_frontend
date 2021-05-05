import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/cjs/Form';
import Modal from "react-bootstrap/cjs/Modal";

const GeneralAlert = props => {


    /**
    * @summary alert model body css
    * @description preseveres whitespace and formatting (eg \n and \t)
    * @type {object}
    */
    const style = {
        whiteSpace: "pre-line",
        textAlign : "left"
    };
    return (
            <Modal.Body style={style}>
                {props.content}
            </Modal.Body>
    )
}

GeneralAlert.propTypes = {

}

export default GeneralAlert