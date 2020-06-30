import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  constructor() {
    super();

    this.state = {
      subcategories: null,
    };
  }

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_API_LINK + "/api/subcategory/")
      .then((res) => {
        // console.log(res.data);
        // this.setState({ subcategories: res.data });

        let results = res.data.map((subcat, index) => {
          let name = subcat.name.charAt(0).toUpperCase() + subcat.name.slice(1);
          if (index < 8)
            return (
              <Link to={"/search?subcategory=" + name} key={subcat.id}>
                {name}
              </Link>
            );
        });

        this.setState({ subcategories: results });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  render() {
    const subcategories = this.state.subcategories;

    return (
      <>
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-1 footer-link">
              <p>Shop</p>
              {subcategories}
            </div>

            <div className="col-1 footer-link">
              <p>Account</p>
              <Link to="/user?content=shipping">My Account</Link>
              <Link to="/user?content=history">Custom Orders</Link>
            </div>

            <div className="col-1 footer-link">
              <p>More</p>
              <Link to="/questions">Q&A</Link>
            </div>

            <div className="ml-auto col-5 text-center">
              <a
                className="twitter-timeline"
                data-width="400"
                data-height="200"
                data-theme="light"
                href="https://twitter.com/Timberland?ref_src=twsrc%5Etfw"
              >
                Tweets by Timberland
              </a>
            </div>
          </div>
        </div>

        <div className="footer-link-sm my-2">
          <Link to="/">©8-commerce 2020</Link>
        </div>
      </>
    );
  }
}
