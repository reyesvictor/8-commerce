import axios from 'axios';
import { useRouteMatch } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import store from '../../../store';

function UpdateShipping() {
    let idShipping = useRouteMatch("/admin/update/shipping/:id").params.id;
    const [name, setName] = useState([]);
    const [newName, setNewName] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [divShip, setDivShip] = useState([]);
    const [updatePriceKG, setUpdatePriceKG] = useState("");
    const [updateDuration, setUpdateDuration] = useState("");
    const [updateBasePrice, setUpdateBasePrice] = useState("");
    const [isReadyUpdate, setIsReadyUpdate] = useState(false);
    const [idSHippingPricing, setIdSHippingPricing] = useState([]);
    const [objPut, setObjPut] = useState({});
    const [allRegion, setAllRegion] = useState([]);
    const [selectRegion, setSelectRegion] = useState([]);
    const [priceKG, setPriceKG] = useState([]);
    const [duration, setDuration] = useState([]);
    const [basePrice, setBasePrice] = useState([]);
    const [show, setShow] = useState(false);
    const optionRegions = [];

    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": 'Bearer '+token
        }
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/shippingmethod/" + idShipping, config).then(res => {
            setName(res.data.name);
            if (Object.keys(res.data.shippingPricings).length > 0) {
                const details = res.data.shippingPricings.map(pricing =>  
                    <div className="p-3 border-bottom" key={pricing.region.name}>
                        <h4><b>Region:</b> {pricing.region.name}</h4>
                        <div>
                            <label className="d-inlineGrid mr-4">
                                Price per Kilo:
                                <input key={pricing.region.name + "priceKG-" + pricing.id} type="number" placeholder={pricing.pricePerKilo} onChange={e => setUpdatePriceKG(e.target.value)}/>
                            </label>
                            <label className="d-inlineGrid mr-4">
                                Duration:
                                <input key={pricing.region.name + "duration-" + pricing.id} type="number" placeholder={pricing.duration} onChange={e => setUpdateDuration(e.target.value)}/>
                            </label>
                            <label className="d-inlineGrid mr-4">
                                Base Price:
                                <input key={pricing.region.name + "basePrice-" + pricing.id} type="number" placeholder={pricing.basePrice} onChange={e => setUpdateBasePrice(e.target.value)}/>
                            </label>
                            <button className="mt-5 mr-2 btn btn-outline-success" onClick={e => e.preventDefault() + clickValidate(pricing.id, pricing.pricePerKilo, pricing.duration, pricing.basePrice)}>Validate</button>
                            <button className="mt-5 btn btn-outline-danger" onClick={e => e.preventDefault() +clickDelet(pricing.id)}>Delete</button>
                        </div>
                    </div>
                )
                setDivShip(details);
            } else {
                setDivShip("No region declared")
            }
        })
        .catch(error => {
            // toast.error('Error !', {position: 'top-center'});
        });
    }, []);

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/region", config).then(e => {
            setAllRegion(e.data.data);
        });
    }, []);
    
    allRegion.map(region => {
        optionRegions.push(<option key={region.id} value={region.id}>{region.name}</option>)
    });
    
    function clickValidate(id, pricePerKilo, duration, basePrice) {
        setIdSHippingPricing(id);
        setObjPut({
            "pricePerKilo": pricePerKilo,
            "duration": duration,
            "basePrice": basePrice
        })
        setIsReadyUpdate(true);
    }

    useEffect(() => {
        if (isReadyUpdate) {
            setIsReadyUpdate(false);
            const body = {
                "pricePerKilo" : updatePriceKG != "" ? updatePriceKG : objPut.pricePerKilo,
                "duration" : updateDuration != "" ? updateDuration : objPut.duration,
                "basePrice" : updateBasePrice != "" ? updateBasePrice : objPut.basePrice,
            }
            axios.put(process.env.REACT_APP_API_LINK + "/api/shippingpricing/" + idSHippingPricing, body, config).then(res => {
                toast.success('Shipping Region deleted', {position: 'top-center'});
                console.log(res);
            })
            .catch(error => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReadyUpdate]);
    
    function clickDelet(id) {
        axios.delete(process.env.REACT_APP_API_LINK + "/api/shippingpricing/" + id, config).then(res => {
            toast.success('Shipping Region deleted', {position: 'top-center'});
            window.location.reload();
        })
        .catch(error => {
            toast.error('Error !', {position: 'top-center'});
        });
    }

    function onChange(event) {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let company = str.charAt(0).toUpperCase() + str.slice(1);
        setNewName(company.replace(/[\s]{2,}/g, " "));
    }

    function onSubmitName(e) {
        e.preventDefault();

        if (newName != "") {
            if (newName.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?.@#\]]/)) {
                toast.error('Invalids charactere !', {position: 'top-center'});
            } else {
                axios.get(process.env.REACT_APP_API_LINK + "/api/shippingmethod/",config).then(res => {
                    let error = false;
                    res.data.data.map( result => {
                        if (result.name === newName) {
                            error = true;
                        }
                    });
                    if (error == false) {
                        let body = {
                            "name": newName
                        }
                        axios.put(process.env.REACT_APP_API_LINK + "/api/shippingmethod/" + idShipping, body, config).then(res => {
                            toast.success('Update successfuly', {position: 'top-center'});
                            setShow(false);
                            setName(newName);
                        }).catch(errorres => {
                            console.log(errorres);
                        });
                    } else {
                        toast.error('Name already exist !', {position: 'top-center'});
                    }
                });
            }
        } else {
            toast.error('Enter a name to update !', {position: 'top-center'});
        }
    }

    function onSubmit(e) {
        e.preventDefault();
        let invalids = {};

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
            let body = {
                "pricePerKilo" : priceKG,
                "duration" : duration,
                "basePrice" : basePrice,
                "shippingMethod" : Number(idShipping), 
                "region" : Number(selectRegion)
            }
            axios.post(process.env.REACT_APP_API_LINK + "/api/shippingpricing", body, config).then(res => {
                toast.success('Shipping Region added', {position: 'top-center'});
                window.location.reload();
            }).catch(err => {
                toast.error(err.response.data.message, {position: 'top-center'});
            });
        }
    }, [isReady]);
    
    return (
        <>
            <ToastContainer />
            <div className="container">
                <h1>Update {name}</h1>
                <div className="row justify-content-end mb-2">
                    <button onClick={() => setShow(true)} className='float-right btn btn-info m-2'> Modify Name </button>
                    <button onClick={() => window.location.href = '/admin?tab=5'} className='float-right btn btn-warning m-2'> Back to Dashboard </button>
                </div>
                <div className="resultShipUpdate">
                    {divShip}
                </div>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        Change name !
                        </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmitName}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={onChange}
                                />
                                <Button color="dark" className="mt-4" block>
                                    Submit
                                </Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
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
                        <Button color="success" className="mt-3" block>Add</Button>
                    </FormGroup>
                </Form>
            </div>
        </>
    )
}

export default UpdateShipping;