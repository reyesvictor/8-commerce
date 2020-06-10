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
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [allSupplier, setAllSupplier] = useState([]);
    const [allSubProduct, setAllSubproduct] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [cart, setCart] = useState([]);
    const [panier, setPanier] = useState([]);
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
        optionSubProduct.push(<option key={sub.id} value={sub.id}>
                {sub.product.id}: {sub.product.title.substr(0, 41)} - {sub.color.name} - {sub.size} ({sub.stock ? sub.stock : 0})
            </option>)
    });

    const [isInvalid, setIsInvalid] = useState(false);
    const onChangeAdress = (event) => {
        let res = event.target.value.trim();
        setOurAdress(res.replace(/[\s]{2,}/g, " "));
    }
    const onChangeQty = (event) => {
        setQuantity(parseInt(event.target.value));
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
        if (product == "") {
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

    const Shipping = (days) => {
        var result = new Date();
        result.setDate(result.getDate() + days);
        let dd = result.getDate();
        let mm = result.getMonth();
        let yy = result.getFullYear();
        let date = dd + "/" + mm + "/" + yy;
        return date;
    }

    useEffect(() => {
        if (isReady) {
            console.log('1', cart)
            setIsReady(false);
            if(cart.length === 0)
            {
                let obj = {
                    "idSupplier" : idSupplier,
                    "product" : product,
                    "ourAdress" : ourAdress,
                    "quantity" : quantity
                }
                setCart([...cart, obj]);
            }
            cart.map((order) => 
            {
                let obj = {
                    "idSupplier" : idSupplier,
                    "product" : product,
                    "ourAdress" : ourAdress,
                    "quantity" : quantity
                }
                if(order.product === product && order.ourAdress === ourAdress)
                {
                    order.quantity = order.quantity + quantity
                    setCart([...cart]);
                }
                else
                {
                    setCart([...cart, obj]);
                }
            })
            console.log('2', cart)

            // const body = {
            //     "our_address" : ourAdress,
            //     "status" : false,
            //     "price" : price,
            //     "arrival_date" : Shipping(3),
            //     "supplier_id" : idSupplier
            // }
            // axios.post("http://127.0.0.1:8000/api/supplier/order", body, config).then( e => {
            //     setIsReady(false);
            //     toast.success('Product correctly added!', { position: "top-center"});
            // }).catch( err => {
            //     toast.error('Error !', {position: 'top-center'});
            // });
        }
    }, [isReady]);
    
    useEffect(() => {
        if(cart.length > 0){
            console.log(cart)
            console.log(1);
            let arr = [];
            cart.map(async (order, i) => {
               await axios.get("http://127.0.0.1:8000/api/subproduct/"+order.product, config).then(async e => {
                    await axios.get("http://127.0.0.1:8000/api/product/"+e.data.product.id, config).then( product => {
                    console.log('product', product)
                    arr.push(
                        <div key={i+product}> 
                            <span key={e.id+12+e.data.product.title+order.idSupplier}> {
                           
                                product.data.images.map((image, ind) => parseInt(image.color_id) === parseInt(e.data.color.id) 
                                ?  <img key={e.data.id+e.data.color.id} className="" src={'http://127.0.0.1:8000'+image.links[0]}></img>  
                                : null && ind === product.data.images.length - 1 ? <img className="" src={'http://127.0.0.1:8000'+product.data.images[0].links[0]}></img> : console.log('NUALALALALAALALl'))

                            }</span>
                            <h4>Title: {e.data.product.title}</h4>
                        </div>);
                        
                    toast.success('!', { position: "top-center"});
                    }).catch( err => {
                        toast.error('Error !', {position: 'top-center'});
                    });
               toast.success('Product correctly added!', { position: "top-center"});
               }).catch( err => {
                   toast.error('Error !', {position: 'top-center'});
               });
               console.log('pushPanier', arr);
                setPanier(arr);
               console.log(3);
           })
        }
    }, [cart])


console.log(panier)
    return (
        <>
        <div className="container">
            <h1>New Order</h1>
            <Form onSubmit={onSubmit2}>
                <FormGroup>
                    <select className={"form-control mtop30 " + (isInvalid.idsupplier ? 'is-invalid' : 'inputeStyle')} onChange={e => setIdSupplier(e.target.value)}>
                        <option value="">- - - Select Supplier - - -</option>
                        {optionSelect}
                    </select>
                    <div className="invalid-feedback">{ isInvalid.idsupplier }</div>
                    <select className={"form-control mtop30 " + (isInvalid.subproduct ? 'is-invalid' : 'inputeStyle')} onChange={ e => setProduct(e.target.value)}>
                        <option value="">- - - Select SubProduct - - -</option>
                        {optionSubProduct}
                    </select>
                    <div className="invalid-feedback">{ isInvalid.subproduct }</div>
                    <Label for="supplier">Our adress</Label>
                    <Input
                        type="text"
                        name="adress"
                        id="adress"
                        className={(isInvalid.adress ? 'is-invalid' : 'inputeStyle')}
                        onChange={onChangeAdress}/>
                        <div className="invalid-feedback">{ isInvalid.adress }</div>
                    <Label for="quantity">Quantity</Label>
                    <div className="d-flex">
                        <Input
                            type="number"
                            name="quantity"
                            id="quantity"
                            className={"quantity mr-5 " + (isInvalid.quantity ? 'is-invalid' : 'inputeStyle')}
                            onChange={onChangeQty}/>
                        <Button color="success" className="btnOrder" id='prevuBtn' block>Submit</Button>
                    </div>
                    <div className="invalid-feedback">{ isInvalid.quantity }</div>
                </FormGroup>
            </Form>
    
        </div>
        <div id="div-panier">
            {panier}
        </div>
        {/* <CartSubProduct handleCart={getCart} config={config} /> */}
        </>
    )
}

export default CreateOrder;