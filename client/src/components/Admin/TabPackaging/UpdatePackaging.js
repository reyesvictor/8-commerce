import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-date-picker';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function UpdatePackaging({ config, closeModal, idPack, receivedData }) {
    const [packaginName, setPackagingName] = useState("");
    const [spending, setSpending] = useState([]);
    const [price, setPrice] = useState([]);
    const [value, onChange] = useState(new Date());
    const [value2, onChange2] = useState(new Date());
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [isInvalid, setIsInvalid] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + `/api/packaging/${idPack}`, config).then(async res => {
            setPackagingName(res.data.name);
            setPrice(res.data.price);
            setSpending(res.data.minSpending);
            onChange(new Date(res.data.startsAt));
            onChange2(new Date(res.data.endsAt));
        }).catch(error => {
            console.log(error);
        });
    }, []);
    
    function onChangeName(event) {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let name = str.charAt(0).toUpperCase() + str.slice(1);
        setPackagingName(name.replace(/[\s]{2,}/g, " "));
    }

    function onSubmit(e) {
        e.preventDefault();
        let invalids = {};
        let dateStartAt = "";
        let dateEndAt = "";

        if (packaginName !== "") {
            if (packaginName.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
                invalids.name = "Invalid character";
            }
        } else {
            invalids.name = "Enter name please";
        }
        if (spending.length === 0 || isNaN(spending)) {
            invalids.spending = "Enter spending please";
        }
        if (price.length === 0 || isNaN(price)) {
            invalids.price = "Enter price please";
        }
        if (value === null) {
            invalids.value = "Enter date start valid";
        } else {
            let month = value.getMonth() + 1;
            let now = new Date();
            if (value.getMonth() + 1 < 10) {
                if ((value.getMonth() + 1) < (now.getMonth() + 1)) {
                    invalids.value = "Enter date start valid";
                } else {   
                    month = "0" + (value.getMonth() + 1);
                    dateStartAt = month + "/" + value.getDate() + "/" + value.getFullYear();
                }
            }
        }
        if (value2 === null) {
            invalids.value2 = "Enter date end valid";
        } else {
            let month2 = value2.getMonth() + 1;
            let now = new Date();
            if (value2.getMonth() + 1 < 10) {
                if ((value2.getMonth() + 1) < (now.getMonth() + 1)) {
                    invalids.value2 = "Enter date end valid";
                } else {
                    month2 = "0" + (value2.getMonth() + 1);
                    dateEndAt = month2 + "/" + value2.getDate() + "/" + value2.getFullYear();
                }
            } 
        }
        setDateStart(dateStartAt);
        setDateEnd(dateEndAt);

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
            const body = {
                "name": packaginName,
                "startsAt": dateStart,
                "endsAt": dateEnd,
                "minSpending": spending,
                "price": price
            }
            console.log(body);
            axios.put(process.env.REACT_APP_API_LINK + "/api/packaging/" + idPack, body, config).then(res => {
                toast.success(res.data.message, { position: "top-center" });
                closeModal();
                receivedData();
            }).catch(err => {
                console.log(err);
            });
        }
    }, [isReady]);

    return (
        <>
            <Modal.Header closeButton>Update Packaging !</Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label for="Name">Name</Label>
                        <Input
                            type="text"
                            name="Name"
                            id="Name"
                            value={packaginName}
                            className={(isInvalid.name ? 'is-invalid' : '')}
                            onChange={onChangeName} />
                        <div className="invalid-feedback">{isInvalid.name}</div>
                        <br />
                        <Label for="spending">Min Spending</Label>
                        <Input
                            type="number"
                            name="spending"
                            id="spending"
                            value={spending}
                            className={(isInvalid.spending ? 'is-invalid' : '')}
                            onChange={(e) => setSpending(parseInt(e.target.value))} />
                        <div className="invalid-feedback">{isInvalid.spending}</div>
                        <br />
                        <Label for="spending">Price</Label>
                        <Input
                            type="number"
                            name="price"
                            id="price"
                            value={price}
                            className={(isInvalid.price ? 'is-invalid' : '')}
                            onChange={(e) => setPrice(parseInt(e.target.value))} />
                        <div className="invalid-feedback">{isInvalid.price}</div>
                        <br />
                        <div className="d-flex">
                            <div className="">
                                <Label for="datestart">Date start</Label><br />
                                <DatePicker
                                    onChange={onChange}
                                    value={value}
                                    className={(isInvalid.value ? 'is-invalid' : '')} />
                                <div className="invalid-feedback">{isInvalid.value}</div>
                            </div>
                            <br />
                            <div className="ml-5">
                                <Label for="dateEnd">Date end</Label><br />
                                <DatePicker
                                    onChange={onChange2}
                                    value={value2}
                                    className={(isInvalid.value2 ? 'is-invalid' : '')} />
                                <div className="invalid-feedback">{isInvalid.value2}</div>
                            </div>
                        </div>
                        <Button color="dark" className="mt-4" block>Submit</Button>
                    </FormGroup>
                </Form>
            </Modal.Body>
        </>
    )
}

export default UpdatePackaging;