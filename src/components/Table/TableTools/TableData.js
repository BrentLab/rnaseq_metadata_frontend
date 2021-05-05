/**
 * a function to store the table data, store the filter array, and apply/update the filtered data for display
 * @class
 * @constructor
 * @category Table
 * @subcategory TableTools
 * @property {array} filter_array an array of filter objects in form {column: "", comparative: "<", filter_value: "some value to filter on"}
 * @property {array} passing_filter_table_data the set of records which pass the filters
 * @property {array} failing_filter_table_data the set of records that do not pass the filters
 * @property {array} comparisonOperatorsHash a dictionary with keys as comparison operators as strings, eg "<" and values as comparison functions
 * @todo consider moving the column selector functions into this, also
 * @todo write test
 */
class TableData {
    /**
     * @param {array} table_data the table data from the database
     */
    constructor(table_data){
        this.filter_array = [];
        this.passing_filter_table_data = table_data;
        this.failing_filter_table_data = [];
        this.comparisonOperatorsHash = {
            '<': function (a, b) {
                return a < b;
            },
            '>': function (a, b) {
                return a > b;
            },
            '>=': function (a, b) {
                return a >= b;
            },
            '<=': function (a, b) {
                return a <= b;
            },
            '==': function (a, b) {
                return a === b;
            },
            '===': function(a, b) { 
                return a === b; 
            }
        };
    }

    /**
     * set the filtered table data
     * @param {array} table_array an array of table objects (the objects are rows, keys in objects are fields)
     * @todo check to ensure that the keys in the new data are the same as the keys in the current data
    */
    setFilteredData(table_array){
        this.passing_filter_table_data = table_array;
    }

    /**
     * add filter to the filter array when a user clicks the 'apply' button in the filter form
     * @param {object} filter_object object with format {column: "", comparative: "<", filter_value: "some value to filter on"}
     * @todo fix the concat vs. add. should be add/push
     * @todo figure out better way of doing the filtering -- right now, double for loop. good undergraduate coding task: It would be nice to use some sort of data structure/algorithm to help with this
    */
    setFilter(filter_object){
        
        // push new filter to filter_array
        this.filter_array.push(filter_object)
        // this.setFilteredData(this.filterTableData(this.passing_filter_table_data, this.filter_array))
    }
    /**
     * filter an array of table records(objects) given an array of filter(objects)
     * @param {array} table_data array of table records(objects)
     * @param {array} filter_array array of filter(objects) each with structure {column: "", comparative: "<", filter_value: "some value to filter on"}
     * @note would like to make this a public static method (public, doesn't act directly on class properties -- public static may not be the right term, can't remember)
     * @todo this absolutely should have a good test and error handling
     */
    filterTableData(table_data, filter_array){
        // get array of comparative functions
        let comparisonOperator = filter_array.map((fltr_obj, index) => this.comparisonOperatorsHash[fltr_obj.comparative]);
        // filter the (already filtered) data with the new filter and update the passing_filtered_table_data
        let data_with_added_filter = [];
        this.passing_filter_table_data.forEach((record, index) =>{
            this.filter_array.forEach((filter, index) =>{
                if (comparisonOperator(record[filter.column], filter.filter_value)) {
                    data_with_added_filter.push(record)
                }
            })
        })
        return data_with_added_filter
    }

    /**
     * add filter to the filter array when a user clicks the 'apply' button in the filter form
     * @param {object} event onClick event
    */
    removeFilter(event){
        event.preventDefault()
        console.log("remove filter")
        console.log(event)
        const filter_obj = {}
        // this.filterTableData(this.failing_filter_table_data, filter_obj)
        // filter the failing filter data for the remaining filters and add to passing filter data
    }
    
    /**
     * return the filtered table data
    */
    getFilteredData(){
        return(this.passing_filter_table_data)
    }
    /**
     * return the filter array
    */
    getFilterArray(){
        return(this.filter_array)
    }
}

export { TableData as default };

//     /**
//      * apply filters in filter_array to displayed data
//      * @param {object} filter_object an array of objects of structure (check this!) [{colname: "", comparative: "<", value: "something"}, ...]
//      * @todo: eliminate the function and just apply these in the render function?
//      * @todo: this should likely be included in a BrentLab (or personal) javascript utils module
//      * @todo: this is code I found online at some point, but lost the citation. try to find and cite (the github "share" link)
//      * @todo: (a good intermediate coding task) figure out how to do the filtering better/more efficiently -- ideally, this would occur in 1 pass. Once the data has been filtered, when filters are added, we should only loop over the filered data. When a filter is removed, data from the 'removed' group should be searched)
//      */
// const conductFiltering = (filter_object, table_data) => {
//         let comparisonOperatorsHash = {
//             '<': function (a, b) {
//                 return a < b;
//             },
//             '>': function (a, b) {
//                 return a > b;
//             },
//             '>=': function (a, b) {
//                 return a >= b;
//             },
//             '<=': function (a, b) {
//                 return a <= b;
//             },
//             '==': function (a, b) {
//                 return a === b;
//             },
//             // '===': function(a, b) { return a === b; },
//         };

//         //comparisonOperator is an array of functions
//         let comparisonOperator = filter_array.map((fltr_obj, index) => comparisonOperatorsHash[fltr_obj.comparative]);

//         // let passing_filter_data = [];
//         // let failing_filter_data = [];

//         // for (let i = 0; i < row_data_object_array.length; i++) {
//         //     if (comparisonOperator(row_data_object_array[i][filter_object.column], filter_object.filter_value)) {
//         //         filtered_data_object_array.push(row_data_object_array[i])
//         //     }
//         // }
//         // return filtered_data_object_array

//         // let filtered_data = [];
//         // filter_object.forEach(filter => {
//         // filtered_data = conductFiltering(table_data_object, filter)
//         // });
//     };

//     class DisplayData {
//         constructor(table_data){
//             this.table_data = table_data;
//             this.filter_array = [];
//             this.passing_filter_array_indicies = [];
//             this.failing_filter_array_indicies = [];
//         }

//         addFilter(filter_obj)
//     }