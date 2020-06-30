import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-date-picker';
import { post } from 'jquery';
import store from '../../../store';

const Promo = () => {
    const [postDataPromos, setPostDataPromos] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [idCodePromo, setIdCodePromo] = useState(0);
    const [code, setCode] = useState('');
    const [percentage, setPercentage] = useState(0);
    const [usedLimit, setUsedLimit] = useState(0);
    const [dateEnd, setDateEnd] = useState(null);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [value, onChange] = useState(new Date());
    const [deleteCodeModal, setDeleteCodeModal] = useState(false);
    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": 'Bearer '+token
        }
    }

    useEffect(() => {
        receivedData();
    }, [offset]);

    useEffect(() => {
        if (postDataPromos === null) setOffset(offset - limit);
    }, [postDataPromos]);

    useEffect(() => {
        if (pageCount < offset) setOffset(0);
    }, [pageCount, offset]);

    useEffect(() => {
        setDateEnd(value !== null ? parseInt((new Date(value).getTime() / 1000).toFixed(0)) : null);
    }, [value]);

    const receivedData = () => {
        axios.get(process.env.REACT_APP_API_LINK + `/api/promocode?offset=${offset}&limit=${limit}`, config).then(async res => {
            await setPageCount(Math.ceil(res.data.nbResults / limit));
            const newPostDataPromos = res.data.data.length > 0 ? res.data.data.map((promo) =>
                <tr key={promo.id}>
                    <td><p className="m-2 align-items-center">{promo.id}</p></td>
                    <td><p className="m-2">{promo.code.toUpperCase()}</p></td>
                    <td><p className="m-2">{promo.percentage}</p></td>
                    <td><p className="m-2">{promo.dateEnd !== null ? promo.dateEnd.substr(8, 10).slice(0, 2) + '/' + promo.dateEnd.substr(5, 10).slice(0, 2) + '/' + promo.dateEnd.substr(0, 10).slice(0, 4) : 'no limit'}</p></td>
                    <td><p className="m-2">{promo.usedTimes}</p></td>
                    <td><p className="m-2">{promo.usedLimit !== null ? promo.usedLimit : 'no limit'}</p></td>
                    <td> <button className="btn btn-outline-info m-1" onClick={() => {
                        setCode(promo.code);
                        setIdCodePromo(promo.id);
                        setPercentage(promo.percentage);
                        setDateEnd(promo.dateEnd);
                        setUsedLimit(promo.usedLimit);
                        setShowUpdate(true);
                    }
                    } > Modify </button></td>
                    <td> <button className="btn btn-outline-danger m-1" onClick={() => { setIdCodePromo(promo.id); onChange(promo.dateEnd); setCode(promo.code); setDeleteCodeModal(true) }}> Delete </button></td>
                </tr>
            ) : null
            setPostDataPromos(newPostDataPromos);
        }).catch(error => {
            console.log(error);
            toast.error('Error !', { position: 'top-center' });
        })
    }

    const deleteCodePromo = () => {
        axios.delete(process.env.REACT_APP_API_LINK + "/api/promocode/" + idCodePromo, config).then(res => {
            toast.success(res.data.message, { position: 'top-center' })
            receivedData();
        }).catch(err => {
            console.log(err);
            // toast.error(err.data.response.message, { position: 'top-center' });
        });
    }

    const onSubmitCodePromo = (e) => {
        e.preventDefault();

        if (code.length === 0) {
            return toast.error("You need to enter a code promo", { position: "top-center" });
        }
        if (code.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        }
        if (percentage < 1 || percentage > 100) {
            return toast.error("percentage need to must be more than 0 and under 100", { position: 'top-center' });
        } else {
            const body = {
                "code": code.toUpperCase(),
                "percentage": parseInt(percentage),
                "dateEnd": dateEnd,
                "usedLimit": usedLimit === 0 ? null : usedLimit
            }
            // Mettre la requete
            axios.post(process.env.REACT_APP_API_LINK + "/api/promocode/create", body, config).then(res => {
                console.log(body)
                console.log("dedede")
                toast.success('Code promo correctly added!', { position: "top-center" });
                receivedData();
            }).catch(err => {
                console.log(err);
                // toast.error(err.data.response.message, { position: 'top-center' });
            });
            setShowAdd(false);
        }
    }

    const onChangeCode = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let code = str.charAt(0).toUpperCase() + str.slice(1);
        setCode(code.replace(/[\s]{2,}/g, " "));
    }

    const onSubmitUpdateCodePromo = (e) => {
        e.preventDefault();

        if (code.length === 0) {
            return toast.error("You need to enter a code promo", { position: "top-center" });
        }
        if (code.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        }
        if (percentage < 1 || percentage > 100) {
            return toast.error("percentage need to must be more than 0 and under 100", { position: 'top-center' });
        } else {
            const body = {
                "code": code.toUpperCase(),
                "percentage": parseInt(percentage),
                "dateEnd": parseInt((new Date(dateEnd).getTime() / 1000).toFixed(0)),
                "usedLimit": usedLimit === 0 ? null : usedLimit
            }
            console.log(body);
            // Mettre la requete
            axios.put(process.env.REACT_APP_API_LINK + "/api/promocode/" + idCodePromo, body, config).then(res => {
                toast.success('Code promo correctly added!', { position: "top-center" });
                receivedData();
            }).catch(err => {
                console.log(err)
                toast.error('erreur', { position: 'top-center' });
            });
            setShowAdd(false);
        }
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

    return (
        <>
            <div className="row justify-content-end mb-2">
                <button onClick={() => setShowAdd(true)} className="btn btn-success m-1">+ New Code Promo</button>
                <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                    <Modal.Header closeButton>Create Code Promo !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmitCodePromo}>
                            <FormGroup>
                                <Label for="code">Code</Label>
                                <Input
                                    type="text"
                                    name="code"
                                    id="code"
                                    onChange={onChangeCode} />
                                <Label for="percentage">Percentage</Label>
                                <Input
                                    type="number"
                                    name="percentage"
                                    id="percentage"
                                    onChange={(e) => setPercentage(parseInt(e.target.value))} />
                                <br />
                                <Label for="dateEnd">Limit by time (don't change if you don't want time limit)</Label>
                                <DatePicker
                                    onChange={onChange}
                                    value={value} />
                                <br />
                                <br />
                                <Label for="usedLimit">Limit by count (0 = unlimited)</Label>
                                <Input
                                    type="number"
                                    name="usedLimit"
                                    id="usedLimit"
                                    value={usedLimit}
                                    onChange={(e) => setUsedLimit(parseInt(e.target.value))} />
                                <Button color="dark" className="mt-4" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={showUpdate} onHide={() => setShowUpdate(false)}>
                    <Modal.Header closeButton>Update Code Promo !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmitUpdateCodePromo}>
                            <FormGroup>
                                <Label for="code">Code</Label>
                                <Input
                                    type="text"
                                    name="code"
                                    id="code"
                                    value={code}
                                    onChange={onChangeCode} />
                                <Label for="percentage">Percentage</Label>
                                <Input
                                    type="number"
                                    name="percentage"
                                    id="percentage"
                                    value={percentage}
                                    onChange={(e) => setPercentage(parseInt(e.target.value))} />
                                <br />
                                <Label for="dateEnd">Limit by time (don't change if you don't want time limit)</Label>
                                <DatePicker
                                    onChange={setDateEnd}
                                    value={new Date(dateEnd)} />
                                <br />
                                <br />
                                <Label for="usedLimit">Limit by count (0 = unlimited)</Label>
                                <Input
                                    type="number"
                                    name="usedLimit"
                                    id="usedLimit"
                                    value={usedLimit === null ? 0 : usedLimit}
                                    onChange={(e) => setUsedLimit(parseInt(e.target.value))} />
                                <Button color="dark" className="mt-4" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={deleteCodeModal} onHide={() => setDeleteCodeModal(false)}>
                    <Modal.Header closeButton>Careful ! Are you sure to want delete the code promo "{code.toUpperCase()}"</Modal.Header>
                    <Modal.Body>
                        <Button color="warning" className="mt-4" onClick={() => setDeleteCodeModal(false)} block>No, go back</Button>
                        <Button color="danger" className="mt-4" onClick={() => { deleteCodePromo(); setDeleteCodeModal(false) }} block>Yes, delete {code.toUpperCase()}</Button>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="row border  bg-light  p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2 align-items-center"> ID </p></th>
                            <th><p className="m-2"> Name </p></th>
                            <th><p className="m-2"> Percentage </p></th>
                            <th><p className="m-2"> Date end (dd/mm/yy) </p></th>
                            <th><p className="m-2"> Used time </p></th>
                            <th><p className="m-2"> Used limit </p></th>
                            <th><p colSpan="3" className="m-1"> Actions </p></th>
                        </tr>
                    </thead>
                    <tbody>{postDataPromos}</tbody>
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

export default Promo;