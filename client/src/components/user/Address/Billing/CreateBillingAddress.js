import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBilllingAddress = ({idUser, config, closeModal}) => {

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postcode, setPostcode] = useState(0);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [region, setRegion] = useState(0);
    const [allRegions, setAllRegions] = useState([])
    
    useEffect(() => {
        getAllRegions();
    }, [])

    const getAllRegions = () => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/region", config).then(res => {
            console.log(res.data.data)
            let optionRegion = [];
            res.data.data.map(region => {
                if (region.restricted) {
                    optionRegion.push(<option key={region.id} value={region.id} disabled>{region.name}</option>)
                } else {
                    optionRegion.push(<option key={region.id} value={region.id}>{region.name}</option>)
                }
            });
            setAllRegions(optionRegion)
          }).catch(err => {
            console.log(err);
          })
    }

    const onSubmitAddress = (e) => {
        e.preventDefault();
        if (address.match(/[\"/!$%^&*()_+|~=`{}[:;<>?.@#]]/)) return toast.error("Invalid charactere", { position: "top-center" });
        if (country.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) return toast.error("Invalid charactere", { position: "top-center" });
        if (city.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) return toast.error("Invalid charactere", { position: "top-center" });
        if (firstname.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) return toast.error("Invalid charactere", { position: "top-center" });
        if (lastname.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) return toast.error("Invalid charactere", { position: "top-center" });
       
        if (address === '' || address === ' ') return toast.error("Address Can't be avoid", { position: "top-center" });
        if (country === '' || country === ' ') return toast.error("Country Can't be avoid", { position: "top-center" });
        if (city === '' || city === ' ') return toast.error("City Can't be avoid", { position: "top-center" });
        if (postcode === '' || postcode === ' ') return toast.error("Postcode Can't be avoid", { position: "top-center" });
        if (firstname === '' || firstname === ' ') return toast.error("Firstname Can't be avoid", { position: "top-center" });
        if (lastname === '' || lastname === ' ') return toast.error("Lastname Can't be avoid", { position: "top-center" });

        if(region === '') return toast.error("You need to choose a region", { position: "top-center" });

        const body = {
            "user_id": idUser,
            "region_id": region,
            "country": country,
            "city": city,
            "postcode": postcode,
            "address": address,
            "firstname": firstname,
            "lastname": lastname

        }
        console.log(body);
        axios.post(process.env.REACT_APP_API_LINK + "/api/user/"+idUser+"/address/billing", body, config).then(res => {
            toast.success(res.data.message , {position: 'top-center'})
            closeModal();
          }).catch(err => {
            console.log('posterr', err)
          })
    }
    return(
        <>
        <Modal.Header closeButton>
            Create a new Billing Address !
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={onSubmitAddress}>
            <FormGroup>
                <Label for="address">Address</Label>
                <Input
                type="text"
                name="address"
                id="code"
                onChange={(e) => setAddress(e.target.value)}
                />
                <br/>
                <Label for="city">City</Label>
                <Input
                type="text"
                name="city"
                id="city"
                onChange={(e) => setCity(e.target.value)}
                />
                <br/>
                <Label for="region">Region</Label>
                <select name="Region" className="form-control form-control-lg" onChange={(e) => setRegion(parseInt(e.target.value))}>
                    <option value="">--- SELECT REGION ---</option>
                    {allRegions}
                </select>
                <Label for="country">Country</Label>
                <Input
                type="text"
                name="countyr"
                id="country"
                onChange={(e) => setCountry(e.target.value)}
                />
                <br/>
                <Label for="postcode">Postcode</Label>
                <Input
                type="number"
                name="postcode"
                id="postcode"
                onChange={(e) => setPostcode(e.target.value)}
                />
                <br/>
                <Label for="firstname">Firstname</Label>
                <Input
                type="text"
                name="firstname"
                id="firstname"
                onChange={(e) => setFirstname(e.target.value)}
                />  
                <br/>      
                <Label for="lastname">Lastname</Label>
                <Input
                type="text"
                name="lastname"
                id="lastname"
                onChange={(e) => setLastname(e.target.value)}
                />       
                <Button color="dark" className="mt-4" block>
                Submit
                </Button>
            </FormGroup>
            </Form>
        </Modal.Body>
        </>
    )
}

export default CreateBilllingAddress;