import axios from "axios";
import React, { useState, useEffect } from "react";
import logocb from "../../../img/logocb.png";
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { ToastContainer, toast } from "react-toastify";
import CreateCard from './CreateCard';

function Card(props) {
    const [show, setShow] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [cards, setCards] = useState([]);
    const [idCard, setIdCard] = useState([]);
    const [readyDelete, setReadyDelete] = useState(false);

    function DeleteCard(id) {
        setShow(true);
        setIdCard(id);
    }

    useEffect(() => {
        if (readyDelete) {
            setReadyDelete(false);
            axios.delete(process.env.REACT_APP_API_LINK + "/api/cardcredentials/" + idCard).then(res => {
                toast.success(res.data.message, { position: "top-center" });
                setIdCard([]);
                getCard();
            }).catch(error => {
                console.log(error);
            });
        }
    }, [readyDelete]);

    const crypt = (cardnumber) => {
        let val = '' + cardnumber
        let card = val.substr(0, 4) + ' **** **** ****'
        return card
    }

    const getCard = () => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/cardcredentials/user/" + props.idUser).then(res => {
            const newDataCards = res.data.map(e =>
                <div className="divCard row m-3" key={e.id}>
                    <div className="card-wrap ">
                        <div className="card card-front">
                            <div className="number">
                                <div className="label">card number</div>
                                <span>{crypt(e.cardNumbers)}</span>
                            </div>
                            <div className="owner-data">
                                <div className="name">
                                    <div className="label">cardholder name</div>
                                    <div className="value">{e.firstname} {e.lastname}</div>
                                </div>
                                <div className="validate">
                                    <div className="label">Valid THU</div>
                                    <div className="value">{e.expirationDate}</div>
                                </div>
                            </div>
                            <div className="flag">
                                <img src="https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_rev_92px_2x.png" alt="mastercard" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="cryptogramme mr-5">Cryptogramme:</p>
                        <p className="pccv"><h6 className="colorblack"></h6><span className="spanccv">{e.ccv}</span></p>
                    </div>

                    {/* <div className="triangle"></div> */}
                    <button className="btn btn-outline-danger cardDelete" onClick={prev => prev.preventDefault + DeleteCard(e.id)}>Delete Card</button>
                </div>
                // <div className="divCard row" key={e.id}>
                //     <div className="cards">
                //         <h5 className="titleCard ">Card <img className="logocb" src={logocb} /></h5>
                //         <h5 className="titleCard text-center">{e.cardNumbers}</h5>
                //         <span className="titleCard">{e.expirationDate}</span>
                //         <h6 className="titleCard">{e.firstname} {e.lastname}</h6>
                //     </div>

                // </div>
            )
            setCards(newDataCards);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getCard();
    }, [showCreate]);

    const closeModal = () => {
        setShowCreate(false);
    }

    return (
        <>
            <ToastContainer />
            <h1>Your Cards</h1>
            <div className="container">
                <div className="row justify-content-end mb-2 mr-3">
                    <button className="btn btn-success addcard" onClick={() => setShowCreate(true)}>Add Card</button>
                </div>

                <div className="YourCards">
                    {cards}
                </div>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <h3>Delete Card</h3>
                </Modal.Header>
                <Modal.Body>
                    <h2>You are going to delete this card Are you sure ?</h2>
                    <Button color="warning" className="mt-4" onClick={() => setReadyDelete(false) + setShow(false)}>Cancel</Button>
                    <Button color="danger" className="mt-4" onClick={() => setReadyDelete(true) + setShow(false)} >Yes</Button>
                </Modal.Body>
            </Modal>
            <Modal show={showCreate} onHide={() => setShowCreate(false)}>
                <CreateCard idUser={props.idUser} config={props.config} closeModal={closeModal} />
            </Modal>
        </>
    )
}

export default Card;