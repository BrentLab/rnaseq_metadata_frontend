import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/cjs/Form';
import Modal from "react-bootstrap/cjs/Modal";
import Button from "react-bootstrap/cjs/Button"
import { useDispatch } from 'react-redux';
import { loginUser } from "../../../store/database_api/actions.js"

const LoginRegisterForm = props => {

    const dispatch = useDispatch()

    // TODO: REPEATED CODE -- MAKE THIS INTO A GENERALLY AVAILABLE FUNCTION TO HANDLE FORM DATA
    const submitHandler = (event) =>{
        event.preventDefault()
        const form_data = new FormData(event.target)
        let form_data_obj = {};
        form_data.forEach((value, key) => {
           form_data_obj[key] = value
        });
        loginUser(form_data_obj, dispatch)
        props.toggleModal("", true)
    }


    return (
            <Modal.Body>
                <Form onSubmit={(event) =>{submitHandler(event)}}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" placeholder="Enter username" />
                        <Form.Text className="text-muted">
                        Enter your (admin assigned) username and password and click login, or enter your name and an arbitrary word in password and click 'request access' to request credentials from the admin
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="outline-dark" type="submit">Login</Button>
                </Form>
            </Modal.Body>
    )
}

LoginRegisterForm.propTypes = {

}

export default LoginRegisterForm