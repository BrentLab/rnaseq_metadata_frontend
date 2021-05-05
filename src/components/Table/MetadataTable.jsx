import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Container from "react-bootstrap/cjs/Container";
import Col from "react-bootstrap/cjs/Col";
import Row from "react-bootstrap/cjs/Row";
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import {TableBody, TableHeader} from "./TableStructure"
import {ColumnSelector, FilterForm, FilterList, TableData} from "./TableTools"
import { removeColumnFromList, postData } from "../../store/database_api/actions"
import config from "../../config"

/**
 * Main script which creates the view of the table from the database. This creates either a view-only table, or an 'entry table' which allows a user to input new records
 * @component
 * @category Table
 * @subcategory Main
 * @mixes ColumnSelector
 * @mixes FilterForm
 * @mixes FilterList
 * @mixes TableBody
 * @mixes TableHeader
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example
 * @todo make the documentation sidebar structure (@category and @subcategory tags) match the directory structure. Similarly, make sure directory/script structure is useful (maybe combine the different cell types into a single script? Same re header, body, row?)
 * @todo add sorting
 * @todo consider (very, very strongly) using the DataTable package
 * @todo clean up the useEffect --> i am still figuring out how to use the hooks correctly
 */
const MetadataTable = props => {
    
    // todo: figure out a better way of doing this
    // pass this to any function that is communicating with the redux store
    const dispatch = useDispatch()

    /**
     * the new_record_obj is the json object that stores the new records a user enters in the entry table.
     * @description structure {index1: {col1: value2, col2: value2}, index2: {...}, ...}
     * @param {object} state see the src/store/reducers/database_api
    */ 
    let [new_record_obj, setNewRecordObj] = useState({})
    /**
     * store the current table date_field
     * @param {object} state see the src/store/reducers/database_api
    */ 
    let [date_field, setDateField] = useState("")
    /**
     * retrieve store data
     * @param {object} state see the src/store/reducers/database_api
     */ 
    const table_state = state => state.database_api
    /**
     * assign store data to object
     * @type {object}
     */ 
    const table_state_data = useSelector(table_state)
    /**
     * array of column names from the database (see the getTableList() in database_api)
     * @type {array}
     */ 
    const [column_names, setColumnNames] = useState(table_state_data.table_fields)
    /**
     * array of column names from the database (see the getTableList() in database_api)
     * @type {array}
     */ 
    const [passing_filter_table_data, setPassingFilterTableData] = useState(table_state_data.table_data)
    /**
     * array of column names from the database (see the getTableList() in database_api)
     * @type {array}
     */ 
    const [failing_filter_table_data, setFailingFilterTableData] = useState([])
    /**
     * primary key of a given database (see the database_api reducer, state variables, table_options.description)
     * @type {string}
     */
    const [primary_key, setPrimaryKey] = useState("")
    /**
     * foreign key of a given database (see the database_api reducer, state variables, table_options.description)
     * @type {string}
     */
    const [foreign_key, setForeignKey] = useState(null)
    /**
     * array of fields selected from the table_options fields of a given table
     * @type {array}
     */
    const [selected_columns, setSelectedColumns] = useState([])
    /**
     * array of objects, each being a filter with structure{column_name, comparative, value} **TODO: this may not be the actual structure -- fix if it is not
     * @type {array}
     */
    const [filter_array, setFilterArray] = useState([])
    /**
     * array of new records -- used to store new records when a user is entering data via addSample functionality
     * @type {array}
     */
    const [new_record_array, setNewRecordArray] = useState([])
    /**
     * array of empty 'data', with the same structure as table_data, which is used when a user is inputting new entries into config.FIRST_TABLE (probably bioSample)
     * @type {array}
     * @todo improve both the documentation and commenting, as well as the method of producing this array -- it is very unclear right now
     */
     const [first_table_data_array, setFirstTableDataArray] = useState([])

    /**
     * comparisonOperatorsHash a dictionary with keys as comparison operators as strings, eg "<" and values as comparison functions
     * @type {array}
     */
    let comparisonOperatorsHash = {
            '<': function (a, b) {
                return a < b;
            },
            '>': function (a, b) {
                return a > b;
            },
            '>=': function (a, b) {
                return a >= b;
            },
            '<=': function (a, b) {
                return a <= b;
            },
            '==': function (a, b) {
                return a === b;
            },
            '===': function(a, b) { return a === b; }
        };

    /**
     * add filter to the filter list when a user clicks the 'apply' button in the filter form
     * @param {object} event onClick event
     * @todo accept more arguments so that re-checking the filter box will re-add/apply the filter
     */
    const addFilter = event =>{
        event.preventDefault()
        const form_data = new FormData(event.target)
        const filter_obj = {column: form_data.get('column'), 
                            comparative: form_data.get('comparative'), 
                            value: form_data.get('filter_value') }
        setFilterArray(filter_array.concat(filter_obj))
    }

    /**
     * remove filter to the filter list when a user clicks delete button next to the filter, or when the user unchecks the box
     * @param {object} event onClick event
     * @note TODO: fix the concat vs. add. should be add/push
     */
    const removeFilter = (filter_object) =>{
        const updated_fltr_array = filter_array.filter(current_fltr_obj => current_fltr_obj !== filter_object)
        setFilterArray(updated_fltr_array)
    }

    /**
     * filter an array of table records(objects) given an array of filter(objects)
     * @param {array} table_data array of table records(objects)
     * @param {array} filter_array array of filter(objects) each with structure {column: "", comparative: "<", filter_value: "some value to filter on"}
     * @return {object} structure {passing_fltr: [array of passing records], failing_fltr: [array of failing records]}
     * @note would like to make this a public static method (public, doesn't act directly on class properties -- public static may not be the right term, can't remember)
     * @todo this should have a good test and error handling
     */
    const filterTableData = (table_data, filter_array) =>{
        // get array of comparative functions
        let comparisonOperator = filter_array.map((fltr_obj, index) => comparisonOperatorsHash[fltr_obj.comparative]);
        // filter the (already filtered) data with the new filter and update the passing_filtered_table_data
        let passing_fltr_data = [];
        let failing_fltr_data = [];
        // loop over records
        table_data.forEach((record, index) =>{
            let add_flag = true;
            // loop over filters
            filter_array.forEach((filter, index) =>{
                // if any filter fails, set add_flag to false
                try{
                    if (!(comparisonOperator[index](record[filter.column], filter.value))) {
                        add_flag = false;
                    }
                }catch(e){
                    console.error("error in filter loop: ", e)
                }
            })
            // if the add_flag is true (record passes all filters) add the record to the passing 'good' samples list
            if(add_flag){
                passing_fltr_data.push(record)
            } else{
                failing_fltr_data.push(record)
            }
        });
        return {passing_fltr: passing_fltr_data, failing_fltr: failing_fltr_data}
    }

    /**
     * add to the new_record_object
     * @description the new_record_obj is a json object with the structure {index1: {col1: value2, col2: value2}, index2: {...}, ...}
     * @param {int} index the numeric row index (from TableRow, passed down from TableBody)
     * @param {object} cell_data an object of the form {colname: value} which is created in FormCell (or the functions below FormCell)
    */
    const updateNewRecordObj = (index, cell_data) =>{

        let new_record_obj_tmp = new_record_obj;

        new_record_obj_tmp[index] = {...new_record_obj_tmp[index], 
                                    [Object.keys(cell_data)[0]]: Object.values(cell_data)[0]};
        // filter for the selected columns and update the state
        removeUnselectedColumnFromEntryData(new_record_obj_tmp)
    }


    /**
     * filter a "row", which is a key (indexed 0:n) object of the new_record_obj property. Eg if the user is entering three new entries, the new_record_obj would be {0: {}, 1: {}, 2: {}}
     * and this function would remove all unselected columns from that object
     * @param {object} new_database_records default set to -1, which indicates that new_record_obj will be updated. Else, the object passed will be used (see updateNewRecordObj())
     */
    const removeUnselectedColumnFromEntryData = (new_database_records = -1) =>{

        let new_record_obj_tmp = new_database_records === -1
                                    ? new_record_obj
                                    : new_database_records

        // filter out the unselected columns from the entry object
        Object.keys(new_record_obj_tmp).forEach( key =>{
            let row_tmp = new_record_obj_tmp[key]
            Object.keys(row_tmp).filter( col => !selected_columns.includes(col)).forEach( col => delete row_tmp[col])
            new_record_obj_tmp[key] = row_tmp
        })
        // update state
        setNewRecordObj(new_record_obj_tmp)
    }

    const submitNewRecords = () =>{
    // TODO: need to figure out how to AVOID having to do this. Right now, when the entry table is made, all rows are pushed into the new table object.
    // only a subset (selected by fk researcher and fk date)  are then edited. this removes those that have undefined dates, which will be rows we don't care
    // about. obviously bad use of memory and unnecessary looping
    let keys_to_keep = []
        Object.keys(new_record_obj).forEach((key, index) =>{
        if(new_record_obj[key][date_field]){
          keys_to_keep.push(key)
        }
      })
    let filtered_record_obj = {}

    keys_to_keep.forEach( (key, index) => {
      
      let x = Object.keys(new_record_obj[key]).forEach(field => new_record_obj[field] == undefined && delete new_record_obj[field])
      
      filtered_record_obj[key] = new_record_obj[key]
    })
    
    console.log(Object.values(filtered_record_obj))
    postData(props.new_samples_form_data.table, Object.values(filtered_record_obj), table_state_data.login.token, dispatch)
  }

/**
  * cancel new record entry, reset to table view rather than input view
  */
  const cancelNewRecordsEntry = () =>{
    // clear entry form data
    props.setNewSamplesFormData({})
    // set the table back to the view table rather than entry table
    props.setEntryTableToggle(false)
  }

/**
  * unset all added values in the new records input so that only original form data is entered
  */
  const resetNewRecordsEntry = () =>{
    console.log("reset new records")
  }

    /**
     * handle click actions on table entry form button group -- submit, cancel, reset, currently
     * @param {object} event onClick event
     * @param {string} type one of {submit_new_records, cancel_new_records, reset_new_records}, which are options of the button group that appears when a user is entering new table data 
     */
    const formBtnGrpHandler = (event, type) =>{
        event.preventDefault();
        switch(type) {
            case "submit_new_records":
                submitNewRecords([{one: "one", two: "two"}])
                break;
            case "cancel_new_records":
                // clear entry form data
                props.setNewSamplesFormData({})
                // set the table back to the view table rather than entry table
                props.setEntryTableToggle(false)
                break;
            default:
                props.alertUserError("form submission button type not recognized")
                break;
        }

    }

    /**
     * add or remove a field from the table when the user interacts with the column (field) selector checkboxes
     * @param {object} event onClick event
     */
    const handleColumnSelectorClick = event =>{
        // if the box is checked (true), push it to array. else remove it
        if (event.target.checked){
            setSelectedColumns(selected_columns.concat(event.target.value))
        } else{
            setSelectedColumns(selected_columns.filter(column => column !== event.target.value))
        }
    }

    // handle updates (this hook replaces didmount, didupdate, didumount)
    // note, order of these does matter, but throughout the codebase, use of these hooks needs to be improved
    useEffect(() => {
        setFilterArray([])
    }, [table_state_data.table_data])

    useEffect(() => {
        const failing_data_filter_result = filterTableData(failing_filter_table_data, filter_array)
        const passing_data_filter_result = filterTableData(passing_filter_table_data, filter_array)

        let passing_concat = [].concat(failing_data_filter_result.passing_fltr, passing_data_filter_result.passing_fltr)
        let failing_concat = [].concat(failing_data_filter_result.failing_fltr, passing_data_filter_result.failing_fltr)
  
        setPassingFilterTableData(passing_concat)
        setFailingFilterTableData(failing_concat)
    }, [filter_array])

    useEffect(() => {
        const table_fields = table_state_data.table_fields
        const table_options = table_state_data.table_options
        const primary_key = table_options.pk
        const foreign_key = table_options.fk
        const researcher_field = table_options.researcher_field
        const date_field = table_options.date_field

        const selected_columns_array = [];
        // update primary, foreign keys and selected columns
        setPrimaryKey(primary_key)
        if(!props.entry_table_toggle){
            selected_columns_array.push(primary_key)
        }
        if (foreign_key){
            setForeignKey(foreign_key)
            selected_columns_array.push(foreign_key)
        }
        if (props.entry_table_toggle){
            selected_columns_array.push(researcher_field)
            selected_columns_array.push(date_field)
        }
        setSelectedColumns(selected_columns_array)

        // set array of table fields as column headers
        if(props.entry_table_toggle){
            const index = table_fields.indexOf(primary_key)
            table_fields.splice(index,1)
        }
        setColumnNames(table_fields)
    }, [table_state_data.table_fields, table_state_data.table_options.description]);
    
    // update state when the table_data changes
    useEffect(() => {
        if(table_state_data.table_data === {}){
            setSelectedColumns([])
        }
        setPassingFilterTableData(table_state_data.table_data)
    }, [table_state_data.table_data]);

    // create an empty array mimicing the row data array for a new config.FIRST_TABLE (most likely new bioSample table entries)
    useEffect( () =>{
        if(props.entry_table_toggle){
            const num_new_samples = parseInt(props.new_samples_form_data.num_samples) || 0
            const num_cols = Object.keys(table_state_data.table_options.actions.POST).length
            let first_table_array_tmp = Array(num_new_samples).fill(new Array())
            first_table_array_tmp = first_table_array_tmp.map( (row_arr, index) => Array(26).fill(new Object()))
            setFirstTableDataArray(first_table_array_tmp)
        }
    },[table_state_data.table_options, props.new_samples_form_data])

    // update the entry form data when the selected_columns are updated
    useEffect(() => {
        // if the entry table is on 
        // when the selected_columns are changed, update the keys in the entry form data 
        props.entry_table_toggle && removeUnselectedColumnFromEntryData()
    }, [selected_columns])

    /**
     * MetadataTable css
     * @type {object}
     */
    const style = {
        container: {marginTop: 25},
        filter_list: {height: 150, overflowY: 'scroll'}
    };
    
    return (
        <Container style={style.container} fluid>
            <Row>
                <Col>
                    <ColumnSelector column_names={column_names} selected_columns={selected_columns} clickHandler={handleColumnSelectorClick}/>
                </Col>
                {!props.entry_table_toggle
                    ? <Col>
                        <Row>
                            <Col><FilterForm column_names={column_names} submit_handler={addFilter}/></Col>
                            <Col style={style.filter_list}><FilterList data={filter_array} removeFilter={removeFilter}/></Col>
                        </Row>
                      </Col>
                    : null
                }
            </Row>
            {props.entry_table_toggle 
                ? <Row>
                    <Button variant="info" onClick={(event) => formBtnGrpHandler(event, "submit_new_records")}>Submit</Button>
                    <Button variant="danger" onClick={(event) => formBtnGrpHandler(event, "cancel_new_records")}>Cancel</Button>
                  </Row> 
                : null
            }
            <Row>
                <Table style={{marginTop: 25}} striped bordered hover responsive>
                    <TableHeader data={selected_columns}/>
                    <TableBody selected_columns={selected_columns} 
                               data={(props.entry_table_toggle === true && 
                                      props.new_samples_form_data.table === config.FIRST_TABLE) 
                                        ? first_table_data_array
                                        : passing_filter_table_data}
                               new_samples_form_data={props.new_samples_form_data}
                               entry_table_toggle = {props.entry_table_toggle}
                               updateNewRecordObj = {updateNewRecordObj}
                               setDateField={setDateField}
                    />
                </Table>
            </Row>
        </Container>
    )
}

MetadataTable.propTypes = {
    new_samples_form_data: PropTypes.object,
    entry_table_toggle: PropTypes.bool,
    setEntryTableToggle: PropTypes.func,
    setNewSamplesFormData: PropTypes.func,
    addNewSamplesFormData: PropTypes.func,
    alertUserError: PropTypes.func
}

export default MetadataTable
