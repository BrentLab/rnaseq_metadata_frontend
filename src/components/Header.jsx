// cite: https://github.com/bradtraversy/react-crash-2021/blob/master/src/components/Header.js
import PropTypes from 'prop-types'
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import Container from "react-bootstrap/cjs/Container";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTableList, getTableData, logoutUser } from "../store/database_api/actions"
import config from "../config"


// TODO: get rid of hard coding, pass anything that is currently hard coded (eg, button names) as props
// todo: make it easier to add elements to the navbar -- eg, make this a directory akin to Modal or Table. Each element in the toolbar should be passed a click handler
//       function in the toolbar element should handle the click, test whether user is signed in. Maybe make 'signed_in' == true/false a prop in the main navbar component?

/**
 * Returns a navbar header (responsive, collapsing) which includes buttons for database functionality + login/logout
 * @component
 * @category Header
 * @namespace Header
 * @example
 * const table_array = ['...Loading']
 * database_name = "database name here"
 * selected_table = ""
 * setSelectedTable = function(){}
 * toggleModal = function(){}
 * qualityMetricsToggle = function(){}
 * alertUserError = function(){}
 * entryTableToggle = function(){}
 * return(
 * <Header table_array={table_array} database_name={database_name} entryTableToggle={entryTableToggle} selected_table={selected_table} setSelectedTable={selectedTable} toggleModal={toggleModal} qualityMetricsToggle={qualityMetricsToggle} alertUserError={alertUserError} /> )
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example (get this working -- alternatively, switch to different documentation/sandbox app like styleguiist or whatever)
 */
const Header = props => {

    /**
    * retrieve redux store
    */
    const table_state = state => state.database_api

    /**
     * assign redux store to object
     * @type {object}
     */
    const table_state_data = useSelector(table_state)
    const dispatch = useDispatch()
    
    /**
     * assign redux store to object
     * @param {object} event the event passed from the onClick event 
     */
    const logoutHandler = (event) =>{
        event.preventDefault()
        logoutUser(dispatch)
    }

    /**
     * handler for 'Add Sample button'
     * @param {object} event the event passed from the onClick event 
     */
    const addSampleClickHandler = event =>{
        if(!("token" in table_state_data.login)){
            props.alertUserError(config.CREDENTIALS_ERROR_MSG)
        } else{
            props.entryTableToggle();
            props.toggleModal("add_samples_form");
        }
    }

    /**
     * handler for the table selector
     * @param {object} event the event passed from the onClick event 
     */
    const handleTableSelector = (event) => {
        if(!("token" in table_state_data.login)){
            props.alertUserError(config.CREDENTIALS_ERROR_MSG)
        } else if (event.target.value !== '...loading'){
            getTableData(event.target.value, table_state_data.login.token, dispatch) // TODO: FIGURE OUT RIGHT WAY OF DOING THIS
        }
    }

    /**
    * choose button (login/logout) to display based on whether the user is signed in
    * @type {object} 
    */
    const login_logout_request_cred_btn = ("token" in table_state_data.login )
                                            ? <Button onClick={(event) => logoutHandler(event)}>Logout</Button>
                                            : <Button onClick={(event) =>props.toggleModal("login")}>Login</Button>
  
  return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#home">{props.database_name}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown title="Tables" id="collapsible-nav-dropdown">
                                {props.table_array.map(table_name => (
                                    <NavDropdown.Item key={table_name}>
                                        <option value={table_name}
                                                onClick={handleTableSelector}>{table_name}</option>
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                            {/* <NavDropdown title="Experiment Sets" id="collasible-nav-dropdown">
                                <NavDropdown.Item key='90minuteInduction'
                                                  href="https://htcf.wustl.edu/files/5d9y4LdO/main.html"
                                                  _target="blank">90minuteInduction</NavDropdown.Item>
                            </NavDropdown> */}
                            <Nav.Link onClick={addSampleClickHandler}>Add New Samples</Nav.Link>
                            {/* <Nav.Link onClick={(event) => props.qualityMetricsToggle(event)}>Quality Metrics</Nav.Link> */}
                            <Nav.Link href="https://cmatkhan.shinyapps.io/yeast_zev_experiments_2/?_ga=2.74716626.1333156210.1619550390-368285056.1619298418" _target="blank" >Quality Metrics</Nav.Link>
                            <Nav.Link href={config.CODEBASE_DOCUMENTATION} _target="blank" >Code base documentation</Nav.Link>
                            </Nav>
                                {login_logout_request_cred_btn}
                            <Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
  )
}

Header.defaultProps = {
    table_array: ["...Loading"],
    database_name: "Metadata"
}

Header.propTypes = {
    table_array: PropTypes.array,
    database_name: PropTypes.string,
    entryTableToggle: PropTypes.func,
    selected_table: PropTypes.string, 
    setSelectedTable: PropTypes.func,
    toggleModal: PropTypes.func,
    qualityMetricsToggle: PropTypes.func,
    alertUserError: PropTypes.func
}

export default Header
