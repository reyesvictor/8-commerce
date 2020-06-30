import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Parallax, Background } from "react-parallax";
import imageTech from "../../img/techshop.jpeg";
import { Link } from "react-router-dom";
import Footer from '../footer/Footer';

const Techlab =  () => {
  const [products, setProducts] = useState([]);
  const header = { "Content-Type": "application/json" };
    let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";
    let nbrArctPop = 3;
    let jsonRequest = {
      category: null,
      color: null,
      order_by: "popularity",
      order_by_sort: "desc",
      price: { start: 0, end: 5000 },
      search: null,
      sex: null,
      size: null,
      subcategory: "Tech_Lab",
    }

    useEffect(() => {
        axios.post(process.env.REACT_APP_API_LINK + "/api/product/filter?offset=0&limit=10", jsonRequest, { headers: header }).then(resp => {
          console.log(resp.data)
          //Display Lowest Price Image
          let prices = {}
          let promos = {}
          let products_temp = resp.data
          let unavailable_msg = 'Available Soon...'
          products_temp.map((product, i) => {
            prices[product.id] = []
            promos[product.id] = []
                //Product has subproducts
                console.log(product)

                  prices[product.id].push(product.price)
                  if (product.promo > 0) {
                      promos[product.id].push(product.promo)
                  }
      
            })
          
            //Boucler sur l'objet pour voir si il y a un prix minimal ou si il n'est pas disponible
          if (Object.keys(prices).length > 0) {
            const entries = Object.entries(prices)
            for (const [id, prices_list] of entries) {
              for (let j = 0; j < products_temp.length; j++) {
                if (products_temp[j].id == id) {
                  if (prices_list[0] == unavailable_msg) {
                    products_temp[j]['lowest_price'] = unavailable_msg
                  } else {
                    let price = Math.min.apply(Math, prices_list)
                    if (isEmpty(promos[id])) {
                      products_temp[j]['lowest_price'] = 'Starts at ' + price + ' €'
                    }
                    else {
                        //let promo = (price) - (price * (promos[id] / 100))
                      products_temp[j]['lowest_price'] = <span>Starts at {products_temp[j].price} € <s className="text-danger">{products_temp[j].basePrice} €</s></span>
                    }
                  }
                }
              }
            }
          }
            setProducts(products_temp)
        });
        return () => {
        }
    }, []);

    const isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
  return(
    <div>
      <Parallax
        blur={{ min: -15, max: 15 }}
        bgImage={imageTech}
        bgImageAlt="shop"
        strength={-200}
        height={10}
      >
          <div style={{ height: '600px' }} />
      </Parallax>
      <div className="row m-0 p-0 ">
        {products.map((e) => {
          console.log(e)
          return (
            <div className="col-md-4 m-0 p-0" key={e.id}>
              <div className='m-4'>
                <span className="HomeArticleTItle">{e.title.length > 50 ? e.title.substr(0, 50) + '...' : e.title}</span>
                <p>{e.basePrice}€</p>
                {
                  <> 
                  <Link to={"/product/" + e.product_id}>
                    <div className="ProductHomeImgContainer">
                      {<img className="ProductHomeImg" src={e.images ? process.env.REACT_APP_API_LINK + '' + e.images[1] : imageDefault}></img>}
                      {<img className="ProductHomeImg ProductHomeImg2" src={e.images && e.images.length > 1 ? process.env.REACT_APP_API_LINK + '' + e.images[0] : imageDefault}></img>}
                    </div>
                  </Link>
                      <a href={"/product/" + e.id}><button className='btn-cart'>View Product</button></a>
                  </>
                }
              </div>
            </div>
          )
        })}
      </div>
      <div className="row m-0 mt-2 p-0 pt-5 bg-light justify-content-center">  <Footer /></div>
    </div>
  )
}

export default Techlab