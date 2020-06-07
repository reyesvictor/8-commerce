import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../../../store";

function CreateCategorySubModal() {
  const [formControl, setFormControl] = useState({});
  const [allCategory, setAllCategory] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [categorySelected, setCategorySelected] = useState("");
  const optionCategory = [];

  const token = store.getState().auth.token;
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  useEffect(() => {
    if (token) {
      config.headers["x-auth-token"] = token;
    }
  }, [token]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/category", config).then((e) => {
      setAllCategory(e.data.data);
    });
  }, []);

  allCategory.map((category) => {
    optionCategory.push(
      <option key={category.id} value={category.name}>
        {category.name}
      </option>
    );
  });

  function handleChange(event) {
    let res = event.target.value.trim();
    let str = res.toLowerCase();
    let subCategory = str.charAt(0).toUpperCase() + str.slice(1);
    setFormControl({
      [event.target.name]: subCategory.replace(/[\s]{2,}/g, " "),
    });
  }

  function handleSelect(event) {
    setCategorySelected(event.target.value);
  }

  function formSubmit(e) {
    e.preventDefault();
    let invalids = {};

    if (formControl.subCategory) {
      if (
        formControl.subCategory.match(
          /[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/
        )
      ) {
        invalids.subCategory = "Charactere invalid";
      }
    } else {
      invalids.subCategory = "Please enter a Sub Category";
    }

    if (!categorySelected) {
      invalids.category = "Select category";
    }

    if (Object.keys(invalids).length === 0) {
      setIsInvalid(invalids);
      setIsReady(true);
    } else {
      setIsInvalid(invalids);
    }
  }

  useEffect(() => {
    if (isReady) {
      setIsReady(false);
      const body = JSON.stringify({ ...formControl });
      axios
        .post(
          "http://127.0.0.1:8000/api/subcategory/create/" +
            categorySelected +
            "/" +
            formControl.subCategory,
          body,
          config
        )
        .then((res) => {
          toast.success("SubCategory correctly added!", {
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error("SubCategory already exist!", { position: "top-center" });
        });
    }
  }, [isReady]);

  return (
    <>
      <Modal.Header closeButton>Create Sub Category !</Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup>
            <select
              className={
                "form-control form-control-lg small" +
                (isInvalid.category ? "is-invalid" : "inputeStyle")
              }
              id="selectCategory"
              onChange={handleSelect}
            >
              <option value="">Category</option>
              {optionCategory}
            </select>
            <div className="invalid-feedback">{isInvalid.category}</div>
            <br />


            {/* <label htmlFor="subCategory">SubCategory's Name</label> */}
            <input
              className={
                "form-control " +
                (isInvalid.subCategory ? "is-invalid" : "inputeStyle")
              }
              type="text"
              name="subCategory"
              placeholder="SubCategory's Name"
              onChange={handleChange}
            />

            <div className="invalid-feedback">{isInvalid.subCategory}</div>

            <button type="submit" className="btn btn-dark" onClick={formSubmit}>
              Create
            </button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </>
  );
}

export default CreateCategorySubModal;
