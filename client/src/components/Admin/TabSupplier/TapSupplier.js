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
    const [allSupplier, setAllSupplier] = useState([]);
    const [postDataOrder, setPostDataOrder] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const optionSelect = [];
    const [divOrder, setDivOrder] = useState([]);

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/supplier", config).then(e => {
            setAllSupplier(e.data.data);
        });
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/supplier/order", config).then(e => {
            console.log(e.data.data)
            const newPostDataOrder = e.data.data.map((order) =>
                <tr key={order.id}>
                    <td><p className="myMargin align-items-center">{order.id}</p></td>
                    <td><p className="myMargin">{order.our_address}</p></td>
                    <td><p className="myMargin">{order.price}</p></td>
                    <td><button onClick={e => e.preventDefault() + showDetailsOrder(order.id)} className="btn btn-outline-dark m-1">View</button></td>
                    {order.status == false ?
                        <td><button className="btn btn-outline-success m-1">Mark as arrived</button></td> :
                        <td><button className="btn btn-outline-success m-1 disabled" disabled>Arrived ✅</button></td>
                    }
                </tr>
            )
            setPostDataOrder(newPostDataOrder);
        });
    }, []);

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
                "name" : supplierName
            };
            axios.post("http://127.0.0.1:8000/api/supplier", body, config).then( e => {
                toast.success("Supplier correctly added !", { position: "top-center" });
                setShow(false);
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }

    function showDetailsOrder(id) {
        axios.get("http://127.0.0.1:8000/api/supplier/order/" + id, config).then(res => {
            setDivOrder(res.data.supplierOrderSubproducts)
            setShowDetails(true);
        }).catch(error => {
            console.log(error);
        });
    }
    
    return (
        <>
            <ToastContainer />
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
                                    onChange={onChange}/>
                                <Button color="dark" className="mt-4" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={showDetails} onHide={() => setShowDetails(false)}>
                    <Modal.Header closeButton>New Supplier !</Modal.Header>
                    <Modal.Body>
                        {divOrder.length > 0 &&
                        divOrder.map( subProduct => 
                            <div className="divOrderCart" key={subProduct.subproduct.id}>
                                <table className="productinCart">
                                    <tbody>
                                        <tr>
                                            <td rowSpan="3" className="tableborder">
                                                <img src="http://127.0.0.1:8000/api/image/2/default/1.jpg"/>
                                            </td>
                                            <td>
                                                <span><b>Title:</b> { subProduct.subproduct.product.title}</span>
                                            </td>
                                        </tr>
                                        <tr className="tableborder">
                                            <td className="detailsproduct">
                                                <span><b>ID:</b> {subProduct.subproduct.id}</span>
                                                <span><b>Color:</b> {subProduct.subproduct.color.name}</span>
                                                <span><b>Size:</b> {subProduct.subproduct.size}</span>
                                                <span><b>Quantity:</b> {subProduct.quantity}</span>
                                                <span><b>Price:</b> {subProduct.subproduct.price}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    <Button color="dark" className="mt-4" block onClick={() => setShowDetails(false)}>Close</Button>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="row border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="myMargin align-items-center"> ID </p></th>
                            <th><p className="myMargin"> Order </p></th>
                            <th><p className="myMargin"> Price </p></th>
                            <th><p className="myMargin" colspan="3" className="m-1"> Actions </p></th>
                        </tr>
                    </thead>
                    <tbody>{postDataOrder}</tbody>
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