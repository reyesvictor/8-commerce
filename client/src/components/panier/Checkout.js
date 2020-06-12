import React from 'react';
import LoginModal from "../auth/LoginModal";
import axios from "axios";

class Checkout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
        }
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmitting = event => {
        event.preventDefault()
        const { email, username, password } = this.state

    }

    _next = () => {

        console.log(this.state)

        let currentStep = this.state.currentStep
        currentStep = currentStep >= 2 ? 3 : currentStep + 1
        this.setState({
            currentStep: currentStep
        })
    }

    _prev = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1) {
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
        return null;
    }

    render() {
        return (
            <React.Fragment>
                <p>Step {this.state.currentStep} </p>
                <Step1
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    email={this.state.email}
                />
                <Step2
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    data={this.state}
                />
                <Step3
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    password={this.state.password}
                />
                {this.previousButton()}
                {this.nextButton()}
            </React.Fragment>
        );
    }
}

function Step1(props) {
    if (props.currentStep !== 1) {
        return null
    }
    return (
        <div className="col-6">
            {/* <LoginModal /> or continue as a Guest */}
            <form>
                <div className="form-group col-md-12">
                    <h4>Contact information</h4>
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Email" onChange={props.handleChange} />
                </div>
                <h4>Shipping Adress</h4>
                <div className="form-row  col-md-12">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputfirstname">Firstname</label>
                        <input type="text" className="form-control" id="inputfirstname" name="firstname" onChange={props.handleChange} />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputLastname">Lastname</label>
                        <input type="text" className="form-control" id="inputLastname" name='lastname' onChange={props.handleChange} />
                    </div>
                </div>
                <div className="form-group  col-md-12">
                    <label htmlFor="inputAddress">Address</label>
                    <input type="text" className="form-control" id="inputAddress" name='adresse' placeholder="12 rue Martin" onChange={props.handleChange} />
                </div>
                <div className="form-row  col-md-12">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputCity">City</label>
                        <input type="text" className="form-control" id="inputCity" name='city' value={props.city} onChange={props.handleChange} />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputZip">Zip code</label>
                        <input type="text" className="form-control" id="inputZip" name='zip' value={props.zip} onChange={props.handleChange} />
                    </div>
                </div>
                <div className="form-group  col-md-12">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="gridCheck" />
                        <label className="form-check-label" htmlFor="gridCheck">
                            Check me out
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
}

function Step2(props) {

    // console.log(props.data)
    if (props.currentStep !== 2) {
        return null
    }

    return (
        <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                className="form-control"
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={props.username}
                onChange={props.handleChange}
            />
        </div>
    );
}

function Step3(props) {
    if (props.currentStep !== 3) {
        return null
    }
    return (
        <React.Fragment>
            {/* <div className="container">
                <form className="form-horizontal" role="form">
                    <fieldset>
                        <legend>Payment</legend>
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="card-holder-name">Name on Card</label>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" name="card-holder-name" id="card-holder-name" placeholder="Card Holder's Name" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="card-number">Card Number</label>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" name="card-number" id="card-number" placeholder="Debit/Credit Card Number" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="expiry-month">Expiration Date</label>
                            <div className="col-sm-9">
                                <div className="row">
                                    <div className="col-xs-6 pr-05">
                                        <select className="form-control" name="expiry-month" id="expiry-month">
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
                                        <select className="form-control" name="expiry-year">
                                            <option value="13">2013</option>
                                            <option value="14">2014</option>
                                            <option value="15">2015</option>
                                            <option value="16">2016</option>
                                            <option value="17">2017</option>
                                            <option value="18">2018</option>
                                            <option value="19">2019</option>
                                            <option value="20">2020</option>
                                            <option value="21">2021</option>
                                            <option value="22">2022</option>
                                            <option value="23">2023</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="cvv">Card CVV</label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control" name="cvv" id="cvv" placeholder="Security Code" />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-9">
                                <button type="button" className="btn btn-success">Pay Now</button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div> */}
        </React.Fragment>
    );
}




export default Checkout;