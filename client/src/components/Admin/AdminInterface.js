import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import axios from 'axios';
import './AdminInterface.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import store from '../../store';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Reviews from './TabReviews/TabReviews';
import SupplierCommand from './TabSupplier/TapSupplier';
import Shipping from './TabShipping/TabShipping';
import Region from './TabRegion/TabRegion';
import Promo from './TabPromo/TabPromo';
import Color from './Color/Color';
import Dashboard from './Dashboard/Dashboard';
import queryString from 'query-string';

import Packaging from './TabPackaging/TabPackaging';

const AdminInterface = () => {
    const [products, setProducts] = useState([]);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [postData, setPostData] = useState();
    const [categories, setCategories] = useState([]);
    const [limitCategories, setLimitCategories] = useState(5);
    const [offsetCategories, setOffsetCategories] = useState(0);
    const [pageCountCategories, setPageCountCategories] = useState();
    const [postDataCategories, setPostDataCategories] = useState();
    const [showImage, setShowImage] = useState(false);
    const [picture, setPicture] = useState([]);
    const [imageId, setImageId] = useState(null);
    const [showCate, setShowCate] = useState(false);
    const [categoryName, setCategoryName] = useState([]);
    const [showSubCate, setShowSubCate] = useState(false);
    const [subCategoryName, setSubCategoryName] = useState([]);
    const [categorySelected, setCategorySelected] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [showCateEdit, setShowCateEdit] = useState(false);
    const [categoryNameEdit, setCategoryNameEdit] = useState([]);
    const [cateEditId, setCateEditId] = useState(null);
    const [oldCateEditName, setOldCateEditName] = useState('');
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const [categoryId, setCategoryId] = useState(0);
    const [allMigrationCategory, setAllMigrationCategory] = useState([]);
    const [categoryMigrateSelected, setCategoryMigrateSelected] = useState(0);
    const [deleteProductModal, setDeleteProductModal] = useState(false);
    const [productId, setProductId] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);
    const optionCategory = [];
    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": 'Bearer ' + token
        }
    }

    // useEffect(() => {
    //     if (token) {
    //         config.headers['Authorization'] = 'Bearer '+token;
    //     }
    // }, [token]);

    useEffect(() => {
        const nbTab = queryString.parse(document.location.search).tab
        // console.log(nbTab)
        if (nbTab !== undefined) {
            setTabIndex(parseInt(nbTab))
        }
    }, [])
    useEffect(() => {
        receivedData()
    }, [offset, products])

    useEffect(() => {
        // console.log(postDataCategories)
        if (postDataCategories && postDataCategories.length === 0) setOffsetCategories(offsetCategories - limitCategories);
    }, [postDataCategories]);

    useEffect(() => {
        if (postData && postData.length === 0) setOffset(offset - limit);
    }, [postData]);

    useEffect(() => {
        receivedDataCategories()
    }, [offsetCategories, categories])

    const handleClose = () => setDeleteCategoryModal(false);

    const receivedData = () => {
        axios.get(process.env.REACT_APP_API_LINK + `/api/product?offset=${offset}&limit=${limit}`, config).then(async res => {
            await setPageCount(Math.ceil(res.data.nbResults / limit))
            const newPostData = res.data.data.map((product) =>
                <tr key={product.id}>
                    <td><p className="m-2 align-items-center">{product.id}</p></td>
                    <td><p className="m-2">{product.title.length > 15 ? product.title.substr(0, 15) + '...' : product.title}</p></td>
                    <td><p className="m-2">{product.subCategory.name.length > 15 ? product.subCategory.name.substr(0, 15) + "..." : product.subCategory.name}</p></td>
                    <td><p className="m-2">{product.status ? 'Active' : 'Inactive'}</p></td>
                    <td><p className="m-2">{product.sex}</p></td>
                    <td>
                        <button onClick={e => e.preventDefault() + handleShowImage(product.id)} className="btn add btn-outline-success m-1">Add Image</button>
                        <button onClick={() => window.location.href = 'admin/update/product/' + product.id} className="btn modify btn-outline-info m-1">Modify</button>
                        <button onClick={() => window.location.href = 'admin/subproduct/' + product.id} className="btn btn-outline-dark m-1"><span className="viewsub">SubProducts</span></button>
                        <button onClick={() => { setDeleteProductModal(true); setProductId(product.id); }} className="btn delete btn-outline-danger m-1">Delete</button>
                    </td>
                </tr>
            )
            setPostData(newPostData)
        })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            })
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

    const deleteProduct = (id) => {
        axios.delete(process.env.REACT_APP_API_LINK + "/api/product/" + id, config).then(res => {
            receivedData()
            toast.success(res.data.message, { position: "top-center" });
        })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            });
    }

    const receivedDataCategories = () => {
        axios.get(process.env.REACT_APP_API_LINK + `/api/category?offset=${offsetCategories}&limit=${limitCategories}`, config).then(async res => {
            await setPageCountCategories(Math.ceil(res.data.nbResults / limitCategories))
            const newPostDataCategories = res.data.data.map((category) =>
                <tr key={category.id}>
                    <td><p className="m-2 align-items-center">{category.id}</p></td>
                    <td><p className="m-2">{category.name}</p></td>
                    <td> <button onClick={e => e.preventDefault() + handleShowCateEdit(category.id, category.name)} className="btn btn-outline-info m-1"> Modify </button></td>
                    <td> <button onClick={() => window.location.href = '/admin/subcategory/' + category.id} className="btn btn-outline-dark m-1"> SubCategories</button></td>
                    <td> <button onClick={async () => { await migrationCategory(category.id); setDeleteCategoryModal(true); setCategoryId(category.id); }} className="btn btn-outline-danger m-1"> Delete </button></td>
                </tr>
            )
            setPostDataCategories(newPostDataCategories)
        })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            })
    }

    const handlePageClickCategories = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limitCategories;
        setOffsetCategories(newOffset);
    };

    const deleteCategory = (id) => {
        axios.delete(process.env.REACT_APP_API_LINK + "/api/category/" + id, config).then(res => {
            receivedDataCategories();
            toast.success(res.data.message, { position: "top-center" });
        })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            });
    }

    const redirectCreate = (data) => {
        switch (data) {
            case 'product':
                window.location.href = '/admin/create/product';
                break;
        }
    }

    const handleImage = () => setShowImage(false);
    const handleShowImage = (id) => {
        setShowImage(true);
        setImageId(id);
    }
    const onChangeImage = (event) => {
        let files = event.target.files;
        setPicture(files);
    }
    function onSubmitImage(e) {
        e.preventDefault();
        if (picture.length === 0) {
            return toast.error("You need to pick a photo", { position: "top-center" });
        }
        let fileExtension = picture[0].name.split('.').pop();
        let exts = ['jpg', 'jpeg', 'png'];
        if (!exts.includes(fileExtension)) {
            return toast.error("Your picture need to have the \'jpg\', \'jpeg\',\'png\' extension", { position: "top-center" });
        }
        const bodyFormData = new FormData();
        bodyFormData.append('image', picture[0]);
        bodyFormData.append('color', 'default');
        axios.post(process.env.REACT_APP_API_LINK + '/api/image/' + imageId, bodyFormData, config).then(response => {
            setPicture([]);
            setShowImage(false);
            toast.success("Image correctly added !", { position: "top-center" });
        }).catch((error) => {
            toast.error("Error !", { position: "top-center" });
        })
    }

    const handleCloseCateEdit = () => setShowCateEdit(false);
    const handleShowCateEdit = (id, name) => {
        setShowCateEdit(true);
        setCateEditId(id);
        setOldCateEditName(name);
    }
    const onChangeCateEdit = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let category = str.charAt(0).toUpperCase() + str.slice(1);
        setCategoryNameEdit(category.replace(/[\s]{2,}/g, " "))
    }
    function onSubmitCateEdit(e) {
        e.preventDefault();
        if (categoryNameEdit.length === 0) {
            return toast.error("You need to enter a new category", { position: "top-center" });
        }
        if (categoryNameEdit.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        } else {
            const body = {
                "name": categoryNameEdit,
            }
            axios.put(process.env.REACT_APP_API_LINK + "/api/category/" + cateEditId, body, config).then(e => {
                toast.success('Category correctly updated!', { position: "top-center" });
                setShowCateEdit(false);
            }).catch(err => {
                toast.error('Error !', { position: 'top-center' });
            });
        }
    }

    const AllProducts = () => {
        return (
            <>
                <div className="row justify-content-end mb-2">
                    <button onClick={() => redirectCreate('product')} className="btn btn-success">+ New Product</button>
                </div>
                <div className="row border bg-light p-2">
                    <table>
                        <thead>
                            <tr>
                                <th><p className="m-2 align-items-center"> ID </p></th>
                                <th><p className="m-2"> Title </p></th>
                                <th><p className="m-2"> SubCategory </p></th>
                                <th><p className="m-2"> Status </p></th>
                                <th><p className="m-2"> Sex </p></th>
                                {/* <th><p className="m-2"> Image </p></th> */}
                                <th colSpan="4"><p className="m-2"> Actions </p></th>
                            </tr>
                        </thead>
                        <tbody>{postData}</tbody>
                    </table>
                </div>
                <Modal show={showCateEdit} onHide={handleCloseCateEdit}>
                    <Modal.Header closeButton>Update Category !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmitCateEdit}>
                            <FormGroup>
                                <Label for="cateEdit">Category name</Label>
                                <Input
                                    type="text"
                                    name="cateEdit"
                                    id="cateEdit"
                                    placeholder={oldCateEditName}
                                    onChange={onChangeCateEdit} />
                                <Button color="dark" className="mt-4" block>Update</Button>
                            </FormGroup>
                        </Form>
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
                        {/* --------------------- MODAL FOR IMAGE ------------------------------------ */}
                        <Modal show={showImage} onHide={handleImage}>
                            <Modal.Header closeButton>Download Image !</Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={onSubmitImage}>
                                    <FormGroup>
                                        <Label for="image">Image</Label>
                                        <Input
                                            multiple="multiple"
                                            type="file"
                                            name="image"
                                            id="image"
                                            onChange={onChangeImage} />
                                        <Button color="dark" className="mt-4" block>Submit</Button>
                                    </FormGroup>
                                </Form>
                            </Modal.Body>
                        </Modal>
                        <Modal show={deleteProductModal} onHide={() => setDeleteProductModal(false)}>
                            <Modal.Header closeButton>Careful ! Deleting the Product will delete all of his SubProducts !</Modal.Header>
                            <Modal.Body>
                                <Button color="warning" className="mt-4" onClick={() => setDeleteProductModal(false)} block>No, go back</Button>
                                <Button color="danger" className="mt-4" onClick={() => { deleteProduct(productId); setDeleteProductModal(false) }} block>Yes, delete everything</Button>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </>
        )
    }

    const onChangeCate = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let category = str.charAt(0).toUpperCase() + str.slice(1);
        setCategoryName(category.replace(/[\s]{2,}/g, " "));
    }

    function onSubmitCate(e) {
        e.preventDefault();

        if (categoryName.length === 0) {
            return toast.error("You need to enter a category", { position: "top-center" });
        }
        if (categoryName.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        } else {
            const body = {
                "name": categoryName
            }
            axios.post(process.env.REACT_APP_API_LINK + "/api/category/create/" + categoryName, body, config).then(res => {
                toast.success('Category correctly added!', { position: "top-center" });
                receivedDataCategories();
            }).catch(err => {
                toast.error('Category already exist!', { position: 'top-center' });
            });
            setShowCate(false);
        }
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/category", config).then(e => {
            setAllCategory(e.data.data);
        });
    }, [postDataCategories]);

    allCategory.map(category => {
        optionCategory.push(<option key={category.id} value={category.name}>{category.name}</option>)
    });

    const onChangeSubCate = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let category = str.charAt(0).toUpperCase() + str.slice(1);
        setSubCategoryName(category.replace(/[\s]{2,}/g, " "));
    }

    function onSubmitSubCate(e) {
        e.preventDefault();
        let invalids = {};

        if (!categorySelected) {
            invalids.category = "Select category";
        }
        if (subCategoryName && subCategoryName.length > 0) {
            if (subCategoryName.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
                invalids.subCategory = "Charactere invalid";
            }
        } else {
            invalids.subCategory = "Please enter a subCategory";
        }

        if (Object.keys(invalids).length === 0) {
            setIsInvalid(invalids);
            setIsReady(true);
        } else {
            setIsInvalid(invalids);
        }
    }

    useEffect(() => {
        if (isReady) {
            setIsReady(false);
            const body = [];
            axios.post(process.env.REACT_APP_API_LINK + "/api/subcategory/create/" + categorySelected + "/" + subCategoryName, body, config).then(res => {
                toast.success('SubCategory correctly added!', { position: 'top-center' });
                setShowSubCate(false)
            }).catch(err => {
                toast.error('SubCategory already exist!', { position: 'top-center' });
            });
        }
    }, [isReady]);

    function handleSelect(event) {
        setCategorySelected(event.target.value);
    }
    const handleSelectMigration = (event) => {
        setCategoryMigrateSelected(event.target.value);
    }
    const migrationCategory = async (idCategory) => {
        const optionCategoryMigration = [];

        await axios.get(process.env.REACT_APP_API_LINK + "/api/category", config).then(e => {
            let migration = categoryMigrateSelected
            e.data.data.map((category) => category.id !== idCategory ? optionCategoryMigration.push(<option key={category.id} value={category.id}>{category.name}</option>) && migration === 0 ? migration = category.id : null : null)
            setCategoryMigrateSelected(migration)
        }).catch(err => {
            toast.error('Error to get category!', { position: 'top-center' });
        });
        setAllMigrationCategory(optionCategoryMigration);
    }
    const migrateCategory = (idTakeMigration, idToMigrate) => {
        let body = {
            "newcategory": parseInt(idTakeMigration),
            "oldcategory": idToMigrate
        };
        console.log(body);
        axios.put(process.env.REACT_APP_API_LINK + "/api/category/migrate", body, config).then(res => {
            toast.success(res.message, { position: 'top-center' });
            deleteCategory(idToMigrate);
        }).catch(err => {
            console.log(JSON.stringify(err))
            console.log(err.response.data)
            toast.error(err.response.data.message, { position: 'top-center' });
        });
    }

    const AllCategories = () => {
        return (
            <>
                <div className="row justify-content-end mb-2">
                    <button onClick={() => setShowCate(true)} className="btn btn-success m-1">+ New Category</button>
                    <Modal show={showCate} onHide={() => setShowCate(false)}>
                        <Modal.Header closeButton>Create category !</Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={onSubmitCate}>
                                <FormGroup>
                                    <Label for="category">Category name</Label>
                                    <Input
                                        type="text"
                                        name="category"
                                        id="category"
                                        onChange={onChangeCate} />
                                    <Button color="dark" className="mt-4" block>Submit</Button>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    <button onClick={() => setShowSubCate(true)} className="btn btn-success m-1"> + New SubCategory</button>
                    <Modal show={showSubCate} onHide={() => setShowSubCate(false)}>
                        <Modal.Header closeButton>Create SubCategory !</Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={onSubmitSubCate}>
                                <FormGroup>
                                    <select className={"form-control form-control-lg " + (isInvalid.category ? 'is-invalid' : 'inputeStyle')} id="selectCategory" onChange={handleSelect}>
                                        <option value="">--- CHOICE CATEGORY ---</option>
                                        {optionCategory}
                                    </select>
                                    <div className="invalid-feedback">{isInvalid.category}</div>
                                    <Label for="category">SubCategory name</Label>
                                    <Input
                                        type="text"
                                        name="category"
                                        id="category"
                                        className={(isInvalid.subCategory ? 'is-invalid' : 'inputeStyle')}
                                        onChange={onChangeSubCate} />
                                    <div className="invalid-feedback">{isInvalid.subCategory}</div>
                                    <Button color="dark" className="mt-4" block>Submit</Button>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
                <div className="row border  bg-light  p-2">
                    <table>
                        <thead>
                            <tr>
                                <th><p className="m-2 align-items-center"> ID </p></th>
                                <th><p className="m-2"> Name </p></th>
                                <th><p colSpan="3" className="m-1"> Actions </p></th>
                            </tr>
                        </thead>
                        <tbody>{postDataCategories}</tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <Modal show={deleteCategoryModal} size="lg" onHide={handleClose}>
                            <Modal.Header closeButton>Careful ! Deleting a category will delete all SubCategories and all Products !</Modal.Header>
                            <Modal.Body>
                                <h4>I want to keep my SubCategories and migrate them to</h4>
                                <select className="form-control form-control-lg" onChange={handleSelectMigration}>
                                    {allMigrationCategory}
                                </select>
                                <Button color="info" className="mt-4" onClick={() => migrateCategory(categoryMigrateSelected, categoryId)} block>Yes, migrate on this Category !</Button>
                                <Button color="danger" className="mt-4" onClick={() => { deleteCategory(categoryId); setDeleteCategoryModal(false) }} block>No, delete everything</Button>
                            </Modal.Body>
                        </Modal>
                        {pageCountCategories > 0 &&
                            <ReactPaginate
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
                                activeClassName={"active"} />}
                    </div>
                </div>
            </>
        )
    }

    function getPDF() {
        const headers = {
            responseType: 'blob'
        }
        document.getElementsByClassName("database")[0].innerHTML = "Generating the database...";
        document.getElementsByClassName("getpdf")[0].style.display = "none";
        axios.get(process.env.REACT_APP_API_LINK + "/api/excel", headers).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'database.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.getElementsByClassName("database")[0].innerHTML = "Get the database";
            document.getElementsByClassName("getpdf")[0].style.display = "inline";
        })
    }

    return (
        <div className="container-fluid adminTable p-0 m-0">
            <ToastContainer />
            <Tabs className="row p-0 m-0" forceRenderTabPanel={true} selectedIndex={tabIndex} onSelect={tabIndex => setTabIndex(tabIndex)}>
                <TabList className="tabsHolder   col-2 m-0 p-0" style={{ paddingLeft: 0 }}>
                    <Tab><h6 className="tabtitles mr-3 ml-3 mt-3 adminfix"> <i className="material-icons md-36 marg">home</i> ADMIN Dashboard</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">source</i>Products</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">collections</i>Categories</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">color_lens</i>Colors</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">local_shipping</i>Suppliers</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">flight</i>Shipping</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">public</i>Region</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">money_off</i>Code Promo</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">redeem</i>Packaging</h6></Tab>
                    <Tab><h6 className="tabtitles mr-3 ml-3"><i className="material-icons md-36 marg">mode_comment</i>Reviews</h6></Tab>
                    <p className="float-right getdatabase mt-3 p-3">
                        <span className="database">
                            Get the database
                    </span>
                        <span className="getpdf" onClick={getPDF}><i className="material-icons md-45 marg ml-2 down">save_alt</i></span>
                    </p>
                </TabList>
                <div className="col-1"></div>
                <div className="col-8 m-5 p-0">
                    <TabPanel>
                        <Dashboard />
                    </TabPanel>
                    <TabPanel>
                        {AllProducts()}
                    </TabPanel>
                    <TabPanel>
                        {AllCategories()}
                    </TabPanel>
                    <TabPanel>
                        <Color />
                    </TabPanel>
                    <TabPanel>
                        <SupplierCommand />
                    </TabPanel>
                    <TabPanel>
                        <Shipping />
                    </TabPanel>
                    <TabPanel>
                        <Region />
                    </TabPanel>
                    <TabPanel>
                        <Promo />
                    </TabPanel>
                    <TabPanel>
                        <Packaging />
                    </TabPanel>
                    <TabPanel>
                        <Reviews />
                    </TabPanel>


                </div>
                <div className="col-1"></div>

            </Tabs>
        </div>
    )
}
export default AdminInterface;
