import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateShippingAddress from './CreateShippingAddress';
import UpdateShippingAddress from './UpdateShippingAddress';
function ShippingAddress({ idUser, config }) {
    console.log(idUser);
    console.log(config);
    const [allShippingAddress, setAllShippingAddress] = useState();
    const [addressId, setAddressId] = useState(0);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        shippingAddressData();
    }, [showAdd, showUpdate])

    const shippingAddressData = () => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/user/" + idUser + "/address", config).then(res => {
            console.log(res.data)
            console.log(res.data.shippingAddress)
            let dataToGive = res.data.shippingAddress.length > 0 ? res.data.shippingAddress.map((data, index) =>
                <tr key={data.id}>
                    {console.log(data.address)}
                    <td><p className="m-2 align-items-center">{data.address}</p></td>
                    <td><p className="m-2 align-items-center">{data.city}</p></td>
                    <td><p className="m-2 align-items-center">{data.region.name}</p></td>
                    <td><p className="m-2 align-items-center">{data.country}</p></td>
                    <td><p className="m-2 align-items-center">{data.postcode}</p></td>
                    <td><p className="m-2 align-items-center">{data.firstname}</p></td>
                    <td><p className="m-2 align-items-center">{data.lastname}</p></td>
                    <td><button className="btn btn-outline-info m-1" onClick={async () => { await setAddressId(data.id); setShowUpdate(true) }}> Update </button></td>
                    <td><button className="btn btn-outline-danger m-1" onClick={() => deleteAddress(data.id)}> Delete </button></td>
                </tr>
            ) : null
            setAllShippingAddress(dataToGive)
        }).catch(err => {
            console.log(err);
        })
    }

    const deleteAddress = (id) => {
        console.log(id);
        axios.delete(process.env.REACT_APP_API_LINK + "/api/addressshipping/" + id, config).then(res => {
            shippingAddressData();
            toast.success(res.data.message, { position: 'top-center' })
        }).catch(err => {
            console.log(err)
            toast.error(err.response.data.message, { position: 'top-center' })
        })
    }

    const closeModal = () => {
        setShowAdd(false);
        setShowUpdate(false);
    }

    return (
        <>
            <ToastContainer />
            <h1>Shipping Address</h1>
            <div className="row justify-content-end mb-2 mr-3">
                <button onClick={() => setShowAdd(true)} className="btn btn-success m-1">
                    + New Shipping Address
        </button>
            </div>
            <div className="row border  bg-light  p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2"> Address </p></th>
                            <th><p className="m-2"> City </p></th>
                            <th><p className="m-2"> Region </p></th>
                            <th><p className="m-2"> Country </p></th>
                            <th><p className="m-2"> Postcode </p></th>
                            <th><p className="m-2"> Firstname </p></th>
                            <th><p className="m-2"> Lastname </p></th>
                            <th><p className="m-2"> Action</p></th>
                        </tr>
                    </thead>
                    <tbody>{allShippingAddress}</tbody>
                </table>
                <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                    <CreateShippingAddress idUser={idUser} config={config} closeModal={closeModal} />
                </Modal>
                <Modal show={showUpdate} onHide={() => setShowUpdate(false)}>
                    <UpdateShippingAddress idUser={idUser} config={config} idAddress={addressId} closeModal={closeModal} />
                </Modal>
            </div>
        </>
    )
}

export default ShippingAddress;