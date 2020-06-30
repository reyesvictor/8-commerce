import axios from 'axios';
import "./CreateShipping.css";
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import store from '../../../store';

function CartShipping(props) {
    const [isInvalid, setIsInvalid] = useState(false);
    const [divShipping, setDivShipping] = useState([]);
    const [countProps, setCountProps] = useState(0);

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
        if (props.handleCart && props.handleCart.length !== countProps) {
        let nbr = countProps + 1;
            setCountProps(nbr);
        }
    }, [props.handleCart]);

    useEffect(() => {
        renderProduct();
    }, [countProps]);

    const renderProduct = () => {
        props.handleCart.map((e) => {
            setDivShipping([...divShipping,
                <div className="divOrderCart" key={countProps}>
                    <table className="productinCart">
                        <tbody>
                            <tr className="tableborder">
                                <td className="detailsproduct px-5 mx-5 py-3">
                                    <h6><b>Region:</b> {e.region}</h6>
                                    <h6><b>Price /KG:</b> {e.priceKG}</h6>
                                    <h6><b>Duration:</b> {e.duration}</h6>
                                    <h6><b>Base Price:</b> {e.basePrice}</h6>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ]);    
        });
    }

    function onSubmit(e) {
        e.preventDefault();
        let invalids = {};

        let objName = {
            "name": props.name
        };

        if (props.name != "") {
            if (props.name.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]/)) {
                invalids.error = "Re-enter the correct name";
                setIsInvalid(invalids);
            } else {
                setIsInvalid(invalids);
                axios.post(process.env.REACT_APP_API_LINK + "/api/shippingmethod", objName, config).then(res => {
                    let count = 0;
                    props.handleCart.map(pricing => {
                        const body = {
                                "pricePerKilo" : pricing.priceKG,
                                "duration" : pricing.duration,
                                "basePrice" : pricing.basePrice,
                                "shippingMethod" : res.data[0].id,
                                "region" : pricing.region
                            };
                        axios.post(process.env.REACT_APP_API_LINK + "/api/shippingpricing", body, config).then(res => {
                            // console.log(res)
                            count++;
                            if (count == props.handleCart.length) {
                                window.location.reload();
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        } else {
            invalids.error = "Re select Company Name !";
            setIsInvalid(invalids);
        }
    }

    if (props.handleCart.length > 0) {
        return (
            <>
                <div className="container mb-5" key={countProps}>
                    <h2 className="text-center">Company name: {props.name}</h2>
                    {divShipping}
                    <button className={"btn btn-success btnOrder " + (isInvalid.error ? 'is-invalid' : '')} onClick={onSubmit}>Validate Order</button>
                    <div className="invalid-feedback">{ isInvalid.error }</div>
                </div>
            </>
        )
    } else {
        return false
    }
}

export default CartShipping;