
import propTypes from 'prop-types'

/**
 * a regular <td></td> element for a cell in a table
 * @component
 * @category Table
 * @subcategory ViewTable
 * @mixin
 * @todo add propTypes description, default, required yes/no and when done add @example
 */
const ViewCell = props => {
    return (
        <td>
            {props.data}
        </td>
    )
}

ViewCell.propTypes = {
    data: propTypes.string || propTypes.number
}

export default ViewCell
