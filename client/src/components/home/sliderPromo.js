import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import './sliderPromo.css';

import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';

export default function SliderPromo() {
  const [data, setData] = useState([]);
  const [isDataReady, setDataReady] = useState(false);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_LINK + "/api/product?promoted=true"
      )
      .then(res => {
        // console.log(res.data.data);
        setData(res.data.data);
        setDataReady(true);

        // console.log(data);
      })
  }, [isDataReady])

  let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";

  const SliderData = data.map(product => {
    return (<div className="row slider-bg d-flex  align-items-center" key={product.id}>
      <div className="m-0 p-0 col-2 "></div>
      <div className="m-0 mt-5 p-0 col-5 h-100" >
        <img src={product.images && product.images[0] ? process.env.REACT_APP_API_LINK + product.images[0] : imageDefault} className="img-div" />
      </div>
      <div className="col-3 text-left h-50">
        <h1 className="">{product.title}</h1>
        <p>{product.description}</p>
        <a href={"/product/" + product.id}><button className='w-50 btn-cart'>View Product</button></a>
      </div>
      <div className="m-0  col-2 p-0 "></div>
    </div>
    )
  })
  const AutoplaySlider = withAutoplay(AwesomeSlider);

  return (
    <div className='container-fluid m-0 p-0 pt-2' id="slider">
      {data.length > 0 &&
        <AutoplaySlider
          play={true}
          cancelOnInteraction={false} // should stop playing on user interaction
          interval={6000}
        >
          {SliderData}
        </AutoplaySlider>
      }
    </div>
  )
}
