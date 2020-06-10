import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Suppliers() {
    const [show, setShow] = useState(false);
    const [supplierName, setSupplierName] = useState([]);
    const [show2, setShow2] = useState(false);
    const [idSupplier, setIdSupplier] = useState([]);
    const [ourAdress, setOurAdress] = useState([]);
    const [price, setPrice] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [allSupplier, setAllSupplier] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const optionSelect = [];

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

    allSupplier.map(supp => {
        optionSelect.push(<option key={supp.id} value={supp.id}>{supp.name}</option>)
    });

    const [isInvalid, setIsInvalid] = useState(false);
    const onChangeAdress = (event) => {
        let res = event.target.value.trim();
        setOurAdress(res.replace(/[\s]{2,}/g, " "));
    }
    const onChangePrice = (event) => {
        setPrice(event.target.value);
    }
    const onChangeQty = (event) => {
        setQuantity(event.target.value);
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
        if (price.length == 0) {
            invalids.price = "PLease enter price";
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
            const body = {
                "our_address" : ourAdress,
                "status" : false,
                "price" : price,
                "arrival_date" : Shipping(3),
                "supplier_id" : idSupplier
            }
            axios.post("http://127.0.0.1:8000/api/supplier/order", body, config).then( e => {
                setIsReady(false);
                toast.success('Product correctly added!', { position: "top-center"});
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }, [isReady]);

//-------------------- SUPPLIER NAME ------------------------
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
                "name" : supplierName
            }
            axios.post("http://127.0.0.1:8000/api/supplier", body, config).then( e => {
                toast.success("Supplier correctly added !", { position: "top-center" });
                setShow(false);
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row justify-content-end mb-2">
                <button onClick={() => window.location.href = 'admin/order'} className="btn btn-success m-1">+ New Order</button>
                <Modal show={show2} onHide={() => setShow2(false)}>
                    <Modal.Header closeButton>New Order !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmit2}>
                            <FormGroup>
                                <select className={"form-control form-control-sm " + (isInvalid.idsupplier ? 'is-invalid' : 'inputeStyle')} onChange={e => setIdSupplier(e.target.value)}>
                                    <option value="">---SELECT SUPPLIER---</option>
                                    {optionSelect}
                                </select>
                                <div className="invalid-feedback">{ isInvalid.idsupplier }</div>
                                <Label for="supplier">Our adress</Label>
                                <Input
                                    type="text"
                                    name="adress"
                                    id="adress"
                                    className={(isInvalid.adress ? 'is-invalid' : 'inputeStyle')}
                                    onChange={onChangeAdress}/>
                                    <div className="invalid-feedback">{ isInvalid.adress }</div>
                                <Label for="Price">Price</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    id="price"
                                    className={(isInvalid.price ? 'is-invalid' : 'inputeStyle')}
                                    onChange={onChangePrice}/>
                                    <div className="invalid-feedback">{ isInvalid.price }</div>
                                <Label for="quantity">Quantity</Label>
                                <Input
                                    type="number"
                                    name="quantity"
                                    id="quantity"
                                    className={(isInvalid.quantity ? 'is-invalid' : 'inputeStyle')}
                                    onChange={onChangeQty}/>
                                    <div className="invalid-feedback">{ isInvalid.quantity }</div>
                                <Button color="dark" className="mt-4" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
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
                                    onChange={onChange}/>
                                <Button color="dark" className="mt-4" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="row border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2 align-items-center"> ID </p></th>
                            <th><p className="m-2"> Order </p></th>
                            <th><p colspan="3" className="m-1"> Actions </p></th>
                        </tr>
                    </thead>
                    {/* <tbody>{postDataCategories}</tbody> */}
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    {/* <ReactPaginate
                        previousLabel={"prev"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCountCategories}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClickCategories}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} /> */}
                </div>
            </div>
        </>
    )
}

export default Suppliers;