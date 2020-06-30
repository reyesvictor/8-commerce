import React from 'react';
import LoginModal from "../auth/LoginModal";
import axios from "axios";
import SlideToggle from "react-slide-toggle";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import store from '../../store';
import { config } from 'react-transition-group';
import { useEffect } from 'react';

/* eslint-disable */

class Checkout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            region: 1,
            country: "France",
            showstatus: false
        }
    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
    };

    componentDidMount() {
        // console.log(this.props.auth);
        let header = { "Content-Type": "application/json" };
        if (this.props.auth.token) header = { ...header, 'Authorization': 'Bearer ' + this.props.auth.token }

        if (this.props.auth.user != null) {
            if (!this.state.shippingAddress && !this.state.billingAddress) {

                axios
                    .get(process.env.REACT_APP_API_LINK + "/api/user/" + this.props.auth.user.id + "/address", {headers:header})
                    .then((res) => {
                        return this.setState({ shippingAddress: res.data.shippingAddress, billingAddress: res.data.billingAddress, email: this.props.auth.user.email })
                    })
                    .catch((error) => {
                    });
            }
        }

        axios.get(process.env.REACT_APP_API_LINK + "/api/region", {headers:header})
            .then((res) => {
                return this.setState({ regions: res.data.data })
            })
            .catch((error) => {
            });
    }

    componentDidUpdate() {
        if (this.props.auth.user != null) {
            if (!this.state.shippingAddress && !this.state.billingAddress) {
                let header = { "Content-Type": "application/json" };
                if (this.props.auth.token) header = { ...header, 'Authorization': 'Bearer ' + this.props.auth.token }

                axios
                    .get(process.env.REACT_APP_API_LINK + "/api/user/" + this.props.auth.user.id + "/address", {headers:header})
                    .then((res) => {
                        return this.setState({ shippingAddress: res.data.shippingAddress, billingAddress: res.data.billingAddress, email: this.props.auth.user.email })
                    })
                    .catch((error) => {
                    });
            }
        }
        // this.setState({ NoShipPrice : this.props.price});
    }

    handleChange = event => {
        const { name, value } = event.target;
        if (name == 'confirmcvv') { this.setState({ showstatus: true }) }

        if (name == "cardchoice") {
            if (value != "NewCard") { this.setState({ showstatus: true, showthings: "" }) } else {
                this.setState({ showstatus: false, showthings: "ShowNewCard" })
            }
        }

        if (name == "addresschoice") { if (value != "NewShippingAddress") { this.setState({ showstatus: false }) } else { this.setState({ showstatus: true }) } }
        if (name == 'billing_addresschoice') {
            if (value == 'true') {
                this.setState({ showstatus: false, showthings: "" })
            } else if (value == 'false') {
                this.setState({ showstatus: true, showthings: "" })
            } else if (value == 'NewBillingAddress') {
                this.setState({
                    showstatus: true,
                    showthings: "ShowNewBilling"
                });
            }
            else {
                this.setState({ showstatus: true, showthings: "" })
            }
        }
        this.setState({
            [name]: value
        })
    }

    checkpromo = event => {
        event.preventDefault();
        const { name, value } = event.target;
        if (this.state.promocode) {
            let jsonRequest = {
                'promocode': this.state.promocode,
            }

            let header = { "Content-Type": "application/json" };
            if (this.props.auth.token) header = { ...header, 'Authorization': 'Bearer ' + this.props.auth.token }

            axios
                .post(
                    process.env.REACT_APP_API_LINK + "/api/promocode",
                    jsonRequest,
                    { headers: header }
                )
                .then((res) => {
                    this.setState({ promocode_details: res.data });
                })
                .catch((error) => {
                    this.setState({ promocode_details: "error" });
                });
        }
    }

    handleSubmit = event => {
        event.preventDefault()
        let s = this.state;
        if (!s.cardchoice) {
            return toast.error('Please fill all the required informations', { position: 'top-center' });
        } else {
            if (s.cardchoice == "NewCard") {
                if (!s.cardfirstname || !s.cardlastname || !s.cardnumber || !s.expirymonth || !s.expiryyear)
                    return toast.error('Please fill all the required informations', { position: 'top-center' });
            } else {
                if (s.cards[s.cardchoice].ccv != parseInt(s.confirmccv)) {
                    return toast.error('Error: CCV is not correct', { position: 'top-center' });
                }
            }
        }

        let shippingAddress;
        if (this.state.addresschoice != "NewShippingAddress") {
            shippingAddress = this.state.shippingAddress[this.state.addresschoice].id
        }
        else {
            shippingAddress = {
                'region_id': this.state.region,
                'user_id': this.props.auth.user != null ? this.props.auth.user.id : null,
                'country': this.state.country,
                'city': this.state.city,
                'postcode': this.state.zip,
                'address': this.state.address,
                'firstname': this.state.firstname,
                'lastname': this.state.lastname,
            }
        }

        let arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));
        arrayOfObj = arrayOfObj.map(({ productid, quantite }) => ({ subproduct_id: productid, quantity: quantite }));
        let billingAddress;
        if (this.state.billing_addresschoice == 'true') {
            billingAddress = shippingAddress
        } else {
            if (this.state.billing_addresschoice != "NewBillingAddress") {
                billingAddress = parseInt(this.state.billingAddress[this.state.billing_addresschoice].id)
            }
            else {
                billingAddress = {
                    'region_id': this.state.billing_region,
                    'user_id': this.props.auth.user != null ? this.props.auth.user.id : null,
                    'country': this.state.billing_country,
                    'city': this.state.billing_city,
                    'postcode': this.state.billing_zip,
                    'address': this.state.billing_address,
                    'firstname': this.state.billing_firstname,
                    'lastname': this.state.billing_lastname,
                }
            }
        }

        let CardDetails;
        if (this.state.cardchoice != "NewCard") {
            CardDetails = this.state.cards[this.state.cardchoice].id;
        }
        else {
            CardDetails = {
                'user_id': this.props.auth.user != null ? this.props.auth.user.id : null,
                'card_numbers': this.state.cardnumber,
                'expiration_date': this.state.expirymonth + '/' + this.state.expiryyear,
                'firstname': this.state.cardfirstname,
                'lastname': this.state.cardlastname,
                'ccv': parseInt(this.state.ccv)
            }
        }

        let jsonRequest = {
            'email': this.state.email,
            "promo_code": this.state.promocode,
            'user_id': this.props.auth.user != null ? this.props.auth.user.id : null,
            'packaging_id': this.state.packagingchoice != null ? this.state.packagingchoice : null,
            'pricing_id': this.state.shipping_methods[this.state.shippingchoice].pricing_id,
            'shipping_address': shippingAddress,
            'billing_address': billingAddress,
            'card_credentials': CardDetails,
            'subproducts': arrayOfObj
        }

        // console.log(jsonRequest)

        let header = { "Content-Type": "application/json" };
        if (this.props.auth.token) header = { ...header, 'Authorization': 'Bearer ' + this.props.auth.token }

        axios
            .post(
                process.env.REACT_APP_API_LINK + "/api/checkout",
                jsonRequest,
                { headers: header }
            )
            .then((res) => {
                this.setState({ currentStep: 4, trackingnumber: res.data.trackingnumber })
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }

    _next = () => {
        if (this.state.currentStep == 1) {
            let s = this.state;
            if (!s.addresschoice) {
                return toast.error('Please fill all the required informations', { position: 'top-center' });
            } else {
                if (s.addresschoice == "NewShippingAddress") {
                    if (!s.email || !s.firstname || !s.lastname || !s.address || !s.city || !s.zip || !s.region || !s.country) {
                        return toast.error('Please fill all the required informations', { position: 'top-center' });
                    }
                }
            }
            const arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));
            let hide = true
            this.props.callbackFromParent(hide);
            if (arrayOfObj) {
                const arrayAPIName = arrayOfObj.map(({ productid: subproduct_id, quantite: quantity, ...rest }) => ({ subproduct_id, quantity, ...rest }));
                let jsonRequest = {
                    "region_id": this.state.region,
                    "subproducts": arrayAPIName
                };

                let header = { "Content-Type": "application/json" };
                if (this.props.auth.token) header = { ...header, 'Authorization': 'Bearer ' + this.props.auth.token }
                axios
                    .post(
                        process.env.REACT_APP_API_LINK + "/api/checkout/shipping",
                        jsonRequest,
                        { headers: header }
                    )
                    .then((res) => {
                        this.setState({ shipping_methods: res.data.shippingMethods, lowestPriceKey: res.data.lowestPriceKey, lowestId: res.data.shippingMethods[res.data.lowestPriceKey].pricing_id });
                        let longestKey = null;
                        let shortestKey = null;
                        let longestId = null;
                        let shortestId = null;
                        for (let [key, value] of Object.entries(this.state.shipping_methods)) {
                            if (value.duration == Math.max.apply(Math, this.state.shipping_methods.map(function (o) { return o.duration; }))) { longestKey = parseInt(key), longestId = value.pricing_id }
                            if (value.duration == Math.min.apply(Math, this.state.shipping_methods.map(function (o) { return o.duration; }))) { shortestKey = parseInt(key), shortestId = value.pricing_id }
                        }
                        this.setState({ "longestKey": longestKey, "shortestKey": shortestKey, "longestId": longestId, "shortestId": shortestId })
                    })
                    .catch((error) => {
                    });
            }
        }

        if (this.state.currentStep == 2) {
            let s = this.state;
            if (!s.shippingchoice)
                return toast.error('Please choose a delivery option', { position: 'top-center' });

            if (!s.billing_addresschoice)
                return toast.error('Please fill all the required informations', { position: 'top-center' });

            if (s.billing_addresschoice != 'true') {
                if (s.billing_addresschoice == "NewBillingAddress") {
                    if (!s.billing_firstname || !s.billing_lastname || !s.billing_address || !s.billing_city || !s.billing_zip || !s.billing_region || !s.billing_country || !s.shippingchoice)
                        return toast.error('Please fill all the required informations', { position: 'top-center' });
                }
            }

            let header = { "Content-Type": "application/json" };
            if (this.props.auth.token) header = { ...header, 'Authorization': 'Bearer ' + this.props.auth.token }

            axios
                .get(process.env.REACT_APP_API_LINK + "/api/packaging/available?spending=" + this.state.NoShipPrice, {headers:header})
                .then((res) => {
                    return this.setState({ packagingAvailable: res.data })
                })
                .catch((error) => {
                });

            if (this.props.auth.user != null) {
                axios
                    .get(process.env.REACT_APP_API_LINK + "/api/cardcredentials/user/" + this.props.auth.user.id, {headers:header})
                    .then((res) => {
                        return this.setState({ cards: res.data })
                    })
                    .catch((error) => {
                    });
            }
        }

        let currentStep = this.state.currentStep
        currentStep = currentStep >= 2 ? 3 : currentStep + 1
        this.setState({
            currentStep: currentStep,
            showstatus: false,
            showthings: '',
        })
    }

    _prev = () => {
        if (this.state.currentStep == 2) {
            let hide = false
            this.props.callbackFromParent(hide);
        }
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep != 1 && currentStep != 4) {
            return (
                <button
                    className="btn btn-secondary"
                    type="button" onClick={this._prev}>
                    Previous
                </button>
            )
        }
        return null;
    }

    nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < 3) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this._next}>
                    Next
                </button>
            )
        }
        if (currentStep == 3) {
            return (
                <> <button className="btn btn-success float-right" type="button" onClick={this.handleSubmit}>Pay Now</button>
                </>
            )
        }
        return null;
    }

    render() {
        const { user } = this.props.auth;
        const arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));

        let regions = []
        if (this.state.regions) {
            this.state.regions.map((e) => {
                if (e.restricted != true)
                    regions.push(<option key={"region" + e.name} value={e.id}>{e.name}</option>)
                else
                    regions.push(<option key={"region" + e.name} disabled>{e.name} - Unavailable</option>)
            })
        }
        else {
            regions = "Impossible to ship currently"
        }

        return (
            <>
                <React.Fragment>
                    <div className="col-8 LargeCart">
                        {arrayOfObj ? <> <p>Step {this.state.currentStep} </p>
                            <form><Step1
                                data={this.state}
                                currentStep={this.state.currentStep}
                                handleChange={this.handleChange}
                                handleShow={this.handleShow}
                                showstatus={this.state.showstatus}
                                regions={regions}
                                user={user}
                            />
                                <Step2
                                    currentStep={this.state.currentStep}
                                    handleChange={this.handleChange}
                                    showstatus={this.state.showstatus}
                                    data={this.state}
                                    handleShow={this.handleShow}
                                    regions={regions}
                                    promo={this.checkpromo}
                                />
                                <Step3
                                    currentStep={this.state.currentStep}
                                    handleChange={this.handleChange}
                                    showstatus={this.state.showstatus}
                                    handleSubmit={this.handleSubmit}
                                    data={this.state}
                                    totalPrice = {this.props.price}
                                    handleShow={this.handleShow}
                                    regions={regions}
                                    promo={this.checkpromo}

                                />
                                <Step4
                                    currentStep={this.state.currentStep}
                                    data={this.state}
                                />
                                {this.previousButton()}
                                {this.nextButton()}
                            </form>  </>

                            : null}
                    </div>
                </React.Fragment>
            </>
        );
    }
}

function Step1(props) {
    let ShippoingAdressOptions = []
    if (props.data.shippingAddress != null) {
        for (let [key, value] of Object.entries(props.data.shippingAddress)) {
            if (props.data.regions) {
                props.data.regions.map((e) => {
                    if (!e.restricted) {
                        if (e.id == value.region.id) {
                            ShippoingAdressOptions.push(
                                <div key={"address_" + key} className="col-md-12">
                                    <label className="control control-radio w-100 form-check-label" htmlFor={"addresschoice" + key}>
                                        <input className="form-check-input checkbox-style" type="radio" name="addresschoice" id={"addresschoice" + key} value={key} onChange={props.handleChange} />
                                        <div className="control_indicator"></div>
                                        <div className="alert alert-secondary p-0">
                                            <div className="d-flex flex-column">
                                                <div className="pl-3 pt-1">{value.firstname} {value.lastname}</div>
                                                <div className="pl-3 p-0">{value.address}</div>
                                                <div className="pl-3 pb-1">{value.city} {value.zipcode} {value.country} - {value.region.name}</div>
                                            </div>
                                        </div>
                                    </label>
                                </div >
                            )

                        }
                    }
                })
            }
        }
    }
    if (props.currentStep != 1) {
        return null
    }
    return (
        <>
            {props.user != null ? null : <><div className="d-flex"><LoginModal /><div className="pt-2 pl-0"> or continue as a Guest</div></div>
                <div className="form-group col-md-12">
                    <legend>Contact information</legend>
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Email" defaultValue={props.data.email ? props.data.email : null} onChange={props.handleChange} required />
                </div></>}
            <legend>Shipping Address</legend>
            {ShippoingAdressOptions}

            <div className="alert alert-secondary">
                <div className="form-row col-md-12">
                    <label className="control control-radio w-100 form-check-label" htmlFor="addresschoice">
                        <input className="form-check-input checkbox-style" type="radio" name="addresschoice" id="addresschoice" value="NewShippingAddress" onChange={props.handleChange} />
                        <div className="control_indicator"></div> New Address +
                                </label>
                </div>
                <div className={props.showstatus == false ? "col-md-12 hiding" : "pt-3 col-md-12 show"}>
                    <div className="form-row  col-md-12">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputfirstname">Firstname</label>
                            <input type="text" className="form-control" id="inputfirstname" placeholder="Firstname" defaultValue={props.data.firstname ? props.data.firstname : null} name="firstname" onChange={props.handleChange} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputLastname">Lastname</label>
                            <input type="text" className="form-control" id="inputLastname" placeholder="Lastname" defaultValue={props.data.lastname ? props.data.lastname : null} name='lastname' onChange={props.handleChange} />
                        </div>
                    </div>
                    <div className="form-group  col-md-12">
                        <label htmlFor="inputAddress">Address</label>
                        <input type="text" className="form-control" id="inputAddress" name='address' placeholder="Address" defaultValue={props.data.address ? props.data.address : null} onChange={props.handleChange} />
                    </div>
                    <div className="form-row  col-md-12">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputCity">City</label>
                            <input type="text" className="form-control" id="inputCity" name='city' placeholder="City" defaultValue={props.data.city ? props.data.city : null} onChange={props.handleChange} />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputZip">Zip code</label>
                            <input type="text" className="form-control" id="inputZip" name='zip' defaultValue={props.data.zip ? props.data.zip : null} placeholder="Zipcode" value={props.zip} onChange={props.handleChange} />
                        </div>
                    </div>

                    <div className="form-row  col-md-12">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputRegion">Region</label>
                            <select name="region" onChange={props.handleChange} className="custom-select">
                                <option value='1'>Choose a Region</option>
                                {props.regions}
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputZip">Country</label>
                            <input type="text" className="form-control" id="inputCountry" defaultValue={props.data.country ? props.data.country : null} placeholder="Country" name='country' value={props.country} onChange={props.handleChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Step2(props) {
    if (props.currentStep != 2) {
        return null
    }
    else {
        let BillingAdressOptions = []
        if (props.data.billingAddress != null) {
            for (let [key, value] of Object.entries(props.data.billingAddress)) {
                if (props.data.regions) {
                    props.data.regions.map((e) => {
                        if (!e.restricted) {
                            if (e.id == value.region.id) {
                                BillingAdressOptions.push(
                                    <div key={"address_" + key} className="col-md-12">
                                        <label className="control control-radio w-100 form-check-label" htmlFor={"billing_addresschoice" + key}>
                                            <input className="form-check-input checkbox-style" type="radio" name="billing_addresschoice" id={"billing_addresschoice" + key} value={key} onChange={props.handleChange} />
                                            <div className="control_indicator"></div>
                                            <div className="alert alert-secondary p-0">
                                                <div className="d-flex flex-column">
                                                    <div className="pl-3 pt-1">{value.firstname} {value.lastname}</div>
                                                    <div className="pl-3 p-0">{value.address}</div>
                                                    <div className="pl-3 pb-1">{value.city} {value.zipcode} {value.country} -  {value.region.name} </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div >
                                )
                            }
                        }
                    })
                }
            }
        }
        const items = []
        if (props.data.shipping_methods) {

            props.data.shipping_methods.sort(function (a, b) { return a.price - b.price; });
            props.data.shipping_methods.reverse();

            const array1 = [1, 2, 3];
            array1.unshift(4, 5)
            // console.log(array1);

            for (let [key, value] of Object.entries(props.data.shipping_methods)) {
                // console.log(props.data.shortestId, value.pricing_id)
                // { key != props.data.lowestPriceKey ? "col-md-12 m-0 p-0 order-1" : "m-0 p-0 col-md-12" }
                // { key == props.data.lowestPriceKey ? "alert alert-primary" : key == props.data.longestKey ? "alert-success alert" : key == props.data.shortestKey ? "alert alert-warning" : "alert alert-secondary" }

                // if (value.pricing_id == )

                items.push(
                    <div key={"choice_" + key} className={value.pricing_id == props.data.shortestId ? "col-md-12 m-0 p-0" : value.pricing_id == props.data.longestId ? "col-md-12 m-0 p-0" : value.pricing_id == props.data.lowestId ? "col-md-12 m-0 p-0 order-first" : "m-0 p-0 col-md-12"}>
                        <label className="control control-radio w-100 form-check-label" htmlFor={"shippingchoice" + key}>
                            <input className="form-check-input checkbox-style" type="radio" name="shippingchoice" id={"shippingchoice" + key} value={key} onChange={props.handleChange} />
                            <div className="control_indicator"></div>
                            <div className={value.pricing_id == props.data.lowestId ? "alert alert-primary" : value.pricing_id == props.data.longestId ? "alert-success alert" : value.pricing_id == props.data.shortestId ? "alert alert-warning" : "alert alert-secondary"}>
                                <div className="col-md-12 d-flex">
                                    <div className="col-md-6 m-0 p-0">
                                        <h5>{value.pricing_id == props.data.lowestId ? "Our best" : value.pricing_id == props.data.longestId ? "Our greenest" : value.pricing_id == props.data.shortestId ? "Our fastest" : "Another"} option :</h5>
                                        <div className="bd-highlight text-nowrap">Carrier: {value.name}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bd-highlight text-nowrap">Delivery: {value.duration} days</div>
                                        <div className="bd-highlight text-nowrap">Price: {value.price} €</div>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div >
                )


            }

            let Promo_status = []
            if (props.data.promocode_details) {
                if (props.data.promocode_details == 'error') {
                    Promo_status.push(<small id="promo_status" key="promo_status" className="form-text text-danger">Promocode is unvalid</small>)

                } else {
                    Promo_status.push(<small id="promo_status" key="promo_status" className="form-text text-success">Congrats ! Your promocode worked</small>)
                }
            }
            return (
                <>
                    <legend><label className="form-row" htmlFor="promocode">Promo Code</label></legend>
                    <label className="pt-1 col-5 " htmlFor="promocode">Have a promocode ?</label><div className="col-6">
                        <div className=" form-check-inline"><input type="promocode" className="form-control" id="promocode" name="promocode" placeholder="promocode" onChange={props.handleChange} /><button className="btn btn-primary" onClick={props.promo} >Check</button></div>
                        {Promo_status}
                    </div>
                    <legend className="pt-4">Shipping Method</legend>
                    <div key="shipping_method_ewe" className="row m-0 p-0">
                        {items}
                    </div>
                    <legend>Billing address</legend>
                    <div className={props.showstatus == false ? "form-row  mt-3 col-md-12 " : "form-row mt-3  col-md-12 "}>
                        {BillingAdressOptions}

                        <div className="alert w-100 alert-secondary">
                            <div className="form-row col-md-12">
                                <label className="control control-radio w-100 form-check-label" htmlFor="billing_addresschoice">
                                    <input className="form-check-input checkbox-style" type="radio" name="billing_addresschoice" id="billing_addresschoice" value="NewBillingAddress" onChange={props.handleChange} />
                                    <div className="control_indicator"></div> New Address +
                                    </label>
                            </div>
                            <div className={props.data.showthings != "ShowNewBilling" ? "hiding" : "pt-3 show"} >
                                <div className="form-row  col-md-12">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputfirstname">Firstname</label>
                                        <input type="text" className="form-control" id="inputfirstname" placeholder="Firstname" defaultValue={props.data.billing_firstname ? props.data.billing_firstname : null} name="billing_firstname" onChange={props.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputLastname">Lastname</label>
                                        <input type="text" className="form-control" id="inputLastname" placeholder="Lastname" defaultValue={props.data.billing_lastname ? props.data.billing_lastname : null} name='billing_lastname' onChange={props.handleChange} />
                                    </div>

                                    <div className="form-group  col-md-12">
                                        <label htmlFor="inputAddress">Address</label>
                                        <input type="text" className="form-control" id="inputAddress" placeholder="Address" defaultValue={props.data.billing_address ? props.data.billing_address : null} name='billing_address' placeholder="Address" onChange={props.handleChange} />
                                    </div>
                                    <div className="form-row  col-md-12">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="inputCity">City</label>
                                            <input type="text" className="form-control" id="inputCity" placeholder="City" defaultValue={props.data.billing_city ? props.data.billing_city : null} name='billing_city' onChange={props.handleChange} />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="inputZip">Zip code</label>
                                            <input type="text" className="form-control" id="inputZip" placeholder="Zipcode" defaultValue={props.data.billing_zip ? props.data.billing_zip : null} name='billing_zip' value={props.zip} onChange={props.handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-row  col-md-12">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="inputRegion">Region</label>
                                            <select defaultValue={props.data.billing_region ? props.data.billing_region : null} name="billing_region" onChange={props.handleChange} className="custom-select">
                                                <option value='1'>Choose a Region</option>
                                                {props.regions}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="inputZip">Country</label>
                                            <input type="text" className="form-control" id="inputCountry" name='billing_country' placeholder="Country" defaultValue={props.data.billing_country ? props.data.billing_country : null} value={props.country} onChange={props.handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                </>
            )
        }
        else {
            return (
                <>Sorry, we are currently not Shipping to your destination</>
            )
        }
    }
}

function Step3(props) {
    if (props.currentStep != 3) {
        return null
    }
    else {
        let CardsOptions = []
        if (props.data.cards != null) {
            for (let [key, value] of Object.entries(props.data.cards)) {
                CardsOptions.push(
                    <div key={"card_" + key} className="col-md-12">
                        <label className="control control-radio w-100 form-check-label" htmlFor={"cardchoice" + key}>
                            <input className="form-check-input checkbox-style" type="radio" name="cardchoice" id={"cardchoice" + key} value={key} onChange={props.handleChange} />
                            <div className="control_indicator"></div>
                            <div className="alert alert-secondary p-0">
                                <div className="d-flex flex-column">
                                    <div className="pl-3 pt-1">Name : {value.firstname} {value.lastname}</div>
                                    <div className="pl-3 p-0">Card Num. : {value.cardNumbers}</div>
                                    <div className="pl-3 pb-1">Exp. Date : {value.expirationDate}</div>
                                </div>
                            </div>
                        </label>
                    </div >
                )
            }
        }
        let shipping_cost = props.data.shipping_methods[props.data.shippingchoice].price;
        
        let totalprice = shipping_cost + props.totalPrice
        
        let Promo = []
        if (props.data.promocode_details) {
            // console.log(props.data.promocode_details)

            if (props.data.promocode_details != 'error') {
                Promo.push(<div ley="promo" className="row pl-4 pr-4 d-flex justify-content-between"><span>Promo :</span><span>- {Math.round(totalprice * (props.data.promocode_details.percentage / 100))} €</span></div>)
                totalprice = totalprice - totalprice * (props.data.promocode_details.percentage / 100)
            }
        }

        let Packagings = []
        if (props.data.packagingAvailable) {
            props.data.packagingAvailable.map((e) => {
                Packagings.push(
                    <label key={'pack' + e.name} className="control control-radio w-100 form-check-label" htmlFor={e.name}>
                        <input className="form-check-input checkbox-style" type="radio" name="packagingchoice" id={e.name} value={e.id} onChange={props.handleChange} />
                        <div className="control_indicator"></div> {e.name}
                    </label>)
            })
        }
        else {
            Packagings = false
        }
        return (
            <React.Fragment>
                <>
                    <div className="alert alert-info"><h4>Your final order details:</h4>
                        <div className="row pl-4 pr-4 d-flex justify-content-between"><span>Order :</span><span>{props.totalPrice} €</span></div>
                        <div className="row pl-4 pr-4 d-flex justify-content-between"><span>Shipping :</span><span>{Math.round(shipping_cost)} €</span></div>
                        {Promo}
                        <div className="row pl-4 pr-4 d-flex justify-content-between"><h5>Total :</h5><span>{Math.round(totalprice)} €</span></div>
                    </div>
                    {Packagings != false ? <div><legend>Limited Time Offers</legend>
                        <p>Get a free packaging for a limited time only !</p>{Packagings}</div> : null}

                    <legend className="mt-1">Card Details</legend>
                    {CardsOptions}
                    <div className={props.showstatus == false ? "form-row col-md-12 mb-0 hiding transition" : "transition form-row col-md-12 mb-2 show"}>
                        <label className="col-sm-4 mt-2 control-label" htmlFor="confirmccv">Enter CVV</label> <div className="col-sm-6 ">
                            <input type="text" className="form-control" id="confirmccv" name="confirmccv" placeholder="Confirm CCV" defaultValue={props.data.confirmccv ? props.data.confirmccv : null} onChange={props.handleChange} />
                        </div>
                    </div>
                    <div className="alert alert-secondary">
                        <div className="form-row col-md-12">
                            <label className="control control-radio w-100 form-check-label" htmlFor="cardchoice">
                                <input className="form-check-input checkbox-style" type="radio" name="cardchoice" id="cardchoice" value="NewCard" onChange={props.handleChange} />
                                <div className="control_indicator"></div> New Card +
                                        </label>
                        </div>
                        <div className={props.data.showthings != "ShowNewCard" ? "form-row  col-md-12 hiding" : "form-row  col-md-12 show"} >
                            <div className="form-group">
                                <div className="form-row  col-md-12">
                                    <div className="form-group col-md-6">
                                        <label className="col-sm-3 control-label" htmlFor="cardfirstname">Firstname</label>
                                        <input type="text" className="form-control" name="cardfirstname" id="cardfirstname" placeholder="Card Holder's Firsname" defaultValue={props.data.cardfirstname ? props.data.cardfirstname : null} onChange={props.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-sm-3 control-label" htmlFor="cardlastname">Lastname</label>
                                        <input type="text" className="form-control" name="cardlastname" id="cardlastname" placeholder="Card Holder's Firsname" defaultValue={props.data.cardlastname ? props.data.cardlastname : null} onChange={props.handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-12">
                                <div className="col-sm-12">
                                    <label className="control-label" htmlFor="cardnumber">Card Number</label>
                                    <input type="text" className="form-control" name="cardnumber" id="cardnumber" maxLength="16" placeholder="Debit/Credit Card Number" defaultValue={props.data.cardnumber ? props.data.cardnumber : null} onChange={props.handleChange} />
                                </div>
                            </div>
                            <div className="form-group col-sm-12">
                                <label className="col-sm-11 control-label" htmlFor="expirymonth">Expiration Date</label>
                                <label className="col-sm-1 control-label" htmlFor="expiryyear"></label>
                                <div className="col-sm-12">
                                    <div className="row ml-1">
                                        <div className="col-xs-6 pr-05">
                                            <select className="form-control" name="expirymonth" id="expirymonth" onChange={props.handleChange}>
                                                <option>Month</option>
                                                <option value="01">Jan (01)</option>
                                                <option value="02">Feb (02)</option>
                                                <option value="03">Mar (03)</option>
                                                <option value="04">Apr (04)</option>
                                                <option value="05">May (05)</option>
                                                <option value="06">June (06)</option>
                                                <option value="07">July (07)</option>
                                                <option value="08">Aug (08)</option>
                                                <option value="09">Sep (09)</option>
                                                <option value="10">Oct (10)</option>
                                                <option value="11">Nov (11)</option>
                                                <option value="12">Dec (12)</option>
                                            </select>
                                        </div>
                                        <div className="col-xs-6 pl-05">
                                            <select className="form-control" name="expiryyear" id="expiryear" onChange={props.handleChange}>
                                                <option value="20">2020</option>
                                                <option value="21">2021</option>
                                                <option value="22">2022</option>
                                                <option value="23">2023</option>
                                                <option value="24">2024</option>
                                                <option value="25">2025</option>
                                                <option value="26">2026</option>
                                                <option value="27">2027</option>
                                                <option value="28">2028</option>
                                                <option value="29">2029</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-12 control-label" htmlFor="ccv">Card ccv</label>
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" name="ccv" id="ccv" placeholder="Security Code" maxLength="3" defaultValue={props.data.ccv ? props.data.ccv : null} onChange={props.handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </React.Fragment >
        );
    }
}

function Step4(props) {
    if (props.currentStep != 4) {
        return null
    }
    return (
        <React.Fragment>
            <div className="f">
                <h3>Your order has been successfully registered !</h3>
                <p>Your order number is: {props.data.trackingnumber}</p>
                <p> An confirmation e-mail has been sent to you with your order details and tracking number. <br />
               You can track your order status <a href={"/command?order=" + props.data.trackingnumber}>here</a></p>
                <div className="form-group mt-4">
                    <a href="/"><button className='btn btn-secondary' onClick={sessionStorage.removeItem("panier")}>Go back to the store</button></a>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Checkout);
