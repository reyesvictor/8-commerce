import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../../../store';

function Suppliers() {
    const [show, setShow] = useState(false);
    const [supplierName, setSupplierName] = useState([]);
    const [allSupplier, setAllSupplier] = useState([]);
    const [postDataOrder, setPostDataOrder] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    // const [showConfirm, setShowConfirm] = useState(false);
    // const [returnConfirm, setReturnConfirm] = useState(false);
    const optionSelect = [];
    const [divOrder, setDivOrder] = useState([]);

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
        axios.get(process.env.REACT_APP_API_LINK + "/api/supplier", config).then(e => {
            setAllSupplier(e.data.data);
        });
    }, []);

    useEffect(() => {
        if (postDataOrder === null) setOffset(offset - limit);
    }, [postDataOrder])

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + `/api/supplier/order?offset=${offset}&limit=${limit}`, config).then(async e => {
            await setPageCount(Math.ceil(e.data.nbResults / limit));
            const newPostDataOrder = e.data.data.map((order) =>
                <tr key={order.id}>
                    <td><p className="myMargin align-items-center">{order.id}</p></td>
                    <td><p className="myMargin">{order.our_address}</p></td>
                    <td><p className="myMargin">{order.price} €</p></td>
                    <td><button onClick={e => e.preventDefault() + showDetailsOrder(order.id)} className="btn btn-outline-dark m-1">View</button></td>
                    {order.status == false ?
                        <td><button onClick={e => e.preventDefault() + markShipped(order.id)} className="btn btn-outline-success m-1">Mark as arrived</button></td> :
                        <td><button className="btn btn-outline-success m-1 disabled" disabled>Arrived ✅</button></td>
                    }
                </tr>
            )
            setPostDataOrder(newPostDataOrder);
        });
    }, [offset]);

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

    allSupplier.map(supp => {
        optionSelect.push(<option key={supp.id} value={supp.id}>{supp.name}</option>)
    });

    const onChange = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let supplier = str.charAt(0).toUpperCase() + str.slice(1);
        setSupplierName(supplier.replace(/[\s]{2,}/g, " "));
    }
    function onSubmit(e) {
        e.preventDefault();
        if (supplierName.length === 0) {
            return toast.error("You need to enter a name", { position: "top-center" });
        }
        if (supplierName.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        } else {
            const body = {
                "name": supplierName
            };
            axios.post(process.env.REACT_APP_API_LINK + "/api/supplier", body, config).then(e => {
                toast.success("Supplier correctly added !", { position: "top-center" });
                setShow(false);
            }).catch(err => {
                toast.error('Error !', { position: 'top-center' });
            });
        }
    }

    function showDetailsOrder(id) {
        axios.get(process.env.REACT_APP_API_LINK + "/api/supplier/order/" + id, config).then(res => {
            setDivOrder(res.data.supplierOrderSubproducts);
            setShowDetails(true);
        }).catch(error => {
            console.log(error);
        });
    }

    function markShipped(id) {
        // setShowConfirm(true)

        const body = {
            "status": true
        };
        axios.put(process.env.REACT_APP_API_LINK + "/api/supplier/order/" + id, body, config).then(res => {
            toast.success("Order received !", { position: "top-center" });
            axios.get(process.env.REACT_APP_API_LINK + "/api/supplier/order", config).then(e => {
                const newPostDataOrder = e.data.data.map((order) =>
                    <tr key={order.id}>
                        <td><p className="myMargin align-items-center">{order.id}</p></td>
                        <td><p className="myMargin">{order.our_address}</p></td>
                        <td><p className="myMargin">{order.price}</p></td>
                        <td><button onClick={e => e.preventDefault() + showDetailsOrder(order.id)} className="btn btn-outline-dark m-1">View</button></td>
                        {order.status == false ?
                            <td><button onClick={e => e.preventDefault() + markShipped(order.id)} className="btn btn-outline-success m-1">Mark as arrived</button></td> :
                            <td><button className="btn btn-outline-success m-1 disabled" disabled>Arrived ✅</button></td>
                        }
                    </tr>
                )
                setPostDataOrder(newPostDataOrder);
            });
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <>
            <div className="row justify-content-end mb-2">
                <button onClick={() => window.location.href = 'admin/order'} className="btn btn-success m-1">+ New Order</button>
                <button onClick={() => setShow(true)} className="btn btn-success m-1">+ New Supplier</button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>New Supplier !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmit}>
                            <FormGroup>
                                <Label for="supplier">Suplier name</Label>
                                <Input
                                    type="text"
                                    name="supplier"
                                    id="supplier"
                                    onChange={onChange} />
                                <Button color="dark" className="mt-4" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={showDetails} onHide={() => setShowDetails(false)}>
                    <Modal.Header closeButton>Order !</Modal.Header>
                    <Modal.Body>
                        {divOrder.length > 0 &&
                            divOrder.map(subProduct =>
                                <div className="divOrderCart" key={subProduct.subproduct.id}>
                                    <table className="productinCart">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span><b>Title:</b> {subProduct.subproduct.product.title}</span>
                                                </td>
                                            </tr>

                                            <tr className="tableborder">
                                                <td className="detailsproduct">
                                                    <img src={process.env.REACT_APP_API_LINK + `/api/image/${subProduct.subproduct.product.id}/default/1.jpg`} />
                                                    <span><b>ID:</b> {subProduct.subproduct.id}</span>
                                                    <span><b>Color:</b> {subProduct.subproduct.color.name}</span>
                                                    <span><b>Size:</b> {subProduct.subproduct.size}</span>
                                                    <span><b>Quantity:</b> {subProduct.quantity}</span>
                                                    <span><b>Price:</b> {subProduct.subproduct.price} €</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        <Button color="dark" className="mt-4" block onClick={() => setShowDetails(false)}>Close</Button>
                    </Modal.Body>
                </Modal>
                {/* <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                    <Modal.Header closeButton>Confirm Order !</Modal.Header>
                    <Modal.Body>
                        <h2 className="mt-3 mb-5">Have you received your order ?</h2>
                        <Button color="success" className="mt-4" block onClick={() => setShowConfirm(false)}>Yes, confirmed</Button>
                        <Button color="dark" className="mt-4" block onClick={() => setShowConfirm(false)}>Close</Button>
                    </Modal.Body>
                </Modal> */}
            </div>
            <div className="row border  bg-light  p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="myMargin align-items-center"> ID </p></th>
                            <th><p className="myMargin"> Order </p></th>
                            <th><p className="myMargin"> Price </p></th>
                            <th><p className="myMargin" colSpan="3" className="m-1"> Actions </p></th>
                        </tr>
                    </thead>
                    <tbody>{postDataOrder}</tbody>
                </table>
            </div>
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

export default Suppliers;