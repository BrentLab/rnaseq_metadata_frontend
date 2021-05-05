import {
    LOGIN,
    LOGOUT,
    GET_TABLE_OPTIONS,
    GET_PAGINATED_DATA,
    POST_RECORD,
    PATCH_RECORD
} from "../database_api/index.js";


/**
 * initial state describes the structure of data that will be stored. Currently format is {login: {}, selected_table: "", table_options: {}, table_fields: [], table_data:[]}
 * @namespace redux.initialState
 * @category redux
 * @type object
 * @todo improve documentation (one, there are likely formal tools for documenting objects. two, more description of the keys and what goes in them)
 */
const initialState = {
    // TODO: remove hard coding -- extract this info from table_options. Get table options, put required unique into these? maybe change the actual column names so that they have an internal name and display name?
    // TODO: fix name to something like "database_design"
    login: {},
    selected_table: "",
    table_options: {},
    table_fields: [],
    table_data: []
};

/**
 * handles update to the redux store for the database_api functions
 * @namespace redux.database_api_reducer
 * @category redux
 */
export default function (state = initialState, action) {
    // convention is switch statement
    switch (action.type) {
        default:
            return state;
        case GET_TABLE_OPTIONS:
            const primary_key = JSON.parse(action.payload.description).primary_key
            const foreign_key = JSON.parse(action.payload.description).foreign_key
            const researcher_field = JSON.parse(action.payload.description).researcher_field
            const date_field = JSON.parse(action.payload.description).date_field
            const description_obj = JSON.parse(action.payload.description)
            return {
                ...state,
                table_fields: Object.keys(action.payload.actions.POST),
                table_options: {pk: primary_key, fk: foreign_key, researcher_field: researcher_field, date_field: date_field, ...action.payload, description: description_obj}
            };
        case GET_PAGINATED_DATA:
            return {
                ...state,
                // table_fields: Object.keys(action.payload[0]),
                table_data: action.payload
            };
        case LOGIN:
            return {
                ...state,
                login: {token: action.payload.token, username: action.payload.username}
            } 
        case LOGOUT:
            return {
                ...state,
                login: {}
            } 
    }
}