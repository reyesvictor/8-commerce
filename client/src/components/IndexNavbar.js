import React, { Component, Fragment, useState } from "react";
import axios from "axios";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { searchPost } from "../actions/postActions";
import { BrowserRouter as Router } from "react-router-dom";
import "./IndexNavbar.css";
import profileLogo from "../img/profile.png";
import searchLogo from "../img/search.png";
import adminLogo from "../img/gear.png";
import SuggestionSearch from './Search/SuggestionSearch'

import {
  Navbar,
  Nav,
  NavItem,
} from "react-bootstrap";
class IndexNavbar extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      productsCart: [],
      prixTotal: 0,
      nombreTotal: 0,
    };
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  componentDidMount() {
    let panier = JSON.parse(sessionStorage.getItem("panier", []));
    if (panier) {
      panier.map((e) => {
        axios
          .get("http://127.0.0.1:8000/api/subproduct/" + e.productid, {})
          .then((data) => {
            let somme = data.data.price * e.quantite;
            this.setState({ prixTotal: this.state.prixTotal + somme });
            this.setState({ nombreTotal: this.state.nombreTotal + e.quantite });
            axios
              .get(
                "http://127.0.0.1:8000/api/product/" + data.data.product.id,
                {}
              )
              .then((product) => {
                let img = product.data.images.find(
                  (o) => o.color_id === data.data.color.id.toString()
                );
                if (img) img = { image: img.links[0] };
                else img = { image: product.data.images[0].links[0] };
                let total = Object.assign(data.data, img);
                let quantity = { quantity: e.quantite };
                total = Object.assign(data.data, quantity);
                this.setState({
                  productsCart: [...this.state.productsCart, total],
                });
              });
          });
      });
    }
  }

  operation() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const Message = [];
    if (this.state.nombreTotal == 0)
      Message.push(
        <div className="statutpanier">Votre Panier est actuellement vide</div>
      );
    const { user, isAuthenticated, isLoading } = this.props.auth;
    let id = window.location.href.split("/");
    id = id[id.length - 1];

    const authLinks = (
      <Fragment>
        <Router>
          <NavItem>
            <Nav.Link href="#" id="profileLogo">
              <img src={profileLogo} />
            </Nav.Link>
          </NavItem>
          <NavItem>
            <Logout />
          </NavItem>
        </Router>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <LoginModal />
        </NavItem>
        <NavItem>
          <RegisterModal />
        </NavItem>
      </Fragment>
    );

    const productsInCart = this.state.nombreTotal;

    return (
      <div id="navbarholder">
        <Navbar color="light" light="true" expand="lg" id="navbar">
          <Navbar.Brand href="/" id="brandName">
            8-commerce
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavItem>
              <Nav.Link href="/search?sexe=H">Men</Nav.Link>
            </NavItem>
            <NavItem>
              <Nav.Link href="/search?sexe=F">Women</Nav.Link>
            </NavItem>
            <NavItem>
              <Nav.Link href="/search?category=Accessories">Accessories</Nav.Link>
            </NavItem>
          </Navbar.Collapse>
        </Navbar>
        <Navbar id="underline">
          <SuggestionSearch />
          <Nav.Link href="/search" id="searchLogo">
            <img src={searchLogo} />
          </Nav.Link>
          <Nav>
            {!isLoading ? (isAuthenticated ? authLinks : guestLinks) : null}
          </Nav>
          {user !== null && user.role === "admin" ? (
            <Nav.Link href="/admin" id="adminLogo">
              <img src={adminLogo} />
            </Nav.Link>
          ) : null}
          <div
            className="p-0"
            id="productsCart"
            onClick={() => this.operation()}
          >
            <div className="float-left">{productsInCart}</div>
            <img
              className="float-left align-bottom"
              src="https://img.icons8.com/windows/32/000000/shopping-bag.png"
            />
          </div>
          {this.state.isOpen ? (
            <div id="minicart" className="cartContainer">
              <button className="buttonreset" onClick={() => this.operation()}><i className="material-icons md-36 marg">clear</i></button>
              {Message}
              <table className="productinCart">
                <tbody>
                  {this.state.productsCart != [] &&
                    this.state.productsCart.map((e) => {
                      console.log(e);
                      return (
                        <>
                          <tr>
                            <td rowSpan="2" className="tableborder imgcontainer">
                              <img src={"http://127.0.0.1:8000" + e.image} />
                            </td>
                            <td>
                              <a href={"/product/" + e.product.id}>
                                {e.product.title}
                              </a>
                            </td>
                          </tr>
                          <tr className="tableborder">
                            <td className="detailsproduct">
                              <div>price: {e.price}€<br />size: {e.size}</div>
                              <div>color: {e.color.name}<br /> quantity: {e.quantity}</div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
              <div className="total">
                <span>{this.state.nombreTotal}  {this.state.nombreTotal > 1 ? 'produits' : 'produit'}</span>
                <span>Total : {this.state.prixTotal} €</span>
              </div>
              <a href="/panier">
                <button className="btn-cart">Voir le panier</button>
              </a>
            </div>
          ) : null}
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, { searchPost })(IndexNavbar);
