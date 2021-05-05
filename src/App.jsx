import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Header from "./components/Header";
import MetadataTable from "./components/Table/MetadataTable"
import QualityMetricsDashboard from "./components/QualityMetrics/QualityMetricsDashboard"
import ModalFrame from "./components/Modal/ModalFrame.jsx"
import { getTableList, postData } from "./store/database_api/actions"

// TODO: I had wrapped the app in thep provider here, but moved the provider/store (redux) out to index.js. update this b/c it now has access to the store (if needed -- may not be. in fact, maybe take the redux/store out all together)

// TODO: do not call tableData from Add New Samples modal. Only deal with options. Then, send tableData with parameters to GET the relevant entries from the database (rather than getting the whole table from the database and then filtering in the users browser)
//       This will fix the stupid filtering done when the user hits submit currently

// TODO: queryDF equivalent function with a filterField for each table. Send the filters to the database, return combined metadata (this can be done programmatically, also, as combinedMetadata should be part of the API). Add export to csv function

// TODO: fix all interaction with store. While the topic doesn't seem like it would be the case, there is good inforamtion in the second half of this: https://blog.logrocket.com/your-reference-guide-to-using-typescript-in-react/

// TODO: fix 'required' status on property types for documentation

// TODO: fix organization of documentation -- get it to follow the structure of the directory sturcture

// TODO: move all styling to index.css -- i had trouble with that, but i think moving the redux provider out to index.js fixed it

// TODO: make these @todo comments in jsdocs comment

// TODO: see if moving redux provider tag out to index.js allows for dispatch in the actions without passing it as a argumet

function App() {

    /**
    * retrieve redux store
    */
    const table_state = state => state.database_api

    /**
     * assign redux store to object
     * @type {object}
     */
    const table_state_data = useSelector(table_state)
    const dispatch = useDispatch()

  let [table_array, setTableArray] = useState(['...loading']);
  let [modal_toggle_flag, setModalToggleFlag] = useState(false)
  let [modal_type, setModalType] = useState("")
  let [error_msg, setErrorMessage] = useState("")
  let [entry_table_toggle, setEntryTableToggle] = useState(false)
  let [selected_table, setSelectedTable] = useState("")

  /**
   * holds the data entered from the AddNewSampleFormModal, passes to MetadataTable
   * @param {object} state see the src/store/reducers/database_api
  */ 
  let [new_samples_form_data, setNewSamplesFormData] = useState({})

  let [quality_metrics_toggle, setQualityMetricsToggle] = useState(false)

  // on mount, get the list of tables
  useEffect(() => {
        getTableList()
            .then(res =>{
                setTableArray(res.data.table_list)
            })
    }, [])

 /**
   * toggle the add sample modal on/off
   * @param {string} modal_type set to "" if cancelling the modal, otherwise pass one of {add_samples_form, login_register}
   * @param {boolean} force_false force the modal flag to false
  */
  const toggleModal = (modal_type, force_false=false) =>{
    setModalType(modal_type)
    setModalToggleFlag(!modal_toggle_flag);
      if (force_false){
        setModalType("")
        setEntryTableToggle(false)
      }
  }

 /**
   * display message in modal
   * @param {string} msg a message to display to the user in the modal
  */
  const alertUserError = (msg) =>{
    setErrorMessage(msg)
    setModalType("error")
    setModalToggleFlag(true)

  }
  
  /**
   * toggle which table to display -- the view table (static) or entry table
   */
  const entryTableToggle = () =>{
    setEntryTableToggle(true);
  }

  /**
   * toggle which table to display -- the view table (static) or entry table
   */
  const qualityMetricsToggle = (event) =>{
    event.preventDefault();
    setQualityMetricsToggle(!quality_metrics_toggle);
  }

  /**
   * set the data necessary to set up the new samples entry table form
   */
  const addNewSamplesFormData = (obj) =>{
    setModalToggleFlag(!modal_toggle_flag)
    setNewSamplesFormData(obj)
  }

  // note: already passing setSelectedTable down to Header re todo above, need to implement in Header still
  let modal_props_dict = {};
  let view = quality_metrics_toggle
    ? <QualityMetricsDashboard />
    : <MetadataTable 
        new_samples_form_data={new_samples_form_data}
        setNewSamplesFormData={setNewSamplesFormData}
        entry_table_toggle={entry_table_toggle}
        setEntryTableToggle={setEntryTableToggle}
        addNewSamplesFormData={addNewSamplesFormData}
        alertUserError={alertUserError}
    />
  return (
    <>
      <ModalFrame 
          toggleModal={toggleModal}
          modal_toggle_flag={modal_toggle_flag}
          modal_type={modal_type}
          addNewSamplesFormData={addNewSamplesFormData} 
          table_array={table_array}
          error_msg={error_msg}

      />
      <Header 
          database_name='Yeast Metadata'
          table_array={table_array} 
          entryTableToggle={entryTableToggle}
          selected_table = {selected_table} 
          setSelectedTable={setSelectedTable} 
          toggleModal={toggleModal}
          qualityMetricsToggle={qualityMetricsToggle}
          alertUserError={alertUserError}
      />
      {view}
    </>
  );
}

export default App;
