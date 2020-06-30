import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import axios from 'axios';
import store from '../../../store';

const CreateImageSubproduct = () => {
    const [picture, setPicture] = useState([]);
    const [color, setColor] = useState('default');
    const [colors, setColors] = useState([]);

    let idproduct = useRouteMatch("/admin/create/image/:idproduct/:idsubproduct").params.idproduct;
    let idsubproduct = useRouteMatch("/admin/create/image/:idproduct/:idsubproduct").params.idsubproduct;

    const token = store.getState().auth.token
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": 'Bearer '+token
        }
    }

    // useEffect(() => {
    //     if (token) {
    //         config.headers['Authorization'] = 'Bearer '+token;
    //     }
    // }, [token]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/color", config).then( allColors => {
            let optionColors = [];
            allColors.data.map(colorMap => {
                optionColors.push(<option key={colorMap.id} value={colorMap.id}>{colorMap.name}</option>)
            });
            setColors(optionColors);
        });
    }, [])
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
          return toast.error('Your picture need to have the \'jpg\', \'jpeg\',\'png\' extension', {position: 'top-center'})
        }
        const bodyFormData = new FormData();
        bodyFormData.append('image',picture[0]);
        bodyFormData.append('color', color);
        console.log(color)
        axios
        .post(process.env.REACT_APP_API_LINK + '/api/image/'+idsubproduct, bodyFormData, config)
        .then(response => {
          console.log(response);
          toast.success(response.data.message, {position: 'top-center'});
         // document.location.reload();
        })
        .catch((error) => {
            console.log(error)
            toast.error('error ', {position: 'top-center'})
        })
      }
    
    console.log(picture);
    
    return(
        <div>
            <ToastContainer />
            <div className="form-group">
                <label htmlFor="color">Color</label>
                    <select name="color" className="form-control form-control-lg" onChange={(e) => setColor(e.target.value)}>
                            <option value="default">Default (product)</option>
                            {colors}
                    </select>
            </div>
             <input id="my-file-selector" type="file" name="file" onChange={onFileChange} />
             <button className='btn btn-primary' onClick={sendImage}> Send image </button>
             <div className="btnLink">
                <button onClick={() => window.location.href='/admin/subproduct/'+idproduct} className='float-right btn btn-info m-2'> Back to the Subproduct </button>
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning margin-righ mt-5'> Back to Dashboard </button>
            </div>
        </div>
    )
}

export default CreateImageSubproduct;