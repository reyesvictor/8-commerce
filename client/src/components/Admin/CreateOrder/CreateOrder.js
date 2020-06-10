import axios from 'axios';
import "./CreateOrder.css";
import CartSubProduct from "./CartSubProduct";
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function CreateOrder() {
    const [show, setShow] = useState(false);
    const [supplierName, setSupplierName] = useState([]);
    const [show2, setShow2] = useState(false);
    const [idSupplier, setIdSupplier] = useState([]);
    const [ourAdress, setOurAdress] = useState([]);
    const [subProduct, setSubProduct] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [allSupplier, setAllSupplier] = useState([]);
    const [allSubProduct, setAllSubproduct] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [cart, setCart] = useState([]);
    const optionSelect = [];
    const optionSubProduct = [];

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/supplier", config).then(e => {
            setAllSupplier(e.data.data);
        });
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/subproduct", config).then(e => {
            setAllSubproduct(e.data.data);
        });
    }, []);

    allSupplier.map(supp => {
        optionSelect.push(<option key={supp.id} value={supp.id}>{supp.name}</option>)
    });

    allSubProduct.map(sub => {
        optionSubProduct.push(<option key={sub.id} value={sub.id + "/" + sub.product.id + "/" + sub.product.title + "/" + sub.color.name + "/" + sub.size + "/" + sub.price + "/" + sub.color.id}>
                {sub.product.id}: {sub.product.title.substr(0, 41)} - {sub.color.name} - {sub.size} ({sub.stock ? sub.stock : 0})
            </option>)
    });

    const [isInvalid, setIsInvalid] = useState(false);
    const onChangeAdress = (event) => {
        let res = event.target.value.trim();
        setOurAdress(res.replace(/[\s]{2,}/g, " "));
    }
    const onChangeQty = (event) => {
        setQuantity(event.target.value);
    }
    function onSubmit2(e) {
        e.preventDefault();
        let invalids = {};

        if (idSupplier == "") {
            invalids.idsupplier = "PLease select a supplier";
        }
        if (ourAdress != "") {
            if (ourAdress.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]/)) {
                invalids.adress = "Invalids charactere";
            }
        } else {
            invalids.adress = "PLease enter adress";
        }
        if (subProduct == "") {
            invalids.subproduct = "Select subProduct";
        }
        if (quantity.length == 0) {
            invalids.quantity = "PLease enter quantity";
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
            let info = subProduct.split("/");
            let obj = {
                "idSupplier" : idSupplier,
                "idSubProduct" : info[0],
                "idProduct" : info[1],
                "subProductTitle" : info[2],
                "subProductColor" : info[3],
                "subProductSize" : info[4],
                "ourAdress" : ourAdress,
                "quantity" : quantity,
                "price" : info[5],
                "idColor": info[6]
            }
            setCart([...cart, obj]);
        }
    }, [isReady]);
    
    return (
        <>
        <div className="container">
            <h1>New Order</h1>
            <div className="row justify-content-end mb-2">
                <button onClick={() => window.location.href = '/admin'} className='float-right btn btn-warning m-2'> Back to Dashboard </button>
            </div>
            <Form onSubmit={onSubmit2}>
                <FormGroup>
                <Label for="supplier">Supplier</Label>
                    <select className={"form-control mtop30 " + (isInvalid.idsupplier ? 'is-invalid' : 'inputeStyle')} onChange={e => setIdSupplier(e.target.value)}>
                        <option value="">- - - Select Supplier - - -</option>
                        {optionSelect}
                    </select>
                    <div className="invalid-feedback">{ isInvalid.idsupplier }</div>
                    <Label for="supplier">Our adress</Label>
                    <Input
                        type="text"
                        name="adress"
                        id="adress"
                        className={(isInvalid.adress ? 'is-invalid' : 'inputeStyle')}
                        onChange={onChangeAdress}/>
                        <div className="invalid-feedback">{ isInvalid.adress }</div>
                    <Label for="products">Products</Label>
                    <select className={"form-control mtop30 " + (isInvalid.subproduct ? 'is-invalid' : 'inputeStyle')} onChange={ e => setSubProduct(e.target.value)}>
                        <option value="">- - - Select SubProduct - - -</option>
                        {optionSubProduct}
                    </select>
                    <div className="invalid-feedback">{ isInvalid.subproduct }</div>
                    <Label for="quantity">Quantity</Label>
                    <div className="d-flex">
                        <Input
                            type="number"
                            name="quantity"
                            id="quantity"
                            className={"quantity mr-5 " + (isInvalid.quantity ? 'is-invalid' : 'inputeStyle')}
                            onChange={onChangeQty}/>
                        <Button color="success" className="btnOrder" block>Submit</Button>
                    </div>
                    <div className="invalid-feedback">{ isInvalid.quantity }</div>
                </FormGroup>
            </Form>
        </div>
        <CartSubProduct handleCart={cart} idSupplier={idSupplier} ourAdress={ourAdress}/>
        </>
    )
}

export default CreateOrder;