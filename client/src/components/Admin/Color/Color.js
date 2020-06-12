import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import CreateColorModal from './CreateColorModal';
import UpdateColorModal from './UpdateColorModal'
const Color = () => {

  const [show, setShow] = useState(false);
  const [show2, setShowColor] = useState(false);

  const [allColors, setAllColors] = useState([]);
  const [colorSelected, setColorSelected] = useState('');

  const optionColors = [];

  const config = {
    headers: {
        "Content-type": "application/json"
    }
}
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseColor = () => setShowColor(false);
  const handleShowColor = () => setShowColor(true);
  
  const handleSelectColor = (e) => {
    setColorSelected(e.target.value);
  }

  allColors.map(color => {
    optionColors.push(<option key={color.id} value={color.id}>{color.name}</option>)
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/color", config).then(e => {
        setAllColors(e.data);
    });
  }, [show, show2]);



  return(
    <>
    <div className="row justify-content-end mb-2">
      <button onClick={handleShowColor} className="btn btn-success mr-4 pr-5 pl-5">+ New Color</button>
      <Modal show={show2} onHide={handleCloseColor} >
        <CreateColorModal />
      </Modal>
      <button onClick={handleShow} className="btn btn-info pl-5 pr-5">Update Color</button>
      <Modal show={show} onHide={handleClose}>
        <UpdateColorModal />
      </Modal>
    </div>
    <select className="form-control form-control-lg" onChange={handleSelectColor}>
      <option value="">--- SELECT COLOR ---</option>
      {optionColors}
    </select>
    </>
  )
}

export default Color;