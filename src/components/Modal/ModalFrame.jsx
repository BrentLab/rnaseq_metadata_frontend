import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/cjs/Form';
import Modal from "react-bootstrap/cjs/Modal";
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {AddSamplesForm, GeneralAlert, LoginRegisterForm} from './bodies'
import { getTableList, getTableData, getTable, getTableOptions, getPreviousTableOptions } from "../../store/database_api/actions"
import config from "../../config"

const AddNewSampleFormModal = props => {

    let modal_body;

    switch(props.modal_type){
        default:
            modal_body=<GeneralAlert content={`Good golly Batman!`}/>
            break;
        case 'add_samples_form':
            modal_body=<AddSamplesForm 
                            addNewSamplesFormData={props.addNewSamplesFormData}
                            table_array={props.table_array}
                        />
            break;
        case 'login':
            modal_body=<LoginRegisterForm toggleModal={props.toggleModal}/>
            break;
        case 'error':
            modal_body=<GeneralAlert content={`${props.error_msg}`}/>
            break;
    }

    return (
        <Modal
            size="lg"
            show={props.modal_toggle_flag}
            onHide={()=>props.toggleModal("",true)}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    {props.modal_title}
                </Modal.Title>
            </Modal.Header>
            {modal_body}
        </Modal>
    )
}

// AddNewSampleFormModal.propTypes = {

// }

export default AddNewSampleFormModal