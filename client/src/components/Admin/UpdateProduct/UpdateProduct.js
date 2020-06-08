import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import './UpdateProduct.css';
import axios from 'axios';
import { useRouteMatch } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

const UpdateProduct = () => {
    let idProduct = useRouteMatch("/admin/update/product/:id").params.id;
    console.log(idProduct)
    const [btnSex, setBtnSex] = useState('');
    const [formControl, setFormControl] = useState({});
    const [isReady, setIsReady] = useState(false);
    const [product, setProduct] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(1);
    const [promo, setPromo] = useState(0);
    const [subCategory, setSubCategory] = useState(1);
    const [sex, setSex] = useState('');
    const [status, setStatus] = useState(false);
    
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

    function formSubmit(e) {
        e.preventDefault();

        setIsReady(true);
    }
    useEffect(() => {
        axios.get("http://localhost:8000/api/product/"+idProduct, config)
        .then(res => {
                console.log(res.data);
                setProduct(res.data);   
                setTitle(res.data.title);
                setDescription(res.data.description);
                setPrice(res.data.price);
                if (res.data.promo === null) setPromo(0);
                else setPromo(res.data.promo);
                setSubCategory(res.data.subCategory)
                setSex(res.data.sex)
                setStatus(res.data.status)
        })
        .catch(error => {
            toast.error('Error !', {position: 'top-center'});
        });
    }, [])
    useEffect( () => {
        if (isReady) {
            setIsReady(false);
            const body = {
                "title": title,
                "description": description,
                "category": subCategory.id,
                "price": parseInt(price),
                "promo": parseInt(promo),
                "sex": sex,
                "status": status
            }
            console.log(body);
            axios.put("http://localhost:8000/api/product/"+idProduct, body, config ).then( e => {
                toast.success('Product correctly updated!', { position: "top-center"})
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReady]);
    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Update your Product !</h1>
            <div className="row justify-content-end mb-2">
            <button onClick={() => window.location.href='/admin/subproduct/'+idProduct} className="btn btn-outline-dark m-2"> View subproducts </button>
            <button onClick={() => window.location.href='/admin'} className='btn btn-warning m-2'> Back to Dashboard </button>
            </div>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input className="inputeStyle form-control" type="text" name="title" placeholder="Title Article" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label><br/>
                    <textarea className="inputeStyle" name="description" id="description" form="formItem" placeholder="Your item description .." value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input className="inputeStyle form-control" type="text" name="category" placeholder="category" value={subCategory.id} onChange={(e) => setSubCategory(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className="inputeStyle form-control" type="number" name="price" placeholder="ex: 123" value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Promo</label>
                    <input className="inputeStyle form-control" type="number" name="promo" min="0" max="100" placeholder="0 - 100" value={promo} onChange={(e) => setPromo(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="status">Active</label>
                    <input type="checkbox" className="ml-2" id="status" onChange={() => setStatus(!status)} checked={status}/>
                </div>
                <div className="row divBtnSex">
                    <input type="button" className={`btn btn-ligt mr-5 ${ sex == "F" ? "css-man" : ''}`} id="Women" value="Women" onClick={() => setBtnSex("F") + setSex("F")}/>
                    <input type="button" className={`btn btn-ligt ${ sex == "H" ? "css-man" : ''}`} id="Men" value="Men" onClick={() => setBtnSex("H") + setSex("H")}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default UpdateProduct;