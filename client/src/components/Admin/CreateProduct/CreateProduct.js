import React, { useState, useEffect } from 'react';
import './CreateProduct.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';
import Modal from 'react-bootstrap/Modal';
import CreateCategorySubModal from '../CreateCategorySub/CreateCategorySubModal'

function CreateProduct() {
    const [btnSex, setBtnSex] = useState('');
    const [formControl, setFormControl] = useState({"subcategory": 1});
    const [isReady, setIsReady] = useState(false);
    const [statusState, setStatusState] = useState(true);
    const [isInvalid, setIsInvalid] = useState(false);
    const [subcategories, setSubCategories] = useState([]);
    const [isSubCategoriesReady, setIsSubCategoriesReady] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    useEffect(() => {
        if (token) {
            config.headers['x-auth-token'] = token
        }
    }, [token]);

    useEffect(() => {
        if (show == false) {
            axios
            .get("http://localhost:8000/api/subcategory/")
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
            .get("http://localhost:8000/api/subcategory/")
            .then((res) => {
                console.log(res.data);
                setSubCategories(res.data);
                setIsSubCategoriesReady(true);
                })
            .catch((error) => {
                console.log(error.response);
                });

    }, [isSubCategoriesReady] )

    function handleChange(event) {
        console.log(event.target)

        let res = event.target.value.trim();
        let val = res.replace(/[\s]{2,}/g, " ");

        if (parseInt(val) || val == 0) {
            setFormControl({ ...formControl, [event.target.name]: parseInt(val) });
        } else {
            setFormControl({ ...formControl, [event.target.name]: val });
        }

        console.log(formControl);
    }
    
    function formSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (formControl.title) {
            if (formControl.title == "") {
                invalids.title = "Please enter a Title";
            } else if (formControl.title.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g)) {
                invalids.title = "Charactere invalid";
            } else if (formControl.title.length < 2) {
                invalids.title = "2 characters minimum";
            } else {
                let str = formControl.title.toLowerCase();
                let title = str.charAt(0).toUpperCase() + str.slice(1);
                setFormControl({ ...formControl, 'title': title, 'sex': btnSex , 'status': statusState  });
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
        
        if (!formControl.price) {
            invalids.price = "Please enter a number";
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
            const body = JSON.stringify({ ...formControl })
            console.log(body);
            axios.post("http://127.0.0.1:8000/api/product", body, config).then( e => {
                toast.success('Product correctly added!', { position: "top-center"});
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReady]);

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create your Product !</h1>
            <button onClick={() => window.location.href='/admin'} className='float-right btn btn-warning mb-3'> Back to dashboard </button>
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
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className={"form-control " + (isInvalid.price ? 'is-invalid' : 'inputeStyle')} type="number" name="price" id="price" placeholder="ex: 123" onChange={handleChange}/>
                    <div className="invalid-feedback">{ isInvalid.price }</div>
                </div>
                <div className="form-group">
                    <label htmlFor="subcategory">SubCategory</label>
                    <select
                    className=" col-3 form-control"
                    id="category"
                    name="subcategory"
                    onChange={handleChange}
                    >
                    { isSubCategoriesReady 
                        ? subcategories.map( ( subcategory ) => (
                        <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                        </option>) )
                        : null
                    }
                    </select>
                    <a className='text-info small' style={{ cursor:'pointer' }} variant="primary" onClick={handleShow}> Create a new category ? </a>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Promo</label>
                    <input className={"form-control " + (isInvalid.promo ? 'is-invalid' : 'inputeStyle')} type="number" name="promo" id="promo" min="0" max="100" placeholder="0 - 100" onChange={handleChange}/>
                    <div className="invalid-feedback">{ isInvalid.promo }</div>
                </div>
                <div className="form-group">
                    <label htmlFor="status">Active</label>
                    <input type="checkbox" className="ml-2" id="status" onChange={() => setStatusState(!statusState)} checked={statusState}/>
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
        </div>
    )
}

export default CreateProduct;