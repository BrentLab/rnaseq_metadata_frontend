import axios from 'axios';
import config from '../../config.json'

import {
    LOGIN,
    LOGOUT,
    GET_TABLE_OPTIONS,
    GET_PAGINATED_DATA,
    POST_DATA,
    POST_ERROR,
    POST_RESPONSE
} from "./index";

export const getTableList = () => {
    return axios.get(config.PUBLIC_TABLES_URL)
}

/** 
* Register a new user via a POST request to api. Sends data to store
* @category Database_api
* @namespace Database_api.loginUser
* @alias loginUser
* @param {object} login_object in form {username: asdf, password: pass1234}
* @todo add test
* @todo make url path with function that handles / or somehow note that it needs to be included in the config
*/
export const loginUser = (login_object, dispatch) => {

    let url = config.SERVER_ROOT + `api-token-auth/`
    axios
        .post(url, login_object)
        .then((res => {
            dispatch({
                type: LOGIN,
                payload: {token: res.data.token, username: login_object.username}
            });
            dispatch({
                type: POST_RESPONSE,
                payload: {message: res.statusText, status: res.status }
            });
        }))
        .catch(err => {
             dispatch({
                type: POST_ERROR,
                payload: {message: err.message, name: err.name, config: err.config}
            });
        })
};

/** 
* Clear user info from session
* @category Database_api
* @namespace Database_api.logoutUser
* @param {object} login_object in form {username: asdf, password: pass1234}
* @todo add test
*/
export const logoutUser = (dispatch) => {
    dispatch({
        type: LOGOUT,
    });

};

/**
* a wrapper to execute both getTableOptions and getTable
* @category Database_api
* @namespace Database_api.getTableData
* @param {string} tablename name of the currently selected table, eg BioSample (need be same as API name)
* @param {string} authorization_token user authentication
* @todo add test
*/
export const getTableData = (tablename, authorization_token, dispatch) =>{
    getTableOptions(tablename, authorization_token, dispatch)
    getTable(tablename, authorization_token, dispatch)
}

/**
* Recursive method to get all pages of paginated data from a given table
* @category Database_api
* @namespace Database_api.getTable
* @see https://dev.to/haalto/recursively-fetch-data-from-paginated-api-34ig
* @param {string} tablename name of the currently selected table, eg BioSample (need be same as API name)
* @param {string} authorization_token user authentication
* @param {object} dispatch the useDispatch() function -- see todo in OPTIONS request
* @todo add test
* @todo make url path with function that handles / or somehow note that it needs to be included in the config
* @todo send error to error handler function to display to user
*/
export const getTable = async (tablename, authorization_token, dispatch) =>{
    
    const header = {'Authorization': `Token ${authorization_token}`}
    
    let table_data = [];
    let url = config.DATABASE_API_ROOT + tablename + `/?page=1`
    while (url !== null){
        const response = await axios.get(url, {headers: header})  
        table_data = table_data.concat(response.data.results)
        url = response.data.next;
    }

    dispatch({
        type: GET_PAGINATED_DATA,
        payload: table_data
    });
}

/**
* send a OPTIONS request for the given table TO DISPATCHER
* @category Database_api
* @namespace Database_api.getTableOptions
* @param {string} tablename name of the currently selected table, eg BioSample (need be same as API name)
* @param {string} authorization_token user authentication
* @todo right now, passing dispatch as an argument. Figure out the right way of dealign with dispatch
* @todo add test
* @todo make url path with function that handles / or somehow note that it needs to be included in the config
* @todo send error to error handler function to display to user
*/
export const getTableOptions = (tablename, authorization_token, dispatch) =>{
    const url = config.DATABASE_API_ROOT + tablename + '/'
    const header = {'Authorization': `Token ${authorization_token}`} 

    axios.options(url, {headers: header})
        .then(res => {
            dispatch({
                type: GET_TABLE_OPTIONS,
                payload: res.data
            });
        })
        .catch(err => {
            console.error("Error get table options: " + err)
        })
};

/**
* send a OPTIONS request for the given table RETURN A PROMISE
* @category Database_api
* @namespace Database_api.getPreviousTableOptions
* @param {string} tablename name of the currently selected table, eg BioSample (need be same as API name)
* @param {string} authorization_token user authentication
* @returns a promise with the response from the database
* @todo combine with getTableOptions with argument to use dispatcher or return promise
* @todo add test
* @todo make url path with function that handles / or somehow note that it needs to be included in the config
* @todo send error to error handler function to display to user
*/
export const getPreviousTableOptions = (tablename, authorization_token) =>{
    const url = config.DATABASE_API_ROOT + tablename + '/'
    const header = {'Authorization': `Token ${authorization_token}`} 

    return axios.options(url, {headers: header})
}


/** POST new user signup
* Send new records to database
* @category Database_api
* @namespace Database_api.postData
* @param {string} tablename name of the currently selected table, eg BioSample (need be same as API name)
* @param {object} data array of objects (new records. keys are fields of the table passed in tablename)
* @param {string} authorization_token user authentication
* @param {object} dispatch the useDispatch() function -- see todo in OPTIONS request
* @todo add test
* @todo make url path with function that handles / or somehow note that it needs to be included in the config
* @todo figure out how to capture the better error response from the database -- it does actually send back a reason why it rejects (eg "that option for column x doesn't work")
*/
export const postData = (tablename, data, authorization_token, dispatch) => {
    const url = config.DATABASE_API_ROOT + tablename + '/'
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authorization_token}`
    }

    axios
        .post(url, data, {headers: headers})
        .then((res => {
            dispatch({
                type: POST_RESPONSE,
                payload: {message: res.statusText, status: res.status }
            });
        }))
        .catch(err => {
            dispatch({
                type: POST_ERROR,
                payload: {message: err.message, name: err.Name, config: err.config, full:err}
            });
        })
};