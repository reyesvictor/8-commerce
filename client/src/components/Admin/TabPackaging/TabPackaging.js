import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePackaging from './CreatePackaging';
import UpdatePackaging from './UpdatePackaging';
import store from '../../../store';

function Packaging() {
    const [show, setShow] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [postDataPack, setPostDataPack] = useState(false);
    const [idPack, setPackId] = useState(false);

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
        receivedData();
    }, []);

    function receivedData() {
        axios.get(process.env.REACT_APP_API_LINK + `/api/packaging`, config).then(async res => {
            // await setPageCount(Math.ceil(res.data.nbResults / limit));
            const newPostData = res.data.length > 0 ? res.data.map((pack) =>
                <tr key={pack.id}>
                    <td><p className="m-2 align-items-center">{pack.id}</p></td>
                    <td><p className="m-2">{pack.name.toUpperCase()}</p></td>
                    <td><p className="m-2">{pack.startsAt.substr(8, 10).slice(0, 2) + '/' + pack.startsAt.substr(5, 10).slice(0, 2) + '/' + pack.startsAt.substr(0, 10).slice(0, 4)}</p></td>
                    <td><p className="m-2">{pack.endsAt.substr(8, 10).slice(0, 2) + '/' + pack.endsAt.substr(5, 10).slice(0, 2) + '/' + pack.endsAt.substr(0, 10).slice(0, 4)}</p></td>
                    <td><p className="m-2">{pack.minSpending}</p></td>
                    <td><p className="m-2">{pack.price}</p></td>
                    <td> <button className="btn btn-outline-info m-1" onClick={() => { setPackId(pack.id); setShowUpdate(true) }}>Modify</button></td>
                </tr>
            ) : null
            setPostDataPack(newPostData);
        }).catch(error => {
            console.log(error);
            toast.error('Error !', { position: 'top-center' });
        })
    }

    function closeModal() {
        setShow(false);
    }
    function closeModalUpdate() {
        setShowUpdate(false);
    }

    return (
        <>
            <div className="row justify-content-end mb-2">
                <button onClick={() => setShow(true)} className="btn btn-success m-1">+ New Packaging</button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <CreatePackaging config={config} closeModal={closeModal} receivedData={receivedData} />
                </Modal>
                <Modal show={showUpdate} onHide={() => setShowUpdate(false)}>
                    <UpdatePackaging config={config} closeModal={closeModalUpdate} idPack={idPack} receivedData={receivedData} />
                </Modal>
            </div>
            <div className="row  bg-light border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2 align-items-center">ID</p></th>
                            <th><p className="m-2">Name</p></th>
                            <th><p className="m-2">Date Start</p></th>
                            <th><p className="m-2">Date end</p></th>
                            <th><p className="m-2">Spending</p></th>
                            <th><p className="m-2">Price</p></th>
                            <th><p colSpan="3" className="m-1">Actions</p></th>
                        </tr>
                    </thead>
                    <tbody>{postDataPack}</tbody>
                </table>
            </div>
        </>
    )
}

export default Packaging;