
// import PropTypes from 'prop-types'
import { useEffect, useState} from 'react'
import ViewCell from "./Cell/ViewCell"
import FormCell from "./Cell/FormCell"
import { useSelector } from 'react-redux';

/**
 * component to create a row of a table
 * @component
 * @category Table
 * @subcategory Main
 * @mixin
 * @mixes FormCell
 * @mixes ViewCell
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example
 * @todo see all useEffets -- where there is a 'key' in 'state', this needs to be fixed somehow. In class components, the componentDidUpdate tested if old state was equal to new state. figure out how to do that cleanly with this sytem
 */
const TableRow = props => {
    /**
     * retrieve store data
     */ 
    const table_state = state => state.database_api
    /**
     * assign store data to object
     * @type {object}
     */ 
    const table_state_data = useSelector(table_state)
    /**
     * stores the table_options. see the database_api reducer state object table_options. data of interest for this variable is in the POST key
     * @type {object}
     */ 
    const [options, setOptions] = useState([])
    /**
     * a new record object, used if the user is entering new records into the entry table view
     * @type {object}
     */ 
    const [record, setRecord] = useState({})

    /**
     * pass the, critically, row index, and the form_cell_object up to the function passed down through the Table object from App.js 
     * @param {object} form_cell_obj in the structure {colname: column_value} eg {rnaDate: 2021-05-17}
     * @param {boolean} date_field_flag default false. set to true if the field is the date_field of the table. This is a BAD method of dealing with filtering the new_record_object in App
     *                  TODO: get this fixed -- very inefficient currently
     * @todo figure out a better way to prevent the table from filling the new_record_obj with a new 'empty record' for the length of bioSample when entering the new table (see todo in function)
     *       this is part of a larger issue regarding filtering the data to display for both the view table and the entry table
     */
    const updateRowRecord = (form_cell_object) =>{
        // note: this is not a good way of doing this -- > 2 prevents the updateNewRecordObj unless more than 2 fields
        // in the new sample form (filled in the modal) have been entered. This prevents filling the new_record_obj with
        // all rows in a given table
        Object.keys(props.new_samples_form_data).length > 2 && props.updateNewRecordObj(props.index, form_cell_object)
    }

    useEffect(() => {
        if('actions' in table_state_data.table_options){
            setOptions(table_state_data.table_options.actions.POST)
        }
    }, [table_state_data.table_options])

    // create table cell
    let cell_array = props.entry_table_toggle 
        ? props.selected_columns.map( (colname, index) =>
            <FormCell key={`row-${props.row}-cell-${index}`} 
                      data={props.data[colname]}
                      options={options[colname]} 
                      colname={colname}
                      new_samples_form_data={props.new_samples_form_data}
                      updateRowRecord={updateRowRecord}
                      setDateField={props.setDateField}

            />)
        : props.selected_columns.map( (colname, index) =>
            <ViewCell key={`row-${props.row}-cell-${index}`} 
                      data={props.data[colname]} 
            />)
    
    return (
        <tr>
            {cell_array}
        </tr>
    )
}

// TableRow.propTypes = {

// }

export default TableRow
