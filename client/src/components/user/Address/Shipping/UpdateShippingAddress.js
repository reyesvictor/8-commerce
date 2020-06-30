import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBilllingAddress = ({idUser, config, idAddress, closeModal}) => {
    console.log('update id ', idAddress)
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postcode, setPostcode] = useState(0);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [region, setRegion] = useState(0);
    const [getRegion, setGetRegion] = useState(0);
    const [allRegions, setAllRegions] = useState([])
    
    useEffect(() => {
        getAndSet();     
    }, [])

    useEffect(() => {
        getAllRegions();   
    }, [getRegion])
    const getAndSet = () => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/addressshipping/"+idAddress, config).then(res => {
            console.log(res)
            setAddress(res.data.address);
            setCity(res.data.city);
            setCountry(res.data.country);
            setPostcode(res.data.postcode)
            setGetRegion(res.data.region.id);
            setRegion(res.data.region.id);
            setFirstname(res.data.firstname);
            setLastname(res.data.lastname);
        }).catch(err => {
        console.log(err);
        })
    }
    const getAllRegions = () => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/region", config).then(res => {
            console.log(res.data.data)
            console.log(getRegion);
            let optionRegion = [];
            res.data.data.map(region => {
                region.id === getRegion 
                ? optionRegion.push(<option key={region.id} value={region.id} selected>{region.name}</option>)
                : optionRegion.push(<option key={region.id} value={region.id}>{region.name}</option>)
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
            "region": region,
            "country": country,
            "city": city,
            "postcode": postcode,
            "address": address,
            "firstname": firstname,
            "lastname": lastname

        }
        console.log(body);
        axios.put(process.env.REACT_APP_API_LINK + "/api/addressshipping/"+idAddress, body, config).then(res => {
            toast.success('Shipping Address correclty updated !', {position: 'top-center'})
            closeModal();
          }).catch(err => {
            console.log('posterr', err)
          })
    }
    return(
        <>
        <Modal.Header closeButton>
            Update a new Shipping Address !
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
                value={address}
                />
                <br/>
                <Label for="city">City</Label>
                <Input
                type="text"
                name="city"
                id="city"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                />
                <br/>
                <Label for="region">Region</Label>
                <select name="Region" className="form-control form-control-lg" onChange={(e) => setRegion(parseInt(e.target.value))}>
                    <option value="">--- SELECT REGION ---</option>
                    {console.log(allRegions)}
                    {allRegions}
                </select>
                <Label for="country">Country</Label>
                <Input
                type="text"
                name="countyr"
                id="country"
                onChange={(e) => setCountry(e.target.value)}
                value={country}
                />
                <br/>
                <Label for="postcode">Postcode</Label>
                <Input
                type="number"
                name="postcode"
                id="postcode"
                onChange={(e) => setPostcode(e.target.value)}
                value={postcode}
                />
                <br/>
                <Label for="firstname">Firstname</Label>
                <Input
                type="text"
                name="firstname"
                id="firstname"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
                />  
                <br/>      
                <Label for="lastname">Lastname</Label>
                <Input
                type="text"
                name="lastname"
                id="lastname"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
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

export default UpdateBilllingAddress;