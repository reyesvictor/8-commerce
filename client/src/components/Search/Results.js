import React from 'react';
import './Results.css';
import { Link } from "react-router-dom";

const image1 = "https://i.imgur.com/wtIes8O.jpg";
let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";

function Results(props) {

  const results = props.results
  const display = props.display

  let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";
  let imageProduit1 = '';
  let imageProduit2 = ''

  if (results.length < 1) {
    return <h1>No Results</h1>;
  }
  if (display == "square"){
    return (
      <div className="container">
        <div className="row justify-content-around">
  
          {results.map((e) => {
            // console.log(e)
            return (
              <div className="col-md-4" key={e.product_id + '-' + e.id}>
                <div className='ProductHome mb-4'>
                  {/* <img src={'../../../../images/1/default/2020-06-0603-16-51.jpg'} />  */}
                  <div className='bg-gray p-3'>
                    <span className="HomeArticleTItle">{e.title.length < 26
                            ? e.title
                            : e.title.substr(0, 26).trim() + "..."}</span>
                    { e.promo > 0 ? <p>{e.price} € <s className="text-danger">{e.basePrice} €</s></p>  : <p>{e.price} €</p>}
                    
                    <Link to={"/product/" + e.product_id}>
                      <div className="ProductHomeImgContainer">
                        <img className="ProductHomeImg" src={e.images && e.images[1] ? process.env.REACT_APP_API_LINK + e.images[1]  : imageDefault}></img>
                        <img className="ProductHomeImg ProductHomeImg2" src={e.images && e.images[1] ? process.env.REACT_APP_API_LINK + e.images[0] : imageDefault}></img>
                      </div>
                    </Link>
                    <Link to={"/product/" + e.product_id}><button className='btn-cart'>View Product</button></Link>
                  </div>
                </div>
              </div>
            )
          })}
  
  
        </div>
  
        <div className="row justify-content-center">
          {/* <div className="col-2 text-center Pagination"><a href="">1</a> <a href="">2</a> <a href="">3</a> <a href="">→</a></div> */}
        </div>
      </div>
  
  
    )
  }
  else {
    return (
      <div className='container'>

        {results.map((e) => {
          // console.log(e)
          return (
            <div className="row w-100 product-row" key={e.product_id + '-' + e.id}>
            <img src={e.images ? process.env.REACT_APP_API_LINK + e.images[0] : imageDefault} className="col-3 p-3"></img>
            {/* <img src={process.env.REACT_APP_API_LINK + e.images[1]} className="col-3 p-3"></img> */}

            <div className="col-6 mt-auto mb-auto">
              <b>{e.title}</b>
              <br/>
              <br/>

              <p className="small">{e.description}</p>
            </div>

            <div className="col-3 mt-auto mb-auto md-force-align">
              {console.log(e)}
              { e.promo > 0 ? <p>{e.price} € <s className="text-danger">{ e.basePrice } €</s></p>  : <p>{e.price} €</p>}
              <a href={"/product/" + e.product_id}><button className='btn-cart'>View Product</button></a>
              { e.stock < 20 && <p className="text-danger mt-1 small"><i className="material-icons md-18">info_outline</i> {e.stock} item(s) left</p> }
            </div>
          </div>
          )

        })}

        <div className="row justify-content-center">
          {/* <div className="col-2 text-center Pagination"><a href="">1</a> <a href="">2</a> <a href="">3</a> <a href="">→</a></div> */}
        </div>
      </div>
    )
  }
}



export default Results;