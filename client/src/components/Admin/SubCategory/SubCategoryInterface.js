import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, 
    Link
  } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import store from '../../../store';

const SubCategoryInterface = () => {

    const [subCategories, setSubCategories] = useState([]);
    const [nameCategory, setNameCategory] = useState('');
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
        axios.get("http://localhost:8000/api/category/"+id, config)
        .then(res => {
            console.log(res.data)
            setNameCategory(res.data.name)
            setSubCategories(res.data.subCategories);    
        })
        .catch(error => {
          toast.error('Error !', {position: 'top-center'});
        });
    }, [])

    const deleteCategory = (idSub) => {
        console.log(idSub);
        axios.delete("http://localhost:8000/api/subcategory/"+idSub, config)
        .then(res => {
            axios.get("http://localhost:8000/api/category/"+id, config)
                .then(res => {
                    setSubCategories(res.data.subCategories);    
                })
                .catch(error => {
                    toast.error('Error !', {position: 'top-center'});
                 });
            toast.success(res.data.message, {position: "top-center"}); 
        })
        .catch(error => {
          toast.error('Error !', {position: 'top-center'});
        });
    }

    // const redirectCreate = () => {
    //     //window.location.href='/admin/subproduct/'+id+'/create';
    // }

    return(
        <div className="container">
            <ToastContainer />
            <h1 className="mb-5">
              <img src="https://img.icons8.com/windows/32/000000/speedometer.png"/> ADMIN - Dashboard
            </h1>
            <div className="row justify-content-end mb-2">
                <h3 className="mr-auto ml-2">All SubCategories of <b>{nameCategory}</b></h3>
                <button onClick={() => window.location.href='/admin/update/category/'+id} className='btn btn-outline-info m-2'> modify the category </button>
                <button onClick={() => window.location.href='/admin'} className='float-right btn m-2 btn-warning'> Back to dashboard </button>
                <button onClick={() => window.open('/admin/create/subcategory') } className="btn btn-dark">
                    + New SubCategory
                </button>
              {/* <button onClick={redirectCreate} className="btn btn-dark">
                + New SubCategory for <b>{nameCategory}</b>
              </button> */}
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
                        <td> <button onClick={() => window.location.href='/admin/subcategory/'+id+'/'+category.id+'/update'}className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteCategory(category.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                    ) : null}
                </tbody>
            </table>
            </div>
        </div>
        
    )
}

export default SubCategoryInterface;