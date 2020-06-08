import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import './UpdateSubCategory.css';
import store from '../../../store';

function UpdateSubCategory() {
    const [isReady, setIsReady] = useState(false);
    const [name, setName] = useState('');
    const [nameCategory, setNameCategory] = useState('');
    const lauch = (e) =>{
        e.preventDefault()
        setIsReady(true);
    }
    let id = useRouteMatch("/admin/subcategory/:id/:subcategory/update").params.id;
    let idSubCategory = useRouteMatch("/admin/subcategory/:id/:subcategory/update").params.subcategory;

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
        axios.get("http://localhost:8000/api/category/"+id, config)
        .then(res => {
            $.each(res.data.subCategories, (index, category) => {
                if(category.id === parseInt(idSubCategory))
                {
                    console.log(category);
                    setName(category.name);
                }
            });
            setNameCategory(res.data.name)
        })
        .catch(error => {
            toast.error('Error !', {position: 'top-center'});
        });
    }, [])
   
    useEffect(() => {
        if (isReady) {
            setIsReady(false)
            const body = {
                "category_id": id,
                "name": name
            }
            console.log(body);
            axios.put("http://127.0.0.1:8000/api/subcategory/"+idSubCategory, body, config).then( e => {
                toast.success('Product correctly updated!', { position: "top-center"})
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReady]);

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Update the Subproduct {'id ('+idSubCategory+')'} for <b>{nameCategory}</b> !</h1>
            <button onClick={() => window.location.href='/admin'} className='float-right btn btn-warning m-2'> Back to Dashboard </button>
            <button onClick={() => window.location.href='/admin/subcategory/'+id} className='float-right btn btn-info m-2'> Back to the Subcategory </button>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input className="inputeStyle form-control" type="text" name="name" placeholder="Name category" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={(e) => lauch(e)}>Submit</button>
            </form>
        </div>
    )
}

export default UpdateSubCategory;