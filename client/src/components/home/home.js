import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Parallax, Background } from "react-parallax";
import SliderPromo from './sliderPromo'
import videoSource from "../../img/untitled.mp4";
import walkingvideo from "../../img/walk.mp4";
import techlab1 from "../../img/techlab1.mp4";
import backpack from "../../img/crofton.png";
import Footer from '../footer/Footer';
import { Link } from "react-router-dom";

const image1 = "https://i.imgur.com/wtIes8O.jpg";
function Home() {

    const [products, setProducts] = useState([]);
    let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";
    let nbrArctPop = 6;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + '/api/product?clicks=true&limit=' + nbrArctPop).then(resp => {
            //Display Lowest Price Image
            let prices = {}
            let promos = {}
            let products_temp = resp.data.data
            let unavailable_msg = 'Available Soon...'
            $.each(products_temp, (i, product) => {
                prices[product.id] = []
                promos[product.id] = []
                if (isEmpty(product.subproducts)) {
                    //Product doesnt have subproducts, display unavailable_msg
                    prices[product.id].push(unavailable_msg)
                } else {
                    //Product has subproducts
                    product.subproducts.map(p => {
                        prices[product.id].push(p.price)
                        if (p.promo > 0) {
                            promos[product.id].push(p.promo)
                        }
                    })
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
    return (
        <div className="container-fluid  bg-gray p-0 m-0">
            <Parallax strength={500}>
                <div className="HomeJumbotron firstJumbo">
                    <div>design the future.</div>
                </div>
                <Background className="custom-bg">
                    <video autoPlay="autoplay" loop="loop" muted className="" >
                        <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
                </Background>
            </Parallax >

            <div className="row  justify-content-center  m-0 mt-5 p-0">
     
                <div className="bloc_1_home">
                    {/* <a href=""> */}
                    <div className='bloc_a'>
                <Link to="/techlab" className="linkwhite"> 
                        <div>
                            <div className="frame"></div>
                            <span>Discover the techlab</span>
                            <video autoPlay="autoplay" loop="loop" muted className="" >
                                <source src={techlab1} type="video/mp4" />
                                 Your browser does not support the video tag.
                        </video>
                        </div>
                    </Link>
                    </div>
                    {/* </a> */}
                    <Link to="/product/8" className="linkwhite bloc_b"><img src={backpack} /> <div><span>Crofton 30L</span></div></Link>
                    <div className="bloc_c">

                        <div className="box_1">
                            <Link to="/search?subcategory=Jacket" className="linkwhite "> <span>New<br /> Jackets</span></Link>
                        </div>
                        <div className="box_2">
                            <div><span>Plant the change</span>
                                <p>for every 120€ purchase<br />1 tree will be planted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center align-items-center bloc_2_home m-0 mt-5 mb-5 p-0">
                <div className="col-md-1 m-0">
                    <title_home>Categories</title_home>
                </div>
                <div className="col-md-8 m-0">
                    <div className="row categories_home justify-content-center">
                        <Link to="/search?subcategory=Jacket"><div className="jacket"><p>Jacket</p></div></Link>
                        <Link to="/search?subcategory=Backpack"><div className="backpack"><p>Backpack</p></div></Link>
                        <Link to="/search?subcategory=Sweatshirt"><div className="sweatshirt"><p>Sweatshirt</p></div></Link>
                        <Link to="/search?subcategory=Tshirt"><div className="tshirt"><p>Tshirt</p></div></Link>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center m-0 p-0 pt-3">
                <SliderPromo />
            </div>
            <div className="row m-0 mt-5 p-0 justify-content-center">
                <div className="col-md-8 trending p-0 m-0">
                    <title_home>Trending Now</title_home>
                    <div className="homemadejumbo">
                        <div className="text_box">
                            <h3>M86 Fieldproof Shirt</h3>
                            <h4>UV resistant, sweatproof</h4>
                            <Link to="/product/12">shop now</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row bg-gray m-0 p-0 justify-content-center">
                <div className="col-md-9 m-0 p-4">
                    <div className="row m-0 p-0 ">

                        {products.map((e) => {
                            return (
                                <div className="col-md-4 m-0 p-0" key={e.id}>
                                    <div className='m-4'>
                                        <span className="HomeArticleTItle">{e.title.length > 50 ? e.title.substr(0, 50) + '...' : e.title}</span>
                                        <p>{e.lowest_price}</p>
                                        {e.images && e.status === true &&
                                            <> <Link to={"/product/" + e.id}>
                                                <div className="ProductHomeImgContainer">
                                                    {<img className="ProductHomeImg" src={e.images ? process.env.REACT_APP_API_LINK + '' + e.images[1] : imageDefault}></img>}
                                                    {<img className="ProductHomeImg ProductHomeImg2" src={e.images && e.images.length > 1 ? process.env.REACT_APP_API_LINK + '' + e.images[0] : imageDefault}></img>}
                                                </div>
                                            </Link>
                                                <a href={"/product/" + e.id}><button className='btn-cart'>View Product</button></a>
                                            </>
                                        }
                                        {e.images && e.status === false &&
                                            <> <a href={"/product/" + e.id}>
                                                <div className="ProductHomeImgContainer unavailable">
                                                    <img className="ProductHomeImg" src={process.env.REACT_APP_API_LINK + '' + e.images[0]}></img>
                                                    {e.images && e.images.length > 1 &&
                                                        <img className="ProductHomeImg ProductHomeImg2" src={process.env.REACT_APP_API_LINK + '' + e.images[1]}></img>
                                                    }
                                                </div>
                                            </a>
                                                <a href={"/product/" + e.id}> <button className='btn-cart unavailable' disabled>Product unavailable</button></a>
                                            </>
                                        }
                                        {!e.images &&
                                            <>
                                                <img className="ProductHomeImg" src="https://etienneetienne.com/wp-content/uploads/2013/08/square-blank.png"></img>
                                                <button className='btn-cart unavailable' disabled>Coming Soon</button>
                                            </>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row m-3 seemore justify-content-center"><span><Link to="/search">see more</Link></span></div>
                </div>
            </div>
            <Parallax strength={500}>
                <div className="HomeJumbotron">
                    <div>We can do anything,
                    <br />Together.</div>
                </div>
                <Background className="custom-bg">
                    <video autoPlay="autoplay" loop="loop" muted className="" >
                        <source src={walkingvideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                </Background>
            </Parallax >
            <div className="row m-0 p-0  justify-content-center">
                <div className="col-md-8 m-0 p-4">  <div className="row m-0 p-0  justify-content-center">
                    <div className="col-md-3 m-0 text-center minichar  p-0"><div className="iconature icon_one"></div><h5>Recycling</h5><hr /><br /><p>Our materials are made from 90% of recylced natural fabric and recylced plastic from the ocean, sparing resosurces each collection. </p> </div>
                    <div className="col-md-3 m-0 text-center minichar  p-0"><div className="iconature icon_two"></div><h5>Helping other</h5><hr /><br /><p>We are teaming up with charities all around the world to help protect the environement. Each moth a part of our sales will help one charity in need.</p> </div>
                    <div className="col-md-3 m-0 text-center minichar  p-0"><div className="iconature icon_three"></div><h5>Shipping</h5><hr /><br /><p>We are trying to improve our shipping methods each year to prevent co2 emissions and waste pollution</p> </div>
                    <div className="col-md-3 m-0 text-center minichar  p-0"><div className="iconature icon_four"></div><h5>Planting</h5><hr /><br /><p>For every 120€ purchased, one tree will be planted in the amazonian forest by a charity pleadging to save it from destruction.</p> </div>
                </div></div>
            </div>
            {/* <div className="row m-0 mb-5 p-0 charity_home justify-content-center">
                <div className="col-md-8 mb-5 m-0 p-0">
                    <div className="row m-5 p-0 justify-content-center">
                        <div className="col-md-5 m-0 p-0">
                            <div className="bigimg"> <div className="bigframe"></div></div>
                        </div>

                        <div className="col-md-5 m-0 p-0"><div><title_home>Lorem Ipsum
                          <br />  dolor sit</title_home><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam malesuada tincidunt massa at pretium. Proin tempor mattis ex sed laoreet.</p></div>
                            <div className="bigimg2"></div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="row m-0 mt-2 p-0 pt-5 bg-light justify-content-center">  <Footer /></div>
        </div >
    )
}

export default Home;