import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

const UpdateColorModal = () => {
  const [msgError, setMsgError] = useState(null);
  const [newColor, setNewColor] = useState("");
  const [oldColor, setOldColor] = useState("");
  const [allColors, setAllColors] = useState([]);
  const optionColors = [];
  const token = store.getState().auth.token

  const config = {
    headers: {
      "Content-type": "application/json",
      "Authorization": 'Bearer '+token
    }
  }

  // useEffect(() => {
  //   if (token) {
  //     config.headers['Authorization'] = 'Bearer ' + token;
  //   }
  // }, [token]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_LINK + "/api/color", config).then(e => {
      setAllColors(e.data);
    });
  }, []);

  allColors.map(color => {
    optionColors.push(<option key={color.id} value={color.id}>{color.name}</option>)
  });

  const selectNewColor = (event) => setOldColor(event.target.value);
  const onChange = (event) => {
    let res = event.target.value.trim();
    let str = res.toLowerCase();
    let color = str.charAt(0).toUpperCase() + str.slice(1);
    setNewColor(color.replace(/[\s]{2,}/g, " "));
  }

  function onSubmit(e) {
    e.preventDefault()

    if (oldColor && newColor) {
      setMsgError(null);

      if (newColor.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
        setMsgError("Invalid charactere");
      } else {
        const body = {
          "name": newColor
        }
        axios.put(process.env.REACT_APP_API_LINK + "/api/color/" + oldColor, body, config).then(res => {
          toast.success(res.data.message, { position: "top-center" });
          axios.get(process.env.REACT_APP_API_LINK + "/api/color", config).then(e => {
            setAllColors(e.data);
          });
        }).catch(err => {
          toast.error('Color name already exist !', { position: 'top-center' });
        })
      }
    }
    else {
      setMsgError("selected the 2 colors");
    }
  }

  return (
    <>
      <Modal.Header closeButton>Update color !</Modal.Header>
      <Modal.Body>
        {msgError ? <Alert> {msgError} </Alert> : null}
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <select className="form-control form-control" onChange={selectNewColor}>
              <option value="">---SELECT COLOR---</option>
              {optionColors}
            </select><br />
            <Label for="newColor">New name</Label>
            <Input
              type="text"
              name="newColor"
              id="newColor"
              placeholder="Color name"
              onChange={onChange}
            />
            <Button color="dark" className="mt-4" block>Update</Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </>
  )
}

export default UpdateColorModal;