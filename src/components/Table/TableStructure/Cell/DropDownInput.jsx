import propTypes from 'prop-types'

/**
 * a dropdown 'menu'. in this case, used for entry into a table cell, but could be anywhere
 * @component
 * @category Table
 * @subcategory EntryTable
 * @mixin
 * @todo add propTypes, description, default and then @example when that is done
 */
const DropDownInput = props => {
    let dropdown_options = props.choice_array.map(item => <option>{item}</option>);

    return (
        <select name={props.name} onChange={(event) => props.changeHandler(event, "value")}><option disabled selected value> -- select an option -- </option>{dropdown_options}</select>
    )
}

DropDownInput.propTypes = {
    name: propTypes.string,
    changeHandler: propTypes.func,
    choice_array: propTypes.array

}

export default DropDownInput
