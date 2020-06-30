import React, { useState, useEffect } from 'react';
import { Parallax, Background } from "react-parallax";
import axios from 'axios';
import './SubCategory.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

function CreateSubCategory() {
    const [formControl, setFormControl] = useState({});
    const [allCategory, setAllCategory] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [categorySelected, setCategorySelected] = useState('');
    const optionCategory = [];

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
        axios.get(process.env.REACT_APP_API_LINK + "/api/category", config).then(e => {
            setAllCategory(e.data.data);
        });
    }, []);

    allCategory.map(category => {
        optionCategory.push(<option key={category.id} value={category.name}>{category.name}</option>)
    });

    function handleChange(event) {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let subCategory = str.charAt(0).toUpperCase() + str.slice(1);
        setFormControl({ [event.target.name]: subCategory.replace(/[\s]{2,}/g, " ") });
    }

    function handleSelect(event) {
        setCategorySelected(event.target.value);
    }

    function formSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (formControl.subCategory) {
            if (formControl.subCategory.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
                invalids.subCategory = "Charactere invalid";
            }
        } else {
            invalids.subCategory = "Please enter a subCategory";
        }

        if (!categorySelected) {
            invalids.category = "Select category";
        }

        if (Object.keys(invalids).length === 0) {
            setIsInvalid(invalids);
            setIsReady(true)
        } else {
            setIsInvalid(invalids);
        }
    }

    useEffect(() => {
        if (isReady) {
            setIsReady(false);
            const body = JSON.stringify({ ...formControl });
            axios.post(process.env.REACT_APP_API_LINK + "/api/subcategory/create/" + categorySelected + "/" + formControl.subCategory, body, config)
                .then(res => {
                    toast.success('SubCategory correctly added!', { position: 'top-center' });
                }).catch(err => {
                    toast.error('SubCategory already exist!', { position: 'top-center' });
                });
        }
    }, [isReady]);

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create SubCategory</h1>
            <div className="btnLink">
                <div className="row justify-content-end mb-2">
                    <button onClick={() => window.location.href = '/admin/create/category'} className='btn btn-success m-2'> Create Category </button>
                    <button onClick={() => window.location.href = '/admin'} className='btn btn-warning m-2'> Back to Dashboard </button>
                </div>
            </div>
            <form id="formCategory">
                <div className="form-group">
                    <label htmlFor="subCategory">SubCategory name</label>
                    <input className={"form-control " + (isInvalid.subCategory ? 'is-invalid' : 'inputeStyle')} type="text" name="subCategory" placeholder="subCategory" onChange={handleChange} />
                    <div className="invalid-feedback">{isInvalid.subCategory}</div>
                </div>
                <select className={"form-control form-control-lg " + (isInvalid.category ? 'is-invalid' : 'inputeStyle')} id="selectCategory" onChange={handleSelect}>
                    <option value="">--- CHOICE CATEGORY ---</option>
                    {optionCategory}
                </select>
                <div className="invalid-feedback">{isInvalid.category}</div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateSubCategory;