
// import PropTypes from 'prop-types'

/**
 * component to create the body of the table
 * @component
 * @category Table
 * @subcategory Main
 * @mixin
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example
 */
const TableHeader = props => {
    return (
        <thead>
            <tr>
                {props.data.map( (header, index) =>
                    <th key={`table-header-${index}`}>{header}</th>
                )}
            </tr>
        </thead>
    )
}

// TableHeader.propTypes = {

// }

export default TableHeader
