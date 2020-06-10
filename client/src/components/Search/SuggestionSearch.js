import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import "./SuggestionSearch.css";
import { Dropdown, Form, Button, FormControl } from "react-bootstrap";

export default class SuggestionSearch extends Component {
  constructor() {
    super();

    this.state = {
      input: "",
      show: false,

      suggProducts: null,
      suggCat: null,
      suggSubcat: null,

      isDataReady: false,
    };

    this.handleInput = this.handleInput.bind(this);
    this.closeSugg = this.closeSugg.bind(this);
  }

  async handleInput(e) {
    await this.setState({ input: e.target.value });

    if (this.state.input) {
      this.getSuggestions();
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }
  }

  closeSugg() {
    this.setState({ show: false, input: "" });
    $('#form').val('')
  }

  getSuggestions() {
    let request = {
      search: this.state.input,
    };

    const header = { "Content-Type": "application/json" };

    axios
      .post("http://localhost:8000/api/product/search", request, {
        headers: header,
      })
      .then(async (res) => {
        console.log(res.data);
        await this.setState({
          suggProducts: res.data.products,
          suggCat: res.data.catsubcat[0].category,
          suggSubcat: res.data.catsubcat[1].subcategory,
        });

        if (
          this.state.suggProducts.length > 0 ||
          this.state.suggCat.length > 0 ||
          this.state.suggSubcat.length > 0
        ) {
          this.setState({ isDataReady: true });
        } else {
          this.setState({ isDataReady: false });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  render() {
    const show = this.state.show;

    const isDataReady = this.state.isDataReady;

    const products = this.state.suggProducts;
    const categories = this.state.suggCat;
    const subcategories = this.state.suggSubcat;

    const ImgTest =
      "https://pluspng.com/img-png/png-school-bag-j-international-bags-manufacturer-of-school-bag-college-bag-from-chennai-494.png";

    return (
      <div ref={(node) => {
        this.node = node;
      }}>
        <Form inline>
          <FormControl
            type="text"
            placeholder="Quick Search"
            className="mr-sm-2"
            onChange={this.handleInput}
            id="form"
            autocomplete="off"
          />
        </Form>

        {isDataReady && products ? (
          <div
            className={show ? "sugg-div row" : "sugg-div d-none"}
          >
            <div className="col-6 d-inline part-catsubcat">
              <div>
                {categories.length > 0 && (
                  <span className="sugg-header">Category</span>
                )}
                {categories.map((category) => {
                  return (
                    <a href={"/search?category=" + category.name} className="sugg-a" key={category.id}>
                      <div className="sugg-cat">{category.name}</div>
                    </a>
                  );
                })}
              </div>
              <div>
                {subcategories.length > 0 && (
                  <span className="sugg-header">Subcategory</span>
                )}
                {subcategories.map((subcategory) => {
                  return (
                    <a href={"/search?subcategory=" + subcategory.name} className="sugg-a" key={subcategory.id}>
                      <div className="sugg-cat">{subcategory.name}</div>
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="col-6 d-inline part-div">
              {products.length < 1 ? (
                <>
                  <span className="mb-2 sugg-header">Products<a href="#" onClick={this.closeSugg}><i className="material-icons md-18 float-right mr-2">close</i></a></span>
                  <div className="sugg-no-product">
                    <i>No products</i>
                  </div>
                </>
              ) : (
                <span className="mb-2 sugg-header">Products<a href="#" onClick={this.closeSugg}><i className="material-icons md-18 float-right mr-2">close</i></a></span>
              )}
              {products.map((product) => {
                return (
                  <a
                    href={"/product/" + product.product_id}
                    className="sugg-product"
                    key={product.id}
                  >
                    <div>
                      <img
                        src={process.env.REACT_APP_API_LINK + product.images[0]}
                        className="sugg-product_img"
                      ></img>
                      {product.title.length < 22
                        ? product.title
                        : product.title.substr(0, 22) + "..."}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
