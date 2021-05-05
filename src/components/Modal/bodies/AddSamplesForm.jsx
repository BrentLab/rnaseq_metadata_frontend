import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/cjs/Form';
import Modal from "react-bootstrap/cjs/Modal";
import { getTableList, getTableData, getTable, getTableOptions, getPreviousTableOptions } from "../../../store/database_api/actions"
import config from "../../../config"


// retrieve store data
const table_state = state => state.database_api

const AddSamplesForm = props => {

    // get store data
    const table_state_data = useSelector(table_state)
    const dispatch = useDispatch()

    // set state
    let [foreign_key_options_toggle, setForeignKeyOptionsToggle] = useState(true);
    let [foreign_key_researchers_array, setForeignKeyResearchersArray] = useState([])
    // note: these are from the description slot of the table_options object stored in the store (see getTableOptions)
    let [foreign_key_researcher_field, setForeignKeyResearcherField] = useState([])
    let [foreign_key_date_field, setForeignKeyDateField] = useState([])
    
    // create int array for number of samples dropdown
    let int_array = Array.from({length: config.MAX_NEW_SAMPLES}, (_, i) => i);

  /**
    * when user selects a table to enter, update the table options (foreign key researcher) 
    * @param {object} e an onClick event generated when a user selected a table in the addSampleForm modal
    * @todo update backend so that we can only pull the foreign key columns of interest, rather than the whole 'previous table'
    */
    const handleTableSelector = (e) => {
        // check if user is signed in
        if(!("token" in table_state_data.login)){
            throw config.CREDENTIALS_ERROR_MSG
        }else{
            // if the tables are already loaded
            if (e.target.value !== '...loading'){
                // get SELECTED TABLE options (send to store)
                console.log("in selected table")
                console.log(e.target.value)
                getTableOptions(e.target.value, table_state_data.login.token, dispatch)
                // and the table is not the first table in the list, according to the config file
                if (e.target.value !== config.FIRST_TABLE){
                    // get foreign key information. For example, if the user selects RnaSample, then we will need the the columns bioSampleNumber, harvester, harvestDate from BioSample. Currently just grabbing the whole table
                    setForeignKeyOptionsToggle(false)
                    let prev_table = props.table_array[props.table_array.indexOf(e.target.value)-1]
                    // get PREVIOUS TABLE data
                    getTable(prev_table, table_state_data.login.token, dispatch)
                    // get previous table options to extract foreign key info
                    getPreviousTableOptions(prev_table, table_state_data.login.token)
                        .then(res => {
                            let description = JSON.parse(res.data.description);
                            let fk_researcher_array = [];
                            res.data.actions.POST[description.researcher_field].choices.forEach( (element, index) => {
                                fk_researcher_array.push(element.value);
                            });
                            setForeignKeyResearchersArray(fk_researcher_array)
                            // since this is 'getting' the previous table, the foreign key is going to be the researcher and date of this table
                            setForeignKeyResearcherField(description.researcher_field)
                            setForeignKeyDateField(description.date_field)

                        })
                } else{
                    setForeignKeyOptionsToggle(true)
                }
            }
        }
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        const form_data = new FormData(event.target)
        let form_data_obj = {};
        form_data.forEach((value, key) => {
           form_data_obj[key] = value
        });
        // TODO: naming around foreign key stuff needs to be fixed/clarified
        form_data_obj["researcher_field"] = foreign_key_researcher_field
        form_data_obj["date_field"] = foreign_key_date_field
        props.addNewSamplesFormData(form_data_obj)
    }

    return (
            <Modal.Body>
                <form id="createNewSamples" onSubmit={handleSubmit}>
                    <fieldset>
                        <Form.Row>
                            <label htmlFor="sheet">Table:</label>
                            <select id="table" onChange={handleTableSelector} name="table" defaultValue="Select A Table">
                                {/* <option value="" disabled selected style={{display: "none"}}>Select A Table</option> */}
                                <option selected value> -- select an option -- </option>
                                {props.table_array.map( (colname, index) => <option key={`add-entry-table-option-${index}`}>{colname}</option>)}
                            </select>
                        </Form.Row>
                        <Form.Row style={{ display: `${!foreign_key_options_toggle ? "none" : ""}` }}>
                            <label htmlFor="num_samples">Number of New Samples:</label>
                            <select id="num_samples" name="num_samples">
                                <option value="" disabled selected style={{display: "none"}}>Select the Number of New Samples</option>
                                {int_array.map(option => <option value={option}>{option}</option>)}
                            </select>
                        </Form.Row>
                        <Form.Row style={{ display: `${foreign_key_options_toggle ? "none" : ""}` }}>
                            <label htmlFor="foreign_key">Key to Previous Sheet:</label>
                            <select id="foreign_key" name="foreign_key_researcher" defaultValue="Select Researcher (of previous sheet's samples)">
                                {/* <option value="" disabled selected style={{display: "none"}}>Select Researcher (of previous sheet's samples)</option> */}
                                {foreign_key_researchers_array.map((researcher, index)=> <option key={`fk-researcher-options-${index}`}>{researcher}</option>)}
                            </select>
                            <input type="date" id="foreign_key" name="foreign_key_date"></input>
                        </Form.Row>
                        <Form.Row>
                            <label htmlFor="date">date:</label>
                            <input type="date" id="date" name="date"></input>
                        </Form.Row>
                        <Form.Row>
                            <input type="submit" value="Create New Table"></input>
                            <input type="reset" value="Reset"></input>
                        </Form.Row>
                    </fieldset>
                </form>
            </Modal.Body>
    )
}

AddSamplesForm.propTypes = {

}

export default AddSamplesForm