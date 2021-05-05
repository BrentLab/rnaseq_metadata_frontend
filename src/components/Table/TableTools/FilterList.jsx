import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'

/**
 * list to display filters
 * @component
 * @category TableTools
 * @mixin
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example
 */
const FilterList = props => {
    return (
        <ul>
            {props.data.map( (fltr_obj, index) =>
                <li>
                    <span><Form.Check inline label="1" type="checkbox" id={`inline-checkbox-${index}`} /></span>
                    <span>column: {fltr_obj.column}</span>
                    <span>comparative: {fltr_obj.comparative}</span>
                    <span>value: {fltr_obj.value}</span>
                    <span><Button size="sm" variant="danger" type="submit" onClick={()=>{props.removeFilter(fltr_obj)}}>Delete</Button></span>
                </li>
            )}
        </ul>
    )
}

// CSS in JS
// const headingStyle = {
//   color: 'red',
//   backgroundColor: 'black',
// }

FilterList.propTypes = {
    data: PropTypes.array
}

export default FilterList
