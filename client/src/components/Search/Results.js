import React, { useState, useEffect } from 'react';
const image1 = "https://i.imgur.com/wtIes8O.jpg";
let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";

function Results(props) {

  const results = props.results
  console.log(results)
  let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";
  let imageProduit1 = '';
  let imageProduit2 = ''

  if (results.length < 1) {
    return <h1>No Results</h1>;
  }


  return (
    <div className="container">
      <div className="row justify-content-around">

        {results.map((e) => {
          console.log(e)
          return (
            <div className="col-md-4" key={e.product_id + '-' + e.id}>
              <div className='ProductHome'>
                {/* <img src={'../../../../images/1/default/2020-06-0603-16-51.jpg'} />  */}
                <div className='p-4 m-5 bg-gray'>
                  <span className="HomeArticleTItle">{e.title}</span>
                  <p>{e.price} €</p>
                  <a href={"/product/" + e.product_id}>
                    <div className="ProductHomeImgContainer">
                      <img className="ProductHomeImg" src={e.images && e.images[1] ? process.env.REACT_APP_API_LINK + e.images[1]  : imageDefault}></img>
                      <img className="ProductHomeImg ProductHomeImg2" src={e.images && e.images[1] ? process.env.REACT_APP_API_LINK + e.images[0] : imageDefault}></img>
                    </div>
                  </a>
                  <button className='btn-cart'>Add to cart</button>
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



export default Results;