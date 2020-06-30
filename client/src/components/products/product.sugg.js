import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

export default function PersonalizedSugg(props) {
  const [results, setResults] = useState({});
  const [resultsReady, setResultsReady] = useState(false);
  const history = useHistory()

  let jsonRequest = {
    price: {
      start: 0,
      end: 100000,
    },
    sex: null,
    size: null,
    color: null,
    subcategory: null,
    category: null,
    order_by: 'popularity',
    order_by_sort: 'asc',
    search: null
  };

  useEffect (() => {
    axios
    .post(
      process.env.REACT_APP_API_LINK + "/api/product/filter?offset=0&limit=3",
      jsonRequest,
      { headers: { "Content-Type": "application/json" } }
    )
    .then((res) => {
      setResults(res.data);
      setResultsReady(true);
      console.log(results);
    })
    .catch((error) => {
      console.log(error.response);
    });
  }, [resultsReady])

  useEffect(() => {
    return history.listen(() => {
        props.reload();
    })
  },[history])

  const imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";

  if (resultsReady) {
    return (
      <div className="container-fluid p-3 sugg-div-product">
        <h2 className="pb-2">You may like</h2>
        <div className="row justify-content-around">
  
          {results.map((e) => {
            return (
              <div className="col-md-4" key={e.product_id + '-' + e.id}>
                <div className='ProductHome mb-4'>
                  {/* <img src={'../../../../images/1/default/2020-06-0603-16-51.jpg'} />  */}
                  <div className='bg-gray p-3'>
                    <span className="HomeArticleTItle">{e.title.length < 26
                            ? e.title
                            : e.title.substr(0, 26).trim() + "..."}</span>
                    { e.promo > 0 ? <p><s className="text-danger">{e.price} €</s> {(e.price)-(e.price * (e.promo/100))} €</p>  : <p>{e.price} €</p>}
                    
                    <Link to={"/product/" + e.product_id}>
                      <div className="ProductHomeImgContainer">
                        <img className="ProductHomeImg" src={e.images && e.images[1] ? process.env.REACT_APP_API_LINK + e.images[1]  : imageDefault}></img>
                        <img className="ProductHomeImg ProductHomeImg2" src={e.images && e.images[1] ? process.env.REACT_APP_API_LINK + e.images[0] : imageDefault}></img>
                      </div>
                    </Link>
                    <a href={"/product/" + e.product_id}><button className='btn-cart'>View Product</button></a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  else {
    return ' ';
  }
}
