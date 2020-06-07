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
import {
    Button, Form, FormGroup, Label, Input, Alert
} from 'reactstrap'
import Modal from 'react-bootstrap/Modal';

const AdminInterface = () => {
    const [products, setProducts] = useState([]);
    const [limit, setLimit] = useState(2);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [postData, setPostData] = useState();
    const [categories, setCategories] = useState([]);
    const [limitCategories, setLimitCategories] = useState(2);
    const [offsetCategories, setOffsetCategories] = useState(0);
    const [pageCountCategories, setPageCountCategories] = useState();
    const [postDataCategories, setPostDataCategories] = useState();
    const [allColors, setAllColors] = useState([]);
    const [colorSelected, setColorSelected] = useState('');
    const [show, setShow] = useState(false);
    const [newColor, setNewColor] = useState("");
    const [oldColor, setOldColor] = useState("");
    const [msgError, setMsgError] = useState(null);
    const [show2, setShowColor] = useState(false);
    const [colorCreate, setColor] = useState("");
    const [msgErrorColor, setErrorColor] = useState(null);
    const optionColors = [];
    const [showImage, setShowImage] = useState(false);
    const [picture, setPicture] = useState([]);
    const [imageId, setImageId] = useState(null);

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
        axios.get("http://127.0.0.1:8000/api/color", config).then(e => {
            setAllColors(e.data);
        });
    }, []);

    useEffect(() => {
        receivedData()
    }, [offset, products])

    useEffect(() => {
        receivedDataCategories()
    }, [offsetCategories, categories])

    allColors.map(color => {
        optionColors.push(<option key={color.id} value={color.id}>{color.name}</option>)
    });

    const receivedData = () => {
        axios.get(`http://localhost:8000/api/product?offset=${offset}&limit=${limit}`, config)
            .then(async res => {
                console.log('i:', offset, ' limit:', limit)
                await setPageCount(Math.ceil(res.data.nbResults / limit))
                const newPostData = res.data.data.map((product) =>
                    <tr key={product.id}>
                        <td><p className="m-2 align-items-center">{product.id}</p></td>
                        <td><p className="m-2">{product.title.length > 15 ? product.title.substr(0, 15) + '...' : product.title}</p></td>
                        <td><p className="m-2">{product.status ? 'Active' : 'Inactive'}</p></td>
                        <td><p className="m-2">{product.subCategory.name.length > 15 ? product.subCategory.name.substr(0, 15) + "..." : product.subCategory.name}</p></td>
                        <td><p className="m-2">{product.sex}</p></td>
                        <td><button onClick={e => e.preventDefault() + handleShowImage(product.id)} className="btn add btn-outline-success">Add</button></td>
                        <td><button onClick={() => window.location.href = 'admin/subproduct/' + product.id} className="btn btn-outline-dark "><span className="viewsub">View</span></button></td>
                        <td><button onClick={() => window.location.href = 'admin/update/product/' + product.id} className="btn modify btn-outline-info m-2">Modify</button></td>
                        <td><button onClick={() => deleteProduct(product.id)} className="btn delete btn-outline-danger mr-2">Delete</button></td>
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
        axios.delete("http://localhost:8000/api/product/" + id, config)
            .then(res => {
                axios.get("http://localhost:8000/api/product", config)
                    .then(res => {
                        setProducts(res.data.data);
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

    const receivedDataCategories = () => {
        axios.get(`http://127.0.0.1:8000/api/category?offset=${offsetCategories}&limit=${limitCategories}`, config)
            .then(async res => {
                await setPageCountCategories(Math.ceil(res.data.nbResults / limitCategories))
                const newPostDataCategories = res.data.data.map((category) =>
                    <tr key={category.id}>
                        <td><p className="m-2 align-items-center">{category.id}</p></td>
                        <td><p className="m-2">{category.name}</p></td>
                        <td> <button onClick={() => window.location.href = '/admin/subcategory/' + category.id} className="btn btn-outline-dark m-2">View</button></td>
                        <td> <button onClick={() => window.location.href = 'admin/update/category/' + category.id} className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteCategory(category.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                )
                setPostDataCategories(newPostDataCategories)
            })
            .catch(error => {
                toast.error('Error !', { position: 'top-center' });
            })
    }
    // console.log(config)
    const handlePageClickCategories = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limitCategories;
        setOffsetCategories(newOffset);
    };

    const deleteCategory = (id) => {
        axios.delete("http://localhost:8000/api/category/" + id, config)
            .then(res => {
                axios.get("http://localhost:8000/api/category", config)
                    .then(res => {
                        setCategories(res.data.data);
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

    const redirectCreate = (data) => {
        switch (data) {
            case 'product':
                window.location.href = '/admin/create/product';
                break;
            case 'category':
                window.location.href = '/admin/create/category';
                break;
            case 'subcategory':
                window.location.href = '/admin/create/subcategory';
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
        axios.post('http://localhost:8000/api/image/' + imageId, bodyFormData, config)
            .then(response => {
                setPicture([]);
                setShowImage(false);
                toast.success("Image correctly added !", { position: "top-center" });
            }).catch((error) => {
                toast.error("Error !", { position: "top-center" });
            })
    }

    const AllProducts = () => {
        return (
            <>
                <div className="row justify-content-end mb-2">

                    <button onClick={() => redirectCreate('product')} className="btn btn-dark">
                        + New Product
                    </button>
                </div>
                <div className="row border p-2">
                    <table>
                        <thead>
                            <tr>
                                <th><p className="m-2 align-items-center"> ID </p></th>
                                <th><p className="m-2"> Title </p></th>
                                <th><p className="m-2"> Status </p></th>
                                <th><p className="m-2"> SubCategory </p></th>
                                <th><p className="m-2"> Sex </p></th>
                                <th><p className="m-2"> Image </p></th>
                                <th colSpan="3"><p className="m-2"> Subproduct </p></th>
                            </tr>
                        </thead>
                        <tbody>
                            {postData}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
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
                            activeClassName={"active"} />
                        {/* --------------------- MODAL FOR IMAGE ------------------------------------ */}
                        <Modal show={showImage} onHide={handleImage}>
                            <Modal.Header closeButton>
                                Download Image !
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={onSubmitImage}>
                                    <FormGroup>
                                        <Label for="image">Image</Label>
                                        <Input
                                            type="file"
                                            name="image"
                                            id="image"
                                            onChange={onChangeImage}
                                        />
                                        <Button color="dark" className="mt-4" block>
                                            Submit
                                        </Button>
                                    </FormGroup>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </>
        )
    }

    const AllCategories = () => {
        return (
            <>
                <div className="row justify-content-end mb-2">

                    <button onClick={() => redirectCreate('category')} className="btn btn-dark">
                        + New Category
                    </button>
                    <button onClick={() => redirectCreate('subcategory')} className="btn btn-secondary">
                        + New SubCategory
                    </button>
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
                            {postDataCategories}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
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
                            activeClassName={"active"} />
                    </div>
                </div>
            </>
        )
    }

    const handleSelectColor = (e) => {
        setColorSelected(e.target.value);
    }

    const handleColorClick = () => {
        if (colorSelected) {
            axios.delete("http://localhost:8000/api/color/" + colorSelected, config).then(res => {
                toast.success(res.data.message, { position: "top-center" });
            }).catch(err => {
                toast.error('Error !', { position: 'top-center' });
            })
        } else {
            toast.error('Error ! No color selected', { position: 'top-center' });
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const selectNewColor = (event) => setOldColor(event.target.value);
    const onChange = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let color = str.charAt(0).toUpperCase() + str.slice(1);
        setNewColor(color.replace(/[\s]{2,}/g, " "));
    }

    function onSubmit(e) {
        e.preventDefault()

        if (oldColor && newColor) {
            setMsgError(null);

            if (newColor.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
                setMsgError("Invalid charactere");
            } else {
                const body = {
                    "name": newColor
                }

                axios.put("http://localhost:8000/api/color/" + oldColor, body, config).then(res => {
                    toast.success(res.data.message, { position: "top-center" });
                    axios.get("http://127.0.0.1:8000/api/color", config).then(e => {
                        setAllColors(e.data);
                    });
                }).catch(err => {
                    toast.error('Color name already exist !', { position: 'top-center' });
                })

                setShow(false);
            }
        }
        else {
            setMsgError("selected the 2 colors");
        }
    }

    const handleCloseColor = () => setShowColor(false);
    const handleShowColor = () => setShowColor(true);
    const onChangeColor = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let color = str.charAt(0).toUpperCase() + str.slice(1);
        setColor(color.replace(/[\s]{2,}/g, " "));
    }

    function onSubmit2(e) {
        e.preventDefault()

        if (colorCreate) {
            setErrorColor(null);

            if (colorCreate.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
                setErrorColor("Invalid charactere");
            } else {
                const body = {
                    "name": colorCreate
                }

                axios.post("http://127.0.0.1:8000/api/color/" + colorCreate, body, config).then(res => {
                    toast.success('Color correctly added!', { position: "top-center" });
                    axios.get("http://127.0.0.1:8000/api/color", config).then(e => {
                        setAllColors(e.data);
                    });
                }).catch(err => {
                    toast.error('Color already exist!', { position: 'top-center' });
                });

                setShowColor(false);
            }
        }
        else {
            setErrorColor("selected the 2 colors");
        }
    }

    const AllColors = () => {
        return (
            <>
                <div className="row justify-content-end mb-2">
                    <button onClick={handleShowColor} className="btn btn-dark btn-color mr-4">
                        + New Color
                    </button>

                    <Modal show={show2} onHide={handleCloseColor} >
                        <Modal.Header closeButton>
                            Create color !
                        </Modal.Header>
                        <Modal.Body>
                            {msgErrorColor ? <Alert> {msgErrorColor} </Alert> : null}
                            <Form onSubmit={onSubmit2}>
                                <FormGroup>
                                    <Label for="newColor">New name</Label>
                                    <Input
                                        type="text"
                                        name="newColor"
                                        id="newColor"
                                        placeholder="Color name"
                                        onChange={onChangeColor}
                                    />
                                    <Button color="dark" className="mt-4" block>
                                        Update
                                </Button>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <button onClick={handleShow} className="btn btn-dark btn-color">
                        Update Color
                    </button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            Update color !
                        </Modal.Header>
                        <Modal.Body>
                            {msgError ? <Alert> {msgError} </Alert> : null}
                            <Form onSubmit={onSubmit}>
                                <FormGroup>
                                    <select className="form-control form-control" onChange={selectNewColor}>
                                        <option value="">---SELECT COLOR---</option>
                                        {optionColors}
                                    </select><br />
                                    <Label for="newColor">New name</Label>
                                    <Input
                                        type="text"
                                        name="newColor"
                                        id="newColor"
                                        placeholder="Color name"
                                        onChange={onChange}
                                    />
                                    <Button color="dark" className="mt-4" block>
                                        Update
                                </Button>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                    </Modal>

                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="d-flex">
                            <select className="form-control form-control-lg" onChange={handleSelectColor}>
                                <option value="">--- SELECT COLOR ---</option>
                                {optionColors}
                            </select>
                            <button className="btn btn-outline-danger ml-4 deleteColor" onClick={handleColorClick}>Delete</button>
                        </div>
                    </li>
                </ul>
            </>
        )
    }

    return (
        <div className="container adminTable">
            <ToastContainer />
            <h1 className="mb-5">
                <i class="material-icons md-36">speed</i> ADMIN - Dashboard
            </h1>
            <Tabs forceRenderTabPanel={true}>
                <TabList className="tabsHolder">
                    <Tab><h3 className="tabtitles mr-auto ml-2">All Products</h3></Tab>
                    <Tab><h3 className="tabtitles mr-auto ml-2">All Categories</h3></Tab>
                    <Tab><h3 className="tabtitles mr-auto ml-2">All Colors</h3></Tab>
                </TabList>
                <TabPanel>
                    {AllProducts()}
                </TabPanel>
                <TabPanel>
                    {AllCategories()}
                </TabPanel>
                <TabPanel>
                    {AllColors()}
                </TabPanel>
            </Tabs>
        </div>
    )
}
export default AdminInterface;