import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import ReactPaginate from 'react-paginate';
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
    const [categoryId, setCategoryId] = useState(null);
    const [deleteSubCategoryModal, setDeleteSubCategoryModal] = useState(false);
    const [subCategoryId, setSubCategoryId] = useState(0);
    const [allMigrationSubCategory, setAllMigrationSubCategory] = useState([]);
    const [subCategoryMigrateSelected, setSubCategoryMigrateSelected] = useState(0);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();

    let id = useRouteMatch("/admin/subcategory/:id").params.id;

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
        receivedSubCategories();
    }, [offset]);

    useEffect(() => {
        setOffset(0);
    }, [pageCount]);

    const receivedSubCategories = () => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/category/" + id, config)
            .then(async res => {
                setNameCategory(res.data.name)
                if (res.data.subCategories) {
                    await setPageCount(Math.ceil(res.data.subCategories.length / limit))
                    let arrSubCategories = [];
                    let nbr;
                    for (let i = 0; i !== limit; i++) {
                        if (res.data.subCategories[offset + i]) arrSubCategories.push(res.data.subCategories[offset + i]);
                        console.log(arrSubCategories);
                    }
                    setSubCategories(arrSubCategories);
                    // setSubCategories(res.data.subCategories);
                } else {
                    setPageCount(0)
                }
            })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            });
    }
    const deleteSubCategory = (idSub) => {
        axios.delete(process.env.REACT_APP_API_LINK + "/api/subcategory/" + idSub, config)
            .then(res => {
                receivedSubCategories();
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

    const handlePageClick = (e) => {

        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

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
            axios.put(process.env.REACT_APP_API_LINK + "/api/subcategory/" + subCatId, body, config).then(e => {
                toast.success('Category correctly updated!', { position: "top-center" });
                setShow(false);
                setName([]);
                axios.get(process.env.REACT_APP_API_LINK + "/api/category/" + id, config)
                    .then(res => {
                        setSubCategories(res.data.subCategories);
                    })
                    .catch(error => {
                        toast.error('Error !', { position: 'top-center' });
                    });
            }).catch(err => {
                toast.error('Error !', { position: 'top-center' });
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
            axios.post(process.env.REACT_APP_API_LINK + "/api/subcategory/create/" + nameCategory + "/" + newName, body, config).then(e => {
                toast.success('Category correctly updated!', { position: "top-center" });
                setShowNew(false);
                setNewName([]);
                axios.get(process.env.REACT_APP_API_LINK + "/api/category/" + id, config)
                    .then(res => {
                        setSubCategories(res.data.subCategories);
                    })
                    .catch(error => {
                        toast.error('Error !', { position: 'top-center' });
                    });
            }).catch(err => {
                toast.error('Error !', { position: 'top-center' });
            });
        }
    }


    const handleSelectMigration = (event) => {
        setSubCategoryMigrateSelected(event.target.value);
    }
    const migrationSubCategory = async (idSubCategory) => {
        const optionSubCategoryMigration = [];
        console.log(idSubCategory);
        await axios.get(process.env.REACT_APP_API_LINK + "/api/subcategory/", config).then(e => {
            let migration = subCategoryMigrateSelected
            console.log(e)
            e.data.map((subcategory) => subcategory.id !== idSubCategory ? optionSubCategoryMigration.push(<option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>) && migration === 0 ? migration = subcategory.id : null : null)
            setSubCategoryMigrateSelected(migration)
        }).catch(err => {
            toast.error('Error to get category!', { position: 'top-center' });
        });

        setAllMigrationSubCategory(optionSubCategoryMigration);
    }
    const migrateSubCategory = (idTakeMigration, idToMigrate) => {
        let body = {
            "newsubcategory": parseInt(idTakeMigration),
            "oldsubcategory": idToMigrate
        };
        console.log(body);
        axios.put(process.env.REACT_APP_API_LINK + "/api/subcategory/migrate", body, config).then(res => {
            toast.success(res.message, { position: 'top-center' });
            deleteSubCategory(idToMigrate);
        }).catch(err => {
            console.log(err.message)
            toast.error(err.message, { position: 'top-center' });
        });
    }
    return (
        <div className="container">
            <ToastContainer />
            <h1 className="mb-5">
                <img src="https://img.icons8.com/windows/32/000000/speedometer.png" /> ADMIN - Dashboard
            </h1>
            <div className="row justify-content-end mb-2">
                <h3 className="mr-auto ml-2">All SubCategories of <b>{nameCategory}</b></h3>
                <button onClick={() => window.location.href = '/admin?tab=2'} className='float-right btn m-2 btn-warning'> Back to Dashboard </button>
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
                                <Button color="dark" className="mt-4" block>Create</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="row bg-light  border p-2">
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
                                <td><p className="m-2 align-items-center">{category.id}</p></td>
                                <td><p className="m-2">{category.name} </p></td>
                                {/* <td> <button onClick={() => window.location.href = '/admin/subcategory/' + id + '/' + category.id + '/update'} className="btn btn-outline-info m-2">Modify</button></td> */}
                                <td> <button onClick={e => e.preventDefault() + handleShow(id, category.id, category.name)} className="btn btn-outline-info m-2">Modify</button></td>
                                <td> <button onClick={() => { migrationSubCategory(category.id); setDeleteSubCategoryModal(true); setSubCategoryId(category.id) }} className="btn btn-outline-danger m-2">Delete</button></td>
                                {/* <td> <button onClick={() => deleteSubCategory(category.id)} className="btn btn-outline-danger m-2">Delete</button></td> */}
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
                <Modal show={deleteSubCategoryModal} size="lg" onHide={() => setDeleteSubCategoryModal(false)}>
                    <Modal.Header closeButton>Careful ! Deleting a SubCategory will delete all Products !</Modal.Header>
                    <Modal.Body>
                        <h4>I want to keep my Products and migrate them to</h4>
                        <select className="form-control form-control-lg" onChange={handleSelectMigration}>
                            {allMigrationSubCategory}
                        </select>
                        <Button color="info" className="mt-4" onClick={() => migrateSubCategory(subCategoryMigrateSelected, subCategoryId)} block>Yes, migrate my Product on this SubCategory !</Button>
                        <Button color="danger" className="mt-4" onClick={() => { deleteSubCategory(subCategoryId); setDeleteSubCategoryModal(false) }} block>No, delete everything</Button>
                    </Modal.Body>
                </Modal>
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
        </div>

    )
}

export default SubCategoryInterface;