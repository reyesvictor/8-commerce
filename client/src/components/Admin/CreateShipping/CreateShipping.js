import axios from 'axios';
import "./CreateShipping.css";
import CartShipping from './CartShipping';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import store from '../../../store';

function CreateShipping() {
    const [nameCompany, setNameCompany] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [selectRegion, setSelectRegion] = useState([]);
    const [allRegion, setAllRegion] = useState([]);
    const [priceKG, setPriceKG] = useState([]);
    const [duration, setDuration] = useState([]);
    const [basePrice, setBasePrice] = useState([]);
    const [cartShip, setCartShip] = useState([]);
    const optionRegions = [];

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
        axios.get(process.env.REACT_APP_API_LINK + "/api/region", config).then(e => {
            setAllRegion(e.data.data);
        });
    }, []);
    
    allRegion.map(region => {
        optionRegions.push(<option key={region.id} value={region.id}>{region.name}</option>)
    });

    function onChange(event) {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let company = str.charAt(0).toUpperCase() + str.slice(1);
        setNameCompany(company.replace(/[\s]{2,}/g, " "));
    }

    function onSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (nameCompany != "") {
            if (nameCompany.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?.@#\]]/)) {
                invalids.name = "Invalids charactere";
            }
        } else {
            invalids.name = "Please enter company";
        }
        
        if (selectRegion == "") {
            invalids.region = "please select a region";
        }

        if (priceKG.length == 0) {
            invalids.priceKg = "Enter your price please";
        }

        if (duration.length == 0) {
            invalids.duration = "Enter your shipping time";
        }

        if (basePrice.length == 0) {
            invalids.basePrice = "Enter your base price";
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
            let obj = {
                "name": nameCompany,
                "region": selectRegion,
                "priceKG": priceKG,
                "duration": duration,
                "basePrice": basePrice
            }
            let tab = [];
            cartShip.map( res => {
                tab.push(res.region);
            });
            if (tab.includes(selectRegion)) {
                toast.error('Region already added !', { position: 'top-center' });
            } else {
                setCartShip([...cartShip, obj]);
            }
        }
    }, [isReady])

    return (
        <>
            <ToastContainer />
            <div className="container">
                <h1>New Shipping</h1>
                <div className="row justify-content-end mb-2">
                    <button onClick={() => window.location.href = '/admin?tab=5'} className='float-right btn btn-warning m-2'> Back to Dashboard </button>
                </div>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label for="shipping">Name Company</Label>
                        <Input
                            type="text"
                            name="name"
                            id="shipping"
                            placeholder="Ex: UPS-Fast"
                            className={(isInvalid.name ? 'is-invalid' : 'inputeStyle')}
                            onChange={onChange}/>
                        <div className="invalid-feedback">{ isInvalid.name }</div>
                        <Label for="supplier">Regions</Label>
                        <select className={"form-control mtop30 " + (isInvalid.region ? 'is-invalid' : 'inputeStyle')} onChange={e => setSelectRegion(e.target.value)}>
                            <option value="">- - - Select Regions - - -</option>
                            {optionRegions}
                        </select>
                        <div className="invalid-feedback">{ isInvalid.region }</div>
                        <div className="d-flex">
                            <div className="optionRegion mr-5">
                                <Label for="pricekg">Price per kilo</Label>
                                <Input
                                    type="number"
                                    name="pricekg"
                                    id="pricekg"
                                    placeholder="Number"
                                    className={(isInvalid.priceKg ? 'is-invalid' : 'inputeStyle')}
                                    onChange={e => setPriceKG(e.target.value)}/>
                                <div className="invalid-feedback">{ isInvalid.priceKg }</div>
                            </div>
                            <div className="optionRegion mr-5">
                                <Label for="duration">Duration Days</Label>
                                <Input
                                    type="number"
                                    name="duration"
                                    id="duration"
                                    placeholder="Number"
                                    className={(isInvalid.duration ? 'is-invalid' : 'inputeStyle')}
                                    onChange={e => setDuration(e.target.value)}/>
                                <div className="invalid-feedback">{ isInvalid.duration }</div>
                            </div>
                            <div className="optionRegion">
                                <Label for="basePrice">Base Price</Label>
                                <Input
                                    type="number"
                                    name="basePrice"
                                    id="basePrice"
                                    placeholder="Number"
                                    className={(isInvalid.basePrice ? 'is-invalid' : 'inputeStyle')}
                                    onChange={e => setBasePrice(e.target.value)}/>
                                <div className="invalid-feedback">{ isInvalid.basePrice }</div>
                            </div>
                        </div>
                        <Button color="success" className="mt-3" block>Submit</Button>
                    </FormGroup>
                </Form>
            </div>
            <CartShipping handleCart={cartShip} name={nameCompany}/>
        </>
    )
}

export default CreateShipping;