import Form from "react-bootstrap/cjs/Form";
import Row from "react-bootstrap/cjs/Row";
import Button from "react-bootstrap/Button";
import propTypes from 'prop-types';

/**
 * return a form with the fields necessary to filter any given metadata table
 * @component
 * @category TableTools
 * @mixin
 * @todo add propTypes description, defaults, and whether they are rquired, for all props. when defaults are added, add tag @example
 */
const FilterForm = props => {
    let comparative_array = [">", ">=", "<", "<=", "=="];
    let column_names_options = props.column_names.map((option, index) => <option key={`filter-colnames-${index}`} value={option}>{option}</option>);
    let comparative_dropdown_options = comparative_array.map((option, index) => <option key={`filter-comparatives-${index}`} value={option}>{option}</option>);
    return (
        <Form id="filter" onSubmit={props.submit_handler}>
            <fieldset>
                <Row sm="auto">
                    <label htmlFor="column">Column:</label>
                    <select id="column" name="column">{column_names_options}</select>
                </Row>
                <Row sm="auto">
                    <label htmlFor="comparative">Comparative:</label>
                    <select id="comparative" name="comparative">{comparative_dropdown_options}</select>
                </Row>
                <Row sm="auto">
                    <label htmlFor="filter_value">filter_value:</label>
                    <input type="text" id="filter_value" name="filter_value" defaultValue="enter a value on which to filter"></input>
                </Row>
                <Row sm="auto">
                    <Button size="sm" variant="success" type="submit">Apply Filter</Button>
                </Row>
            </fieldset>
        </Form>
    )
}

FilterForm.propTypes = {
    column_names: propTypes.array,
    submit_handler: propTypes.func

}

export default FilterForm
