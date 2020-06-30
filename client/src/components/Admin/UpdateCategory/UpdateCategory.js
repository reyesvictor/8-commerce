import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import './UpdateCategory.css';
import axios from 'axios';
import { useRouteMatch } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

const UpdateProduct = () => {
    let idCategory = useRouteMatch("/admin/update/category/:id").params.id;
    const [isReady, setIsReady] = useState(false);
    const [name, setName] = useState('');
    
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

    function formSubmit(e) {
        e.preventDefault();
        setIsReady(true);
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/category/"+idCategory, config)
        .then(res => {
                setName(res.data.name);
        })
        .catch(error => {
            toast.error('Error !', {position: 'top-center'});
        });
    }, []);

    useEffect( () => {
        if (isReady) {
            setIsReady(false);
            const body = {
                "name": name,
            }
            console.log(body);
            axios.put(process.env.REACT_APP_API_LINK + "/api/category/"+idCategory, body, config ).then( e => {
                toast.success('Category correctly updated!', { position: "top-center"})
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReady]);
    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Update your Category !</h1>
            <button onClick={() => window.location.href='/admin'} className='float-right btn btn-warning mb-3'> Back to Dashboard </button>
            <button onClick={() => window.location.href='/admin/subcategory/'+idCategory} className="btn btn-outline-dark m-2 float-right">View subCategory</button>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input className="inputeStyle form-control" type="text" name="name" placeholder="Name Article" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default UpdateProduct;