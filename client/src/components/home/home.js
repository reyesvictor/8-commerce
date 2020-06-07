import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';

import { Parallax } from "react-parallax";

const image1 = "https://i.imgur.com/wtIes8O.jpg";


function Home() {

    const [products, setProducts] = useState([]);

    let imageProduit1 = '';
    let imageProduit2 = ''
    let nbrArctPop = 5;
    const isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/product/home?limit='+nbrArctPop).then(resp => {
            //Display Lowest Price Image
            let prices = {}
            let products_temp = resp.data.data
            let unavailable_msg = 'Available Soon...'
            console.log(products_temp)
            $.each(products_temp, (i, product) => {
                prices[product.id] = []
                if (isEmpty(product.subproducts)) {
                    //Product doesnt have subproducts, display unavailable_msg
                    prices[product.id].push(unavailable_msg)
                } else {
                    //Product has subproducts
                    product.subproducts.map(p => prices[product.id].push(p.price))
                }
            })

            //Boucler sur l'objet pour voir si il y a un prix minimal ou si il n'est pas disponible
            if (Object.keys(prices).length > 0) {
                const entries = Object.entries(prices)
                for (const [id, prices_list] of entries) {
                    for (let j = 0; j < products_temp.length; j++) {
                        
                        if ( products_temp[j].id == id ){
                            if ( prices_list[0] == unavailable_msg ) {
                                products_temp[j]['lowest_price'] = unavailable_msg
                            } else {
                                products_temp[j]['lowest_price'] = 'Starts at '+Math.min.apply(Math, prices_list)+' €'
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
    return (

        <div className="container-fluid h-100 p-0 m-0">
            <Parallax bgImage={image1} strength={500}>
                <div className="HomeJumbotron">
                    <div>We can do anything,
        <br />Together.</div>
                </div>
            </Parallax>

            <div className="row justify-content-around">

                {products.map((e) => {
                    let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";

                    return (
                        <div className="col-md-4" key={e.id}>
                            <div className='ProductHome'>
                                {/* <img src={'../../../../images/1/default/2020-06-0603-16-51.jpg'} />  */}
                                <div className='p-4 m-5 bg-gray'>
                                    <span className="HomeArticleTItle">{e.title.length > 15 ? e.title.substr(0,15) : e.title }</span>
                                    <p>{e.lowest_price}</p>
                                    <a href={"/product/" + e.id}>
                                        <div className="ProductHomeImgContainer">
                                            {<img className="ProductHomeImg" src={ e.images ? 'http://127.0.0.1:8000'+e.images[1] : imageDefault}></img>}
                                            {<img className="ProductHomeImg ProductHomeImg2" src={ e.images && e.images.length > 1  ? 'http://127.0.0.1:8000'+e.images[0] : imageDefault}></img>}
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
            </div>
        </div>
    )
}

export default Home;