import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { useRouteMatch } from "react-router-dom";
import ReactImageMagnify from 'react-image-magnify';

function ProductDescription() {
    const [product, setProduct] = useState([]);
    const [lowestPrice, setLowestPrice] = useState([]);
    const [chosenProductSize, setChosenProductSize] = useState('');
    const [chosenProductColor, setChosenProductColor] = useState('');
    const [chosenSubProduct, setChosenSubProduct] = useState();

    //tant que taille et couleur ne sont pas choisies, ne pas afficher de prix...

    let id = useRouteMatch("/product/:id").params.id;
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/product/' + id).then(resp => {
            setProduct(resp.data);

            //Getting the lowest price
            let prices = {}
            let product_temp = resp.data
            let unavailable_msg = 'Available Soon...'
            console.log(product_temp)
            prices[product_temp.id] = []
            if (isEmpty(product_temp.subproducts)) {
                console.log('vide', product_temp)
                //Product doesnt have subproducts, display unavailable_msg
                prices[product_temp.id].push(unavailable_msg)
            } else {
                //Product has subproducts
                product_temp.subproducts.map(p => prices[product_temp.id].push(p.price))
            }

            //Boucler sur l'objet pour voir si il y a un prix minimal ou si il n'est pas disponible
            if (Object.keys(prices).length > 0) {
                const entries = Object.entries(prices)
                for (const [id, prices_list] of entries) {
                    console.log(prices_list)
                    if (prices_list[0] == unavailable_msg) {
                        product_temp['lowest_price'] = unavailable_msg
                    } else {
                        product_temp['lowest_price'] = 'Starts at ' + Math.min.apply(Math, prices_list) + ' €'
                    }
                }
            }

            setLowestPrice(product_temp['lowest_price'])
        });

        const isEmpty = (obj) => {
            for (var key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        return () => {
        }
    }, []);

    const [completeDes, setCompleteDes] = useState('.. More ⇒');
    const imageProduct = [];
    const miniImageProduct = [];
    const loadingScreen = [];
    let propsImage = {}
    let countstockAll = 0;
    let SizeOption = [];
    let ColorOption = [];
    let testProps = "";
    let subCategory = "";
    let Categoryname = '';
    let Unavailable = []
  
    if (product) {
        console.log(product)
        if (product.length == 0) {
            loadingScreen.push(<div className="loading-screen"></div>);
        }
        else {

            subCategory = product.subCategory.name;
            Categoryname = product.subCategory.Category.name;
            testProps = product.description;
            let count = 0;
            if (product.subproducts && product.subproducts.length > 0) {
                for (let i = 0; i < product.subproducts.length; i++) {
                    countstockAll = countstockAll + product.subproducts[i].stock;
                    if (!(SizeOption.find(fruit => fruit.props.value === product.subproducts[i].size)))
                        SizeOption.push(<option value={product.subproducts[i].size}>{product.subproducts[i].size}</option>);

                    if (!(ColorOption.find(fruit => fruit.props.value === product.subproducts[i].color)))
                        ColorOption.push(<option value={product.subproducts[i].color}>{product.subproducts[i].color}</option>);
                }
            }
        }
        if (product.status == false) {
        Unavailable.push(<div className="overlayUnavailable"><h5>This product is unavailable</h5></div>);
        countstockAll = 0;
        }
    }

    let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";

    let obj = { 'img-0': imageDefault }
    if (product && product.images && product.images[0]) { //[0] = default, à modifier en state
        obj = {}
        for (let i = 0; i < product.images[0].links.length; i++) {
            obj['img-' + i] = "http://127.0.0.1:8000" + product.images[0].links[i];
        }
    }

    const details = {
        title: product.title,
        price: lowestPrice,
        description_1: testProps.substr(0, 192),
        description_2: testProps.substr(192)
    };

    for (let [key, value] of Object.entries(obj)) {
        const ref = React.createRef();
        const handleClick = () =>
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        imageProduct.push(<span ref={ref}><ReactImageMagnify {...showImage(value)} /></span>);
        miniImageProduct.push(<div onClick={handleClick}><img className='imgIcone' src={value} /></div>);
    }

    function showImage(pathImg) {
        const imageProps = {
            smallImage: {
                alt: '',
                isFluidWidth: true,
                src: pathImg
            },
            largeImage: {
                src: pathImg,
                width: 2200,
                height: 2200
            },
            enlargedImageContainerStyle: { background: '#fff', zIndex: 9 },
            className: 'imgScroll',
            imageClassName: 'styleImage'
        };
        return imageProps;
    }

    function Complete() {
        $('.complete').slideToggle('fast');
        if (completeDes == ".. More ⇒") {
            setCompleteDes('Less ⇐');
        }
        else if (completeDes == "Less ⇐") {
            setCompleteDes('.. More ⇒');
        }
    }

    const setChosenProduct = async () => {
        // console.log('Seeting chosen product')
        await setChosenProductColor('') //permet de ne pas boucler inf
        await setChosenSubProduct(product.subproducts.filter(item => item.size == chosenProductSize && item.color.id == chosenProductColor)[0])
    }

    const verifyIfAProductIsChosen = () => {
        // console.log('verifyIfAProductIsChosen')
        // console.log(chosenSubProduct)
        if (chosenSubProduct && chosenSubProduct != null) {
            return true;
        } else {
            return false;
        }
    }

    const subproductsAvailable = () => {

        let pathCat = "/" + Categoryname;
        let pathSub = "/" + subCategory;

        return (
            <div className="divDetails">
                <span><a href={pathCat}>{Categoryname}</a> / <a href={pathSub}>{subCategory}</a></span>
                {Unavailable}
                <h1>{details.title}</h1>
                <h3 className='prix'>{verifyIfAProductIsChosen() ? chosenSubProduct.price + '€' : details.price}</h3>
                <p className='description'>
                    {details.description_1}
                    <span className='complete'>{details.description_2}</span>
                </p>
                <p className="more" onClick={Complete}>{completeDes}</p>
                <p>{verifyIfAProductIsChosen() ? chosenSubProduct.stock + " pièces disponibles" : countstockAll + " pièces totales disponibles"}</p>
                {chosenProductSize != '' && chosenProductColor != '' ? console.log('PRODUCT IS CHOSEN') + setChosenProduct() : console.log('NO CHOICE')}

                <p>Size</p>
                <select id='selectSize' onChange={e => e.preventDefault() + console.log(e.target.value) + setChosenProductSize(e.target.value)}>
                    <option value='No-Choice-Size' className='selectChoice' selected disabled>--- SIZE ({SizeOption.length})---</option>
                    {SizeOption}
                </select>
                {chosenProductSize ?
                    <>
                        <p>Color</p>
                        <select id='selectColor' onChange={e => e.preventDefault() + setChosenProductColor(e.target.value)}>
                            <option value='No-Choice-Color' key="001" className='selectChoice'>--- COLOR ({createOptions().length}) ---</option>
                            {createOptions()}
                        </select>
                    </>
                    : null
                }
               {product.status == true ?  <button className='btn-cart'>Add to cart</button> :  <button className='btn-cart'>Out of stock</button>}
            </div>
        )
    }

    // Product doesnt have subproducts
    const subproductsUnavailable = () => {
        return (
            <div className="divDetails">
                <h1>{details.title}</h1>
                <h3 className='prix'>{verifyIfAProductIsChosen() ? chosenSubProduct.price + '€' : details.price} </h3>
                {Unavailable}
                <p className='description'>
                    {details.description_1}
                    <span className='complete'>{details.description_2}</span>
                </p>
                <p className="more" onClick={Complete}>{completeDes}</p>
                <p>{verifyIfAProductIsChosen() ? chosenSubProduct.stock + " pièces disponibles" : countstockAll + " pièces totales disponibles"}</p>
                {chosenProductSize != '' && chosenProductColor != '' ? console.log('PRODUCT IS CHOSEN') + setChosenProduct() : console.log('NO CHOICE')}

                <select id='selectSize' onChange={e => e.preventDefault() + console.log(e.target.value) + setChosenProductSize(e.target.value)}>
                    <option value='' className='selectChoice' >--- SIZE ({SizeOption.length})---</option>
                    {SizeOption}
                </select>
                <button className='btn-cart' style={{ background: 'lightgrey', border: 'lightgrey' }}>Unavalaible</button>
            </div>
        )
    }

    const createOptions = () => {
        let arr = product.subproducts.filter(item => item.size == chosenProductSize)
        let options = []
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
            options.push(<option key={'color-' + arr[i].color.id} value={arr[i].color.id} className='selectChoice'>{arr[i].color.name}</option>)
        }
        return options
    }

    return (
        <div>
            <div className="container-fluid m-0 p-0">
                <div className="row">
                    <div className="col-md-7 productImgBg m-0 p-0">
                    {product.status == true ?  <> <div className='ulImgProduct'>
                            {miniImageProduct}
                        </div>
                        <div className='ImageContainer'>
                            {imageProduct}
                        </div></> : <>
                            <div className='ulImgProduct unavailable'>
                            {miniImageProduct}
                        </div>
                        <div className='ImageContainer unavailable'>
                            {imageProduct}
                        </div></>}                        
                    </div>
                    <div className="col-md-5 m-0 p-0">
                        {product.subproducts && product.subproducts.length > 0 ? subproductsAvailable() : subproductsUnavailable()}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 sndrow"><br /> <br /> <br /> <br /> <br /> <br /> <br />   <br /> <br /> <br /> <br /> <br /> <br /> <br />   <br /> <br /> <br /> <br /> <br /> <br /> <br /></div>
                </div>
            </div>
        </div>


    )
}

export default ProductDescription;  