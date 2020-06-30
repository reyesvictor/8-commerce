import React, { useState, useEffect } from 'react';
import './CreateProduct.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import store from '../../../store';
import Modal from 'react-bootstrap/Modal';
import CreateCategorySubModal from '../CreateCategorySub/CreateCategorySubModal'

function CreateProduct() {
    const [btnSex, setBtnSex] = useState('');
    const [formControl, setFormControl] = useState({"subcategory": 1, "supplier": 1});
    const [isReady, setIsReady] = useState(false);
    const [statusState, setStatusState] = useState(true);
    const [promotedState, setPromotedState] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [subcategories, setSubCategories] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [isSubCategoriesReady, setIsSubCategoriesReady] = useState(false);
    const [isSupplierReady, setIsSupplierReady] = useState(false);
    const [countProduct, setCountProduct] = useState(0);
    const [show, setShow] = useState(false);
    const [redirection, setRedirection] = useState(false);

    const handleCloseRedirection = () => setRedirection(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": 'Bearer '+token
        }
    }
    // useEffect(() => {
    //     if (token) {
    //         config.headers['Authorization'] = 'Bearer '+token;
    //     }
    // }, [token]);

    useEffect(() => {
      axios.get(process.env.REACT_APP_API_LINK + "/api/product", config).then( e => {
            let nbr = e.data.data[e.data.nbResults-1].id
            setCountProduct(nbr);
            }).catch( err => {
                toast.error('Error redirection after create a product!', {position: 'top-center'});
            });
    }, [redirection])

    useEffect(() => {
        if (show === false) {
            axios
            .get(process.env.REACT_APP_API_LINK + "/api/subcategory/", config)
            .then((res) => {
                console.log(res.data);
                setSubCategories(res.data);
                setIsSubCategoriesReady(true);
                })
            .catch((error) => {
                console.log(error.response);
                });
        }
    }, [show]);

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_API_LINK + "/api/subcategory/", config)
            .then((res) => {
                console.log(res.data);
                setSubCategories(res.data);
                setIsSubCategoriesReady(true);
                })
            .catch((error) => {
                console.log(error.response);
                });
    }, [isSubCategoriesReady] )

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_API_LINK + "/api/supplier/", config)
            .then((res) => {
                console.log(res.data.data);
                setSupplier(res.data.data);
                setIsSupplierReady(true);
                })
            .catch((error) => {
                console.log(error.response);
                });
    }, [isSupplierReady])

    function handleChange(event) {
        let res = event.target.value.trim();
        let val = res.replace(/[\s]{2,}/g, " ");

        if (parseInt(val) || val == 0) {
            setFormControl({ ...formControl, [event.target.name]: parseInt(val) });
        } else {
            setFormControl({ ...formControl, [event.target.name]: val });
        }
    }

    function handleChangeSupplier(event) {
        let val = event.target.value;

        if (parseInt(val) || val == 0) {
            setFormControl({ ...formControl, [event.target.name]: parseInt(val) });
        } else {
            setFormControl({ ...formControl, [event.target.name]: val });
        }
    }
    
    function formSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (formControl.title) {
            if (formControl.title == "") {
                invalids.title = "Please enter a Title";
            } else if (formControl.title.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g)) {
                invalids.title = "Charactere invalid";
            } else if (formControl.title.length < 2) {
                invalids.title = "2 characters minimum";
            } else {
                let str = formControl.title.toLowerCase();
                let title = str.charAt(0).toUpperCase() + str.slice(1);
                setFormControl({ ...formControl, 'title': title, 'sex': btnSex , 'status': statusState, "promoted": promotedState });
            }
        } else {
            invalids.title = "Please enter a Title";
        }

        if (formControl.description) {
            if (formControl.description == "") {
                invalids.description = "Please enter a Description";
            } else if (formControl.description.length < 5) {
                invalids.description = "5 characters minimum";
            }
        } else {
            invalids.description = "Please enter a Description";
        }

        if (!formControl.subcategory) {
            invalids.category = "Please enter a number";
        }

        if (!formControl.promo && formControl.promo != 0) {
            invalids.promo = "Please enter a number";
        }

        if (!btnSex) {
            invalids.sex = "Select sex";
        }

        if (Object.keys(invalids).length === 0) {
            setIsInvalid(invalids);
            setIsReady(true);
        } else {
            setIsInvalid(invalids);
        }
    }

    useEffect( () => {
        if (isReady) {
            setIsReady(false);
            const body = JSON.stringify({ ...formControl });
            console.log(body);
            axios.post(process.env.REACT_APP_API_LINK + "/api/product", body, config).then( e => {
                toast.success('Product correctly added!', { position: "top-center"});
                setRedirection(true);
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReady]);

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create your Product !</h1>
            <button onClick={() => window.location.href='/admin?tab=1'} className='float-right btn btn-warning mb-3'> Back to Dashboard </button>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input className={"form-control " + (isInvalid.title ? 'is-invalid' : 'inputeStyle')} type="text" name="title" id="title" placeholder="Title Article" onChange={handleChange}/>
                    <div className="invalid-feedback">{ isInvalid.title }</div>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label><br/>
                    <textarea className={(isInvalid.description ? 'is-invalid' : 'inputeStyle')} name="description" id="description" form="formItem" placeholder="Your item description .." onChange={handleChange}/>
                    <div className="invalid-feedback">{ isInvalid.description }</div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label htmlFor="subcategory">SubCategory</label>
                        <select
                        className="form-control"
                        id="category"
                        name="subcategory"
                        onChange={handleChange}
                        >
                        { isSubCategoriesReady 
                            ? subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                            </option>))
                            : null
                        }
                        </select>
                    <a className='text-info small' style={{ cursor:'pointer' }} variant="primary" onClick={handleShow}> Create a new subcategory ? </a>
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="supplier">Supplier</label>
                        <select
                        className="form-control"
                        id="supplier"
                        name="supplier"
                        onChange={handleChangeSupplier}
                        >
                        { isSupplierReady 
                            ? supplier.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                            </option>))
                            : null
                        }
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="promo">Promo</label>
                    <input className={"form-control " + (isInvalid.promo ? 'is-invalid' : 'inputeStyle')} type="number" name="promo" id="promo" min="0" max="100" placeholder="0 - 100" onChange={handleChange}/>
                    <div className="invalid-feedback">{ isInvalid.promo }</div>
                </div>
                <div className="form-group">
                    <label htmlFor="status">Active</label>
                    <input type="checkbox" className="ml-2" id="status" onChange={() => setStatusState(!statusState)} checked={statusState}/>
                </div>
                <div className="form-group">
                    <label htmlFor="promoted">Promoted</label>
                    <input type="checkbox" className="ml-2" id="promoted" onChange={() => setPromotedState(!promotedState)} checked={promotedState}/>
                </div>
                <div className="row divBtnSex">
                    <input type="button" className={`btn btn-ligt mr-5 ${btnSex == "F" ? "css-man" : ''}` + (isInvalid.sex ? ' is-invalid' : '')} id="Women" value="Women" onClick={() => setBtnSex("F")}/>
                    <input type="button" className={`btn btn-ligt ${btnSex == "H" ? "css-man" : ''}` + (isInvalid.sex ? ' is-invalid' : '')} id="Men" value="Men" onClick={() => setBtnSex("H")}/>
                    <div className="invalid-feedback">{ isInvalid.sex }</div>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Submit</button>
            </form>
            <Modal show={show} onHide={handleClose}>
                <CreateCategorySubModal />
            </Modal>

            <Modal className='modalRedirection' show={redirection} onHide={handleCloseRedirection}>
              <Modal.Header closeButton> Create a SubProduct for this?</Modal.Header>
              <Modal.Body>

                <Button color="success" className="mt-4" onClick={() => window.location.replace("/admin/subproduct/"+countProduct+"/create")} block>Redirection</Button>
                <Button color="outline-dark" className="mt-4" onClick={() => setRedirection(false)} block>Close</Button>
              </Modal.Body>
            </Modal>
        </div>
    )
}

export default CreateProduct;