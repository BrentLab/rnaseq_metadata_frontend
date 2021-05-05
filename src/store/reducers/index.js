// "meeting place for all other reducers"
import { combineReducers} from "redux";
import database_api from "./database_api"

/**
 * A meeting place for all the reducers in src/store/reducers
 * @namespace redux.combineReducers
 * @category redux
 * @param {object} combineReducers ({ and a list of reducers, imported in the import statements in this script})
 */
export default combineReducers({
    database_api
});