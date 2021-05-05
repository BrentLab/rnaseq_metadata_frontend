
// import PropTypes from 'prop-types'
import TableRow from "./TableRow"
import { useState, useEffect } from "react"
import config from "../../../config"

/**
 * component to create the body of the table
 * @component
 * @category Table
 * @subcategory Main
 * @mixin
 * @mixes TableRow
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example
 */
const TableBody = props => {
    /**
     * the date corresponding to foreign key of the table the user currently wants to update (not import to view-only table). This, in conjunction with the foreign_key_researcher, is how the correct records from the previous table are selected
     * @type {string}
     */ 
    let [foreign_key_date, setForeignKeyDate] = useState(-1)
    /**
     * the researcher name corresponding to foreign key of the table the user currently wants to update (not import to view-only table). This, in conjunction with the foreign_key_researcher, is how the correct records from the previous table are selected
     * @type {string}
     */ 
    let [foreign_key_researcher, setForeignKeyResearcher] = useState(-1)
    /**
     * an object storing what the user entered when creating the new records submission table
     * @type {object}
     */
    let [new_samples_form_data, setNewSamplesFormData] = useState({})

    // onupdate functions
    useEffect(() => {
        setForeignKeyDate(props.new_samples_form_data.foreign_key_date)
    }, [props.new_samples_form_data.foreign_key_date])

    useEffect(() => {
        setForeignKeyResearcher(props.new_samples_form_data.foreign_key_researcher)
    }, [props.new_samples_form_data.foreign_key_researcher])

    // TODO: clean up creation of TableRow so that there is no duplication.
    return (
        <tbody>
            {/* determine if the table is a view table of entry table */}
            {props.entry_table_toggle
            // if entry table, test if the new table records are for the config.FIST_TABLE (most likely bioSample)
                ? (props.new_samples_form_data.table === config.FIRST_TABLE)
                    // if so, create the number of empty records which the user specified in the add_new_samples form
                    ? props.data
                        .map( (row_obj, index) => <TableRow entry_table_toggle={props.entry_table_toggle} 
                                key={`row-${index}`} 
                                row={index} 
                                selected_columns={props.selected_columns} 
                                data={row_obj} 
                                index={index} 
                                updateNewRecordObj={props.updateNewRecordObj}
                                setDateField={props.setDateField}
                                new_samples_form_data={props.new_samples_form_data}
                        />
                        )
                    // else, create the new records for tables other than the first table (all are the same, only the first is different b/c there is no foreign key)
                    :props.data
                        .filter( (row_obj, index) => 
                                    row_obj[props.new_samples_form_data.researcher_field] === foreign_key_researcher && 
                                    row_obj[props.new_samples_form_data.date_field] === foreign_key_date
                                )
                        .map( (row_obj, index) => <TableRow entry_table_toggle={props.entry_table_toggle} 
                                                            key={`row-${index}`} 
                                                            row={index} 
                                                            selected_columns={props.selected_columns} 
                                                            data={row_obj} 
                                                            index={index} 
                                                            updateNewRecordObj={props.updateNewRecordObj}
                                                            setDateField={props.setDateField}
                                                            new_samples_form_data={props.new_samples_form_data}
                                                    />
                            )
                // if not an entry table, make a view table
                : props.data.map( (row_obj, index) => <TableRow entry_table_toggle={props.entry_table_toggle} 
                                                                key={`row-${index}`} 
                                                                row={index} 
                                                                selected_columns={props.selected_columns} 
                                                                data={row_obj}
                                                                index={index}
                                                                updateNewRecordObj={props.updateNewRecordObj}
                                                                setDateField={props.setDateField} 
                                                        />
                                )
            }
        </tbody>
    )
}

// TableBody.propTypes = {

// }

export default TableBody
