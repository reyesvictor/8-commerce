import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Category.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

function CreateCategory() {
    const [formControl, setFormControl] = useState({});
    const [isReady, setIsReady] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

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

    function handleChange(event) {
            let res = event.target.value.trim();
            let str = res.toLowerCase();
            let category = str.charAt(0).toUpperCase() + str.slice(1);
            setFormControl({[event.target.name]: category.replace(/[\s]{2,}/g, " ") });
    }

    function formSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (formControl.category) {
            if (formControl.category.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/) ) {
                invalids.category = "Charactere invalid";
            }
        } else {
            invalids.category = "Please enter a category";
        }

        if (Object.keys(invalids).length === 0) {
            setIsInvalid(invalids);
            setIsReady(true)
        } else {
            setIsInvalid(invalids);
        }
    }

    useEffect( () => {
        if (isReady) {
            setIsReady(false);
            const body = JSON.stringify({ ...formControl });
            axios.post("http://127.0.0.1:8000/api/category/create/" + formControl.category, body, config).then( res => {
                toast.success('Category correctly added!', {position: "top-center"});
            }).catch( err => {
                toast.error('Category already exist!', {position: 'top-center'});
            });
        }
    }, [isReady]);

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create Category !</h1>
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning margin-right'> Back to dashboard </button>
            </div>
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin/create/subcategory'} className='float-right btn btn-success margin-right'> Create a new SubCategory </button>
            </div>
            <form id="formCategory">
                <div className="form-group">
                    <label htmlFor="category">Category name</label>
                    <input id="category" className={"form-control " + (isInvalid.category ? 'is-invalid' : 'inputeStyle')} type="text" name="category" placeholder="Category" onChange={handleChange}/>
                    <div className="invalid-feedback">{ isInvalid.category }</div>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateCategory;