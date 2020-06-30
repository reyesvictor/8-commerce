import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import axios from 'axios';
import store from '../../../store';

const CreateImage = () => {
    const [picture, setPicture] = useState([]);

    let idproduct = useRouteMatch("/admin/create/image/:idproduct").params.idproduct;

    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": 'Bearer '+token
        }
    }

    // useEffect(() => {
    //     if (token) {
    //         config.headers['x-auth-token'] = token
    //     }
    // }, [token]);

    const onFileChange = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        setPicture(files);
        if (!files.length) {
            console.log('no files');
        }
        console.log(files);
        console.log(files[0])
    }
    const sendImage = () => {
        if(picture.length === 0) return alert('You need to pick a photo');
        let fileExtension =  picture[0].name.split('.').pop();
        let exts = ['jpg', 'jpeg', 'png']
        if(!exts.includes(fileExtension)){
          return alert('Your picture need to have the \'jpg\', \'jpeg\',\'png\' extension')
        }
        const bodyFormData = new FormData();
        bodyFormData.append('image',picture[0]);
        bodyFormData.append('color', 'default');
        axios
        .post(process.env.REACT_APP_API_LINK + '/api/product/'+idproduct+'/image', bodyFormData, config)
        .then(response => {
          setPicture([]);
          console.log(response);
         // document.location.reload();
        })
        .catch((error) => {
          console.log(error.response);
        })
      }
    
    console.log(picture);
    
    return(
        <div>
            <ToastContainer />
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning margin-righ mb-5'> Back to Dashboard </button>
            </div>
             <input id="my-file-selector" type="file" name="file"  multiple="multiple" onChange={onFileChange} />
             <button className='btn btn-primary' onClick={sendImage}> Send image </button>
        </div>
    )
}

export default CreateImage;