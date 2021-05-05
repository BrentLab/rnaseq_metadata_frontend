import propTypes from 'prop-types'

/**
 * a checkbox used for true/false. in this case, used for entry into a table cell, but could be anywhere
 * @component
 * @category Table
 * @subcategory EntryTable
 * @todo add propTypes, description, default and then @example when that is done
 */
const CheckboxInput = props => {
    return (
        <input default={false} type="checkbox" value={true} name={props.name} onChange={(event) =>{props.changeHandler(event, "checkbox")}}></input>
    )
}

CheckboxInput.propTypes = {
    name: propTypes.string,
    changleHandler: propTypes.func

}

export default CheckboxInput
