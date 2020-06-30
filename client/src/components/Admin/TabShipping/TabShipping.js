import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

function Shipping() {
    const [postDataShipp, setPostDataShipp] = useState([]);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [divShipp, setDivShipp] = useState([]);
    const [showDetails, setShowDetails] = useState(false);

    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": 'Bearer '+token
        }
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

    useEffect(() => {
        if (postDataShipp === null) setOffset(offset - limit);
    }, [postDataShipp])

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + `/api/shippingmethod?offset=${offset}&limit=${limit}`, config).then(async e => {
            await setPageCount(Math.ceil(e.data.nbResults / limit));
            const newPostDataShipp = e.data.data.map((shipping) =>
                <tr key={shipping.id}>
                    <td><p className="myMargin align-items-center">{shipping.id}</p></td>
                    <td><p className="myMargin">{shipping.name}</p></td>
                    <td><button onClick={e => e.preventDefault() + showDetailsShipping(shipping.id)} className="btn btn-outline-dark m-1">View</button></td>
                    <td><button onClick={() => window.location.href = '/admin/update/shipping/' + shipping.id} className="btn btn-outline-info m-1">Modify</button></td>
                </tr>
            );
            setPostDataShipp(newPostDataShipp);
        });
    }, [offset]);

    function showDetailsShipping(id) {
        axios.get(process.env.REACT_APP_API_LINK + "/api/shippingmethod/" + id, config).then(res => {
            setDivShipp(res.data.shippingPricings);
            setShowDetails(true);
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <>
            <div className="row justify-content-end mb-2">
                <button onClick={() => window.location.href = 'admin/create/shipping'} className="btn btn-success m-1">+ New Shipping company</button>
                {/* <button className="btn btn-success m-1">+ New Supplier</button> */}
            </div>
            <div className="row bg-light border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="myMargin align-items-center"> ID </p></th>
                            <th><p className="myMargin"> Company </p></th>
                            <th><p className="myMargin" colSpan="3" className="m-1"> Actions </p></th>
                        </tr>
                    </thead>
                    <tbody>{postDataShipp}</tbody>
                </table>
            </div>
            <Modal show={showDetails} onHide={() => setShowDetails(false)}>
                <Modal.Header closeButton>Order !</Modal.Header>
                <Modal.Body>
                    {divShipp.length > 0 ?
                        divShipp.map(ship =>
                            <div className="divOrderCart" key={ship.id}>
                                <table className="productinCart">
                                    <tbody>
                                        <tr>
                                            <td className="detailsShip">
                                                <span><b>ID:</b> {ship.id}</span>
                                                <span><b>Region:</b> {ship.region.name}</span>
                                            </td>
                                        </tr>
                                        <tr className="tableborder">
                                            <td className="detailsShip">
                                                <span><b>Price per Kilo:</b> {ship.pricePerKilo}</span>
                                                <span><b>Duration:</b> {ship.duration}</span>
                                                <span><b>Base Price:</b> {ship.basePrice}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : <h4>No region declared</h4>}
                    <Button color="dark" className="mt-4" block onClick={() => setShowDetails(false)}>Close</Button>
                </Modal.Body>
            </Modal>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    {pageCount > 0 &&
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />}
                </div>
            </div>
        </>
    )
}

export default Shipping;