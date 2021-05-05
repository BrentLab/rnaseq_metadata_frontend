import Form from "react-bootstrap/cjs/Form";
import PropTypes from 'prop-types'


/**
 * return a form dropdown
 * @component
 * @category TableTools
 * @mixin
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example
 */
const ColumnSelector = props => {
    return (
            <Form onChange={props.clickHandler}>
                <div key={'inline-checkbox'} className="mb-3">
                    {props.column_names.map( (colname, index) =>
                        <Form.Check key={`${colname}-${index}`} inline label={colname} value={colname} checked={props.selected_columns.includes(colname)} name={colname} type={'checkbox'} id={`inline-checkbox-${index}`}/>
                    )}
                </div>
            </Form>
    )
}

// CSS in JS
// const headingStyle = {
//   color: 'red',
//   backgroundColor: 'black',
// }

ColumnSelector.propTypes = {
    column_names: PropTypes.array,
    selected_columns: PropTypes.array
}

export default ColumnSelector