import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

const CreateColorModal = () => {
  const [msgErrorColor, setErrorColor] = useState(null);
  const [colorCreate, setColor] = useState("");
  const [allColors, setAllColors] = useState([]);
  const optionColors = [];
  const config = {
    headers: {
        "Content-type": "application/json"
    }
}

allColors.map(color => {
  optionColors.push(<option key={color.id} value={color.id}>{color.name}</option>)
});

  const onChangeColor = (event) => {
      let res = event.target.value.trim();
      let str = res.toLowerCase();
      let color = str.charAt(0).toUpperCase() + str.slice(1);
      setColor(color.replace(/[\s]{2,}/g, " "));
  }

  function onSubmit2(e) {
    e.preventDefault()

    if (colorCreate) {
        setErrorColor(null);

        if (colorCreate.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            setErrorColor("Invalid charactere");
        } else {
            const body = {
                "name": colorCreate
            }
            axios.post("http://127.0.0.1:8000/api/color/" + colorCreate, body, config).then(res => {
                toast.success('Color '+ colorCreate +' correctly added!', { position: "top-center" });
                axios.get("http://127.0.0.1:8000/api/color", config).then(e => {
                    setAllColors(e.data);
                });
                document.getElementById('newColor').value=''
            }).catch(err => {
                toast.error('Color already exist!', { position: 'top-center' });
            });
        }
    }
    else {
        setErrorColor("selected the 2 colors");
    }
  }

    return(
    <>
      <Modal.Header closeButton>Create color !</Modal.Header>
      <Modal.Body>
        {msgErrorColor ? <Alert> {msgErrorColor} </Alert> : null}
        <Form onSubmit={onSubmit2}>
          <FormGroup>
          <Label for="newColor">New name</Label>
          <Input
              type="text"
              name="newColor"
              id="newColor"
              placeholder="Color name"
              onChange={onChangeColor}
          />
          <Button color="dark" className="mt-4" block>Create</Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </>
    )
}

export default CreateColorModal;