import propTypes from 'prop-types'
import { useEffect, useState} from 'react'
import CheckboxInput from "./CheckboxInput"
import DropDownInput from "./DropDownInput"
import { useSelector } from 'react-redux';

/**
 * return a form dropdown
 * @component
 * @category Table
 * @subcategory EntryTable
 * @mixin
 * @mixes CheckboxInput
 * @mixes DropDownInput
 * @todo add propTypes, description, default, required status, and when done, add @example
 */
const FormCell = props => {
    /**
     * retrieve store data
     * @param {object} state see the src/store/reducers/database_api
     * @todo this code (including the comments) are repeated every time the database_api is called. Either make this more concise using the better react hooks or move into a common lib to avoid repetition
     * @todo clean up the cell creation code block -- there is a todo down there to look at, also
     */ 
    const table_state = state => state.database_api
    /**
     * assign store data to object
     * @type {object}
     */ 
    const table_state_data = useSelector(table_state)

    /**
     * foreign key column of the given table (see database_api reducer state.description.foreign_key)
     * @type {string}
     * @todo change the reducer state foreign_key to foreign_key_field. Optional: avoid setting state when it is the same as store?
     */ 
    let [foreign_key_field, setForeignKeyField] = useState('')
    /**
     * date_field of given table, see reducer state.description.date_field)
     * @type {string}
     */ 
    let [date_field, setDateField] = useState('')
    /**
     * researcher field of a given table
     * @type {string}
     */ 
    let [researcher_field, setResearcherField] = useState('')
    /**
     * If the given column has options (eg, bioSample medium), store here. store as object with structure {type: 'choice', choices: []} TODO: check that the structure is accurate
     * @type {object}
     */
    let [options, setOptions] = useState({type: '-1', choices: ["...loading"]})
    
    /**
     * handle change events in input cells of the entry table by passing up to the updateRowRecord prop (passed from table row) to assemble into a input record
     * @param {object} event is a click object from onChange, onClick, etc
     * @param {string} target_type element of the following set: {checkbox, value} else error TODO: add better error handling
     */
    const handleChange = (event, target_type) =>{
        switch(target_type){
            default:
                console.error("form cell event.target type not recognized: " + target_type)
                break;
            case "checkbox":
                 props.updateRowRecord({[props.colname]: event.target.checked})
                 break;
            case "value":
                props.updateRowRecord({[props.colname]: event.target.value})
                break;
        }
    };
    
    // watch for updates to the store
    useEffect(() => {
        if('description' in table_state_data.table_options){
            setForeignKeyField(table_state_data.table_options.description.foreign_key)
        }
        // update record (see function in TableRow)
        props.updateRowRecord({[props.colname]: props.data})
    }, [table_state_data.table_options])

    useEffect(() => {
        if('description' in table_state_data.table_options){
            const date_field_tmp = table_state_data.table_options.description.date_field
            setDateField(date_field_tmp)
            // update record (see function in TableRow)
            if (props.colname === date_field_tmp && props.new_samples_form_data.date){
                props.updateRowRecord({[props.colname]: props.new_samples_form_data.date}, true)
            }
            // TODO: THIS IS IN APP -- INEFFICIENT AND BAD METHOD OF FILTERING THE ENTRY TABLE PRIOR TO SUBMISSION. NEEDS TO BE FIXED
            props.setDateField(date_field_tmp)
        }
    }, [table_state_data.table_options, props.new_samples_form_data.date])

    useEffect(() => {
        if('description' in table_state_data.table_options){
                setResearcherField(table_state_data.table_options.description.researcher_field)
            // update record (see function in TableRow)
            if (props.colname === table_state_data.table_options.description.researcher_field){
                props.updateRowRecord({[props.colname]: table_state_data.login.username})
            }
        }
    }, [table_state_data.table_options])

    useEffect(() => {
        setOptions(props.options)
    }, [props.options])

    // create input cell
    let cell;
    if(props.colname === foreign_key_field){
        cell = <td>{props.data}</td>
    }else if (props.colname === date_field){
        cell = <td>{props.new_samples_form_data.date}</td>
    } 
    else if(props.colname === researcher_field){
        cell = <td>{table_state_data.login.username}</td>
    }
    // todo: this is very ugly. Relying on the fact that there will be a 'type' slot if there is an options slot, and if the types don't match choice or boolean, default to text.
    //       this whole cell creation needs to be at the very least better commented, and better, cleaned up
    else if('type' in options){
        if(options['type'].toLowerCase() === 'choice'){
            let choice_array = options.choices.map( (item, index) => item.value)
            cell = <td><DropDownInput name={props.colname} choice_array={choice_array} changeHandler={handleChange}/></td>
        }else if(options['type'].toLowerCase() === 'boolean'){
            cell = <td><CheckboxInput name={props.colname} changeHandler={handleChange} /></td>
        }
        else{
        cell = <td><input type="text" onChange={(event)=>handleChange(event, "value")}></input></td> 
    }
    }
    // moved this into the else if 'type' in options above to fix error when type didn't exist in options. this works, but it is very messy -- see todo above
    // remove this when this section is cleaned up
    // else{
    //     cell = <td><input type="text" onChange={(event)=>handleChange(event, "value")}></input></td> 
    // }
    
    return (
        <>{cell}</>
    )
}

FormCell.defaultProps = {
    options: [{type: '-1', choices: ["...loading"]}]
}

FormCell.propTypes = {
        data: propTypes.array,
        options: propTypes.array,
        colname: propTypes.string,
        new_samples_form_data: propTypes.object,
        updateRowRecord: propTypes.func

}

export default FormCell
