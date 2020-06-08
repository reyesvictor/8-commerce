import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import store from '../../../store';
import {
    Button, Form, FormGroup, Label, Input, Alert
} from 'reactstrap'
import Modal from 'react-bootstrap/Modal';

const SubCategoryInterface = () => {
    const [subCategories, setSubCategories] = useState([]);
    const [nameCategory, setNameCategory] = useState('');
    const [show, setShow] = useState(false);
    const [name, setName] = useState([]);
    const [subCatId, setSubCatId] = useState(null);
    const [oldSubCatName, setOldSubCateName] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [newName, setNewName] = useState([]);
    const [categoriId, setCategoryId] = useState(null);
    let id = useRouteMatch("/admin/subcategory/:id").params.id;

    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    useEffect(() => {
        if (token) {
            config.headers['x-auth-token'] = token
        }
    }, [token]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/category/" + id, config)
            .then(res => {
                console.log(res.data)
                setNameCategory(res.data.name)
                setSubCategories(res.data.subCategories);
            })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            });
    }, [])

    const deleteCategory = (idSub) => {
        console.log(idSub);
        axios.delete("http://localhost:8000/api/subcategory/" + idSub, config)
            .then(res => {
                axios.get("http://localhost:8000/api/category/" + id, config)
                    .then(res => {
                        setSubCategories(res.data.subCategories);
                    })
                    .catch(error => {
                        toast.error('Error !', { position: 'top-center' });
                    });
                toast.success(res.data.message, { position: "top-center" });
            })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            });
    }

    // const redirectCreate = () => {
    //     //window.location.href='/admin/subproduct/'+id+'/create';
    // }

    const handleShow = (id, subId, SubName) => {
        setShow(true);
        setSubCatId(subId);
        setOldSubCateName(SubName);
    }
    const onChange = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let category = str.charAt(0).toUpperCase() + str.slice(1);
        setName(category.replace(/[\s]{2,}/g, " "))
    }
    function onSubmit(e) {
        e.preventDefault();
        if (name.length === 0) {
            return toast.error("You need to enter a new category", { position: "top-center" });
        }
        if (name.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        } else {
            const body = {
                "name": name,
            }
            axios.put("http://localhost:8000/api/subcategory/" + subCatId, body, config ).then( e => {
                toast.success('Category correctly updated!', { position: "top-center"});
                setShow(false);
                setName([]);
                axios.get("http://localhost:8000/api/category/" + id, config)
                    .then(res => {
                        setSubCategories(res.data.subCategories);
                    })
                    .catch(error => {
                        toast.error('Error !', { position: 'top-center' });
                    });
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }

    const handleShowNew = (id) => {
        setShowNew(true);
        setCategoryId(id);
    }
    const onChangeNew = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let category = str.charAt(0).toUpperCase() + str.slice(1);
        setNewName(category.replace(/[\s]{2,}/g, " "))
    }
    function onSubmitNew(e) {
        e.preventDefault();
        if (newName.length === 0) {
            return toast.error("You need to enter a new category", { position: "top-center" });
        }
        if (newName.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        } else {
            const body = {
                "name": newName,
            }
            axios.post("http://localhost:8000/api/subcategory/create/" + nameCategory + "/" + newName, body, config ).then( e => {
                toast.success('Category correctly updated!', { position: "top-center"});
                setShowNew(false);
                setNewName([]);
                axios.get("http://localhost:8000/api/category/" + id, config)
                    .then(res => {
                        setSubCategories(res.data.subCategories);
                    })
                    .catch(error => {
                        toast.error('Error !', { position: 'top-center' });
                    });
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }

    return (
        <div className="container">
            <ToastContainer />
            <h1 className="mb-5">
                <img src="https://img.icons8.com/windows/32/000000/speedometer.png" /> ADMIN - Dashboard
            </h1>
            <div className="row justify-content-end mb-2">
                <h3 className="mr-auto ml-2">All SubCategories of <b>{nameCategory}</b></h3>
                <button onClick={() => window.location.href = '/admin'} className='float-right btn m-2 btn-warning'> Back to Dashboard </button>
            </div>
            <div className="row justify-content-end mb-2">
                {/* <button onClick={() => window.open('/admin/create/subcategory')} className="btn btn-success m-2">
                    + New SubCategory for <b>{nameCategory}</b>
                </button> */}
                <button onClick={e => e.preventDefault() + handleShowNew(id)} className="btn btn-success m-2">
                    + New SubCategory for <b>{nameCategory}</b>
                </button>
                <Modal show={showNew} onHide={() => setShowNew(false)}>
                    <Modal.Header closeButton>Create SubCategory !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmitNew}>
                            <FormGroup>
                                <Label for="cateEdit">Name</Label>
                                <Input
                                    type="text"
                                    name="cateEdit"
                                    id="cateEdit"
                                    placeholder={oldSubCatName}
                                    onChange={onChangeNew}
                                />
                                <Button color="dark" className="mt-4" block>Update</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <button onClick={() => window.location.href = '/admin/update/category/' + id} className='btn btn-outline-info m-2'> Modify {nameCategory} </button>
            </div>
            <div className="row border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2 align-items-center"> ID </p></th>
                            <th><p className="m-2"> Name </p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {subCategories.length > 0 ? subCategories.map((category) =>
                            <tr key={category.id}>
                                {console.log(category)}
                                <td><p className="m-2 align-items-center">{category.id}</p></td>
                                <td><p className="m-2">{category.name} </p></td>
                                {/* <td> <button onClick={() => window.location.href = '/admin/subcategory/' + id + '/' + category.id + '/update'} className="btn btn-outline-info m-2">Modify</button></td> */}
                                <td> <button onClick={e => e.preventDefault() + handleShow(id, category.id, category.name)} className="btn btn-outline-info m-2">Modify</button></td>
                                <td> <button onClick={() => deleteCategory(category.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>Update SubCategory !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmit}>
                            <FormGroup>
                                <Label for="cateEdit">SubCategory name</Label>
                                <Input
                                    type="text"
                                    name="cateEdit"
                                    id="cateEdit"
                                    placeholder={oldSubCatName}
                                    onChange={onChange}
                                />
                                <Button color="dark" className="mt-4" block>Update</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>

    )
}

export default SubCategoryInterface;