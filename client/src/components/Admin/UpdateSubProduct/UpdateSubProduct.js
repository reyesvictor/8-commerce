import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import './UpdateSubProduct.css'
import store from '../../../store';

function UpdateSubProduct() {
    const [isReady, setIsReady] = useState(false);
    const [price, setPrice] = useState(1);
    const [color, setColor] = useState(1);
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState(1);
    const [promo, setPromo] = useState(0);
    const [stock, setStock] = useState(0);
    const [titleProduct, setTitleProduct] = useState('');
    const [colors, setColors] = useState([]);

    let id = useRouteMatch("/admin/subproduct/:id/:subproduct/update").params.id;
    let idSubproduct = useRouteMatch("/admin/subproduct/:id/:subproduct/update").params.subproduct;

    const token = store.getState().auth.token
    const config = {
        headers: {
                "Content-type": "application/json"
        }
    }
    
    const lauch = (e) =>{
        e.preventDefault()
        setIsReady(true);
    }

    useEffect(() => {
        if (token) {
            
            config.headers['x-auth-token'] = token
        }
    }, [token]);
    
    useEffect(() => {
        axios.get("http://localhost:8000/api/product/"+id, config)
        .then(async res => {
            await axios.get("http://127.0.0.1:8000/api/color", config).then( allColors => {
                $.each(res.data.subproducts, (index, subproduct) => {
                    if(subproduct.id === parseInt(idSubproduct))
                    {
                    let optionColors = [];
                        allColors.data.map(colorMap => {
                            colorMap.name === subproduct.color.name 
                            ? optionColors.push(<option key={colorMap.id} defaultValue={colorMap.id} selected>{colorMap.name}</option>)
                            : optionColors.push(<option key={colorMap.id} value={colorMap.id}>{colorMap.name}</option>)
                        });
                        setColors(optionColors);
                        setPrice(subproduct.price);
                        setColor(subproduct.color.id);
                        setSize(subproduct.size);
                        setWeight(subproduct.weight);
                        subproduct.promo === null ? setPromo(0) :setPromo(subproduct.promo);
                        setStock(subproduct.price);
                    }
                });
            });
            // console.log(Object.keys(res.data.subproducts).map(i => res.data.subproducts[i]))
            
            setTitleProduct(res.data.title)
        })
        .catch(error => {
            toast.error('Error !', {position: 'top-center'});
        });
    }, [])
   
    useEffect(() => {
        if (isReady) {
            setIsReady(false)
            console.log(color)

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
            axios.put("http://127.0.0.1:8000/api/subproduct/"+idSubproduct, body, config).then( e => {
                toast.success('Product correctly updated!', { position: "top-center"});
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReady]);
    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Update the Subproduct<br/><b>{titleProduct}</b></h1>
            <div className="row justify-content-end mb-2">
            <button onClick={() => window.location.href='/admin'} className='float-right btn btn-warning m-2'> Back to Dashboard </button>
            <button onClick={() => window.location.href='/admin/subproduct/'+id} className='float-right btn btn-info m-2'> Back to the Subproduct </button>
            </div>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className="inputeStyle form-control" type="number" name="price" placeholder="ex: 123" value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="color">Color</label>
                    <select name="color" className="form-control form-control-lg" onChange={(e) => setColor(e.target.value)}>
                            <option value="">--- SELECT COLOR ---</option>
                            {colors}
                    </select>
                    {/* <input className="inputeStyle form-control" type="text" name="color" placeholder="Color article" value={color} onChange={(e) => setColor(e.target.value)}/> */}
                </div>
                <div className="form-group">
                    <label htmlFor="size">Size</label>
                    <input className="inputeStyle form-control" type="text" name="size" placeholder="Size article" value={size} onChange={(e) => setSize(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="weight">Weight</label>
                    <input className="inputeStyle form-control" type="number" name="weight" placeholder="ex: 3" value={weight} onChange={(e) => setWeight(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Promo</label>
                    <input className="inputeStyle form-control" type="number" name="promo" min="0" max="100" value={promo} placeholder="0 - 100" onChange={(e) => setPromo(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="stock">stock</label>
                    <input className="inputeStyle form-control" type="number" name="stock" placeholder="ex: 500" value={stock} onChange={(e) => setStock(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={(e) => lauch(e)}>Submit</button>
            </form>
        </div>
    )
}

export default UpdateSubProduct;