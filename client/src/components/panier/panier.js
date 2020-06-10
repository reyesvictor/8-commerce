import React, { Component, Fragment, useState } from "react";
import axios from "axios";
import { Parallax } from "react-parallax";
class Panier extends Component {
  constructor() {
    super();
    this.state = {
      productsCart: [],
      prixTotal: 0,
      nombreTotal: 0,
    };
  }

  componentDidMount() {
    const Message = [];
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

  handleChange(e) {
    e.preventDefault();
    console.log(e);
    // if (quantity.value != "") {
    //   if (quantity.value != quantity.defaultValue);
    //   let panier = sessionStorage.getItem("panier", []);
    //   console.log(panier, quantity.id);
  }

  render() {
    const Message = [];
    if (this.state.nombreTotal == 0)
      Message.push(
        <div className="statutpanier col m-0 p-4">
          Votre Panier est actuellement vide
        </div>
      );
    const productsInCart = this.state.nombreTotal;
    return (
      <div className="container-fluid overflow-hidden h-100 m-0 pl-2 pr-2">
        <div className="row h-100">
          <div className="col-md-6 m-0 p-3">checkout</div>
          <div className="col-md-6 productImgBg m-0 p-3">
            <div id="" className="LargeCart">
              <h2>Voir le panier</h2>
              <hr />
              {Message}
              <table className="">
                <tbody>
                  {this.state.productsCart != [] &&
                    this.state.productsCart.map((e) => {
                      return (
                        <>
                          <tr>
                            <td rowSpan="2" className="tableborder ImageCart">
                              <img
                                className=""
                                src={"http://127.0.0.1:8000" + e.image}
                              />
                            </td>
                            <td>
                              <a href={"/product/" + e.product.id}>
                                {e.product.title}
                              </a>
                            </td>
                          </tr>
                          <tr className="tableborder">
                            <td className="detailsproduct">
                              <span>color: {e.color.name}</span>
                              <span>size: {e.size}</span>
                              <span>
                                quantity:
                                
                                  <input
                                    type="number"
                                    id={e.id}
                                    name="tentacles"
                                    defaultValue={e.quantity}
                                    onChange={this.handleChange}
                                    min="1"
                                    max="20"
                                  ></input>
                                
                              </span>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
              <div className="total">
                <span>{this.state.nombreTotal} produits</span>
                <span>Total : {this.state.prixTotal} €</span>
              </div>
              <a href="/panier">
                <button className="btn-cart">Checkout</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Panier;
