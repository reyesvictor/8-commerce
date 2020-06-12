import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax, Background } from "react-parallax";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import CreateColorModal from '../Color/CreateColorModal';
import './CreateSubProduct.css';
import Modal from 'react-bootstrap/Modal';
import store from '../../../store';

function CreateSubProduct() {
    const [isReady, setIsReady] = useState(false);
    const [price, setPrice] = useState(1);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState(1);
    const [promo, setPromo] = useState(0);
    const [stock, setStock] = useState(0);
    const [titleProduct, setTitleProduct] = useState('');
    const [colors, setColors] = useState([]);

    const lauch = (e) => {
        e.preventDefault()
        setIsReady(true);
    }
    let id = useRouteMatch("/admin/subproduct/:id/create").params.id;
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
        axios.get("http://localhost:8000/api/product/" + id, config)
            .then(res => {
                axios.get("http://127.0.0.1:8000/api/color", config).then(allColors => {
                    let optionColors = [];
                    allColors.data.map(colorMap => {
                        optionColors.push(<option key={colorMap.id} value={colorMap.id}>{colorMap.name}</option>)
                    });
                    setColors(optionColors);
                    setTitleProduct(res.data.title)
                });
            })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            });
    }, [show])

    useEffect(() => {
        if (isReady) {
            setIsReady(false)
            const body = {
                "product_id": id,
                "price": parseInt(price),
                "color_id": color,
                "size": size,
                "weight": parseInt(weight),
                "promo": parseInt(promo),
                "stock": parseInt(stock)
            }
            console.log(body);
            axios.post("http://127.0.0.1:8000/api/subproduct", body, config).then(e => {
                toast.success('Product correctly added!', { position: "top-center" })
            }).catch(err => {
                toast.error(err.data, { position: 'top-center' });
            });
        }
    }, [isReady]);
    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create a new Subproduct for <br /><b>{titleProduct}</b></h1>
            <div className="row justify-content-end mb-2">
                <button onClick={() => window.location.href = '/admin'} className='float-right btn btn-warning m-2'> Back to Dashboard </button>
                <button onClick={() => window.location.href = '/admin/subproduct/' + id} className='float-right btn btn-info m-2'> Back to the Subproduct </button>
            </div>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className="inputeStyle form-control" type="number" name="price" placeholder="Ex: 123" onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="color">Color</label>
                    <select name="color" className="form-control form-control-lg" onChange={(e) => setColor(e.target.value)}>
                        <option value="">--- SELECT COLOR ---</option>
                        {colors}
                    </select>
                    <a className='text-info small' style={{ cursor:'pointer' }} variant="primary" onClick={handleShow}> Create a new Color ? </a>
                </div>
                <div className="form-group">
                    <label htmlFor="size">Size</label>
                    <input className="inputeStyle form-control" type="text" name="size" placeholder="Size article" onChange={(e) => setSize(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="weight">Weight</label>
                    <input className="inputeStyle form-control" type="number" name="weight" placeholder="ex: 3" onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Promo</label>
                    <input className="inputeStyle form-control" type="number" name="promo" min="0" max="100" placeholder="0 - 100" onChange={(e) => setPromo(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input className="inputeStyle form-control" type="number" name="stock" placeholder="ex: 500" onChange={(e) => setStock(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-dark" onClick={(e) => lauch(e)}>Submit</button>
            </form>
            <Modal show={show} onHide={handleClose}>
                <CreateColorModal />
            </Modal>
        </div>
    )
}

export default CreateSubProduct;