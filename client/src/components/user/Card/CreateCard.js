import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateCard({idUser, config, closeModal}) {
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [cardNumber1, setCardNumber1] = useState("");
    const [cardNumber2, setCardNumber2] = useState("");
    const [cardNumber3, setCardNumber3] = useState("");
    const [cardNumber4, setCardNumber4] = useState("");
    const [card, setCard] = useState("");
    const [crypto, setCrypto] = useState("");
    const [expiration, setExpiration] = useState("");
    const [expirationMonth, setExpirationMonth] = useState(1);
    const [expirationYear, setExpirationYear] = useState(1);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isReady, setIsReady] = useState(false);

    let idcard1 = document.getElementById("cardnumber1");
    let idcard2 = document.getElementById("cardnumber2");
    let idcard3 = document.getElementById("cardnumber3");
    let idcard4 = document.getElementById("cardnumber4");
    
    // const removeError = () => {
    //     let value = isInvalid;
    //     delete value.cardnumber;
    //     setIsInvalid(value);
    // }

    useEffect(() => {
        // removeError();
        if (cardNumber1.length === 4) {
            idcard2.focus();
        }
        if (cardNumber1.length > 4) {
            idcard1.value = cardNumber1.substr(0,4);
            setCardNumber1(cardNumber1.substr(0, 4));
        }
    }, [cardNumber1]);

    useEffect(() => {
        if (cardNumber2.length === 4) {
            idcard3.focus();
        }
        if (cardNumber2.length > 4) {
            idcard2.value = cardNumber2.substr(0,4);
            setCardNumber2(cardNumber2.substr(0, 4));
        }
        // removeError();
    }, [cardNumber2]);

    useEffect(() => {
        if (cardNumber3.length === 4) {
            idcard4.focus();
        }
        if (cardNumber3.length > 4) {
            idcard3.value = cardNumber3.substr(0,4);
            setCardNumber3(cardNumber3.substr(0, 4));
        }
        // removeError();
    }, [cardNumber3]);

    useEffect(() => {
        if (cardNumber4.length === 4) {
            document.getElementById("expirationMonth").focus();
        }
        if (cardNumber4.length > 4) {
            idcard4.value = cardNumber4.substr(0,4);
            setCardNumber4(cardNumber4.substr(0, 4));
        }
        // removeError();
    }, [cardNumber4]);

    useEffect(() => {
        if (expirationMonth.length === 2) {
            document.getElementById("expirationYear").focus();
        }
        if (expirationMonth.length > 2) {
            document.getElementById("expirationMonth").value = expirationMonth.substr(0,2);
            setExpirationMonth(expirationMonth.substr(0, 2));
        }
    }, [expirationMonth]);

    useEffect(() => {
        if (expirationYear.length === 2) {
            document.getElementById("cryptogramme").focus();
        }
        if (expirationYear.length > 2) {
            document.getElementById("expirationYear").value = expirationYear.substr(0,2);
            setExpirationYear(expirationYear.substr(0, 2));
        }
    }, [expirationYear]);

    useEffect(() => {
        if (crypto.length === 3) {
            document.getElementById("firstname").focus();
        }
        if (crypto.length > 3) {
            document.getElementById("cryptogramme").value = crypto.substr(0, 3);
            setExpirationYear(expirationYear.substr(0, 3));
        }
    }, [crypto]);

    function changeFirstname(event) {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let firstname = str.charAt(0).toUpperCase() + str.slice(1);
        setFirstname(firstname);
    }
    
    function changeLastname(event) {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let lastname = str.charAt(0).toUpperCase() + str.slice(1);
        setLastname(lastname);
    }

    function onSubmit(e) {
        e.preventDefault();
        let invalids = {};
        let cardNumber = cardNumber1 + cardNumber2 + cardNumber3 + cardNumber4;
        let expiration = expirationMonth + "/" + expirationYear;
        let date = new Date().getYear();
        setCard(cardNumber);
        setExpiration(expiration);

        if (expirationMonth.length === undefined || expirationMonth === "" || expirationMonth < 1 || expirationMonth > 12) {
            invalids.expiration1 = "Enter month expiration valid";
        } else if (expirationMonth.length !== 2) {
            invalids.expiration1 = "Format required 'xx' 2 numbers";
        }
        if (expirationYear.length === undefined || expirationYear === "" || expirationYear < 1 || expirationYear < (date-100)) {
            invalids.expiration2 = "Enter year expiration valid";
        } else if (expirationYear.length !== 2) {
            invalids.expiration2 = "Format required 'xx' 2 numbers";
        }
        if (firstname !== "") {
            if (firstname.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
                invalids.firstname = "Invalids characters";
            }
        } else {
            invalids.firstname = "Enter a Firstname";
        }
        if (lastname !== "") {
            if (lastname.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
                invalids.lastname = "Invalids characters";
            }
        } else {
            invalids.lastname = "Enter a Lastname";
        }
        if (cardNumber !== "") {
            if (!cardNumber.match(/^[0-9]*$/)) {
                invalids.cardnumber = "Enter only number";
            } else if (cardNumber.length !== 16) {
                invalids.cardnumber = "Enter only 16 numberds"; 
            }
        } else {
            invalids.cardnumber = "Enter your number card";
        }
        if (crypto === "") {
            invalids.crypto = "Enter cryptogramme";
        } else if (!Number(crypto) || crypto.length < 3) {
            invalids.crypto = "Enter a 3 numbers";
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
            const body = {
                "user":idUser,
                "cardNumbers": card,
                "expirationDate": expiration,
                "ccv": crypto,
                "firstname": firstname,
                "lastname": lastname
            }
            axios.post(process.env.REACT_APP_API_LINK + "/api/cardcredentials", body, config).then(res => {
                closeModal();
                toast.success(res.data.message, {position: "top-center"});
            }).catch(err => {
                console.log(err);
            });
        }
    }, [isReady]);

    return (
        <>
            <ToastContainer />
            <Modal.Header closeButton>
                <h1 className="mb-1">Add a new Card !</h1>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label for="cardnumber">Card Numbers</Label>
                        <div className="d-flex">
                            <Input
                                type="text"
                                name="cardnumber"
                                id="cardnumber1"
                                className={"inputCard " + (isInvalid.cardnumber ? 'is-invalid' : '')}
                                onChange={(e) => setCardNumber1(e.target.value)}/>
                            <Input
                                type="text"
                                name="cardnumber"
                                id="cardnumber2"
                                className={"inputCard " + (isInvalid.cardnumber ? 'is-invalid' : '')}
                                onChange={(e) => setCardNumber2(e.target.value)}/>
                            <Input
                                type="text"
                                name="cardnumber"
                                id="cardnumber3"
                                className={"inputCard " + (isInvalid.cardnumber ? 'is-invalid' : '')}
                                onChange={(e) => setCardNumber3(e.target.value)}/>
                            <Input
                                type="text"
                                name="cardnumber"
                                id="cardnumber4"
                                className={"inputCard " + (isInvalid.cardnumber ? 'is-invalid' : '')}
                                onChange={(e) => setCardNumber4(e.target.value)}/>
                        </div>
                        {isInvalid && isInvalid.cardnumber ? <span className="text-danger sizemin">{isInvalid.cardnumber}<br/></span> : null}
                        <br/>      
                        <Label for="expirationDate">Expiration Date <font color="grey"> (ex: 08/21)</font></Label>
                        <Label for="cryptogramme">Cryptogramme</Label>
                        <div className="d-flex">
                            <Input
                                type="text"
                                name="expirationDate"
                                id="expirationMonth"
                                className={"inputCard " + (isInvalid.expiration1 ? 'is-invalid' : '')}
                                placeholder="mm"
                                onChange={(e) => setExpirationMonth(e.target.value)}/>
                                <h2 className="slash">/</h2>
                            <Input
                                type="text"
                                name="expirationDate"
                                id="expirationYear"
                                className={"inputCard " + (isInvalid.expiration2 ? 'is-invalid' : '')}
                                placeholder="yy"
                                onChange={(e) => setExpirationYear(e.target.value)}/>            
                            <Input
                                type="text"
                                name="cryptogramme"
                                id="cryptogramme"
                                className={(isInvalid.crypto ? 'is-invalid' : '')}
                                onChange={(e) => setCrypto(e.target.value)}/>
                        </div>
                        {isInvalid && isInvalid.crypto ? <span className="text-danger sizemin positionCrypto">{isInvalid.crypto}<br/></span> : null}
                        {isInvalid && isInvalid.expiration1 ? <span className="text-danger sizemin">{isInvalid.expiration1}<br/></span> : null}
                        {isInvalid && isInvalid.expiration2 ? <span className="text-danger sizemin">{isInvalid.expiration2}<br/></span> : null}
                        <Label for="firstname">Firstname</Label>
                        <Input
                            type="text"
                            name="firstname"
                            id="firstname"
                            className={(isInvalid.firstname ? 'is-invalid' : '')}
                            onChange={changeFirstname}/>
                        <div className="invalid-feedback">{ isInvalid.firstname }</div>
                        <br/>
                        <Label for="lastname">Lastname</Label>
                        <Input
                            type="text"
                            name="lastname"
                            id="lastname"
                            className={(isInvalid.lastname ? 'is-invalid' : '')}
                            onChange={changeLastname}/>
                        <div className="invalid-feedback">{ isInvalid.lastname }</div>
                        <Button color="dark" className="mt-4" block>
                            Submit
                        </Button>
                    </FormGroup>
                </Form>
            </Modal.Body>
        </>
    )
}

export default CreateCard;