import React, { useState, useEffect, useRef, useReducer } from "react";
import $ from "jquery";
import axios from "axios";
import { useRouteMatch } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./products.css";
import {
  EmailIcon, FacebookIcon, FacebookMessengerIcon, InstapaperIcon, LineIcon, LinkedinIcon, LivejournalIcon, MailruIcon,
  OKIcon, PinterestIcon, PocketIcon, RedditIcon, TelegramIcon, TumblrIcon, TwitterIcon, ViberIcon, VKIcon, WeiboIcon, WhatsappIcon, WorkplaceIcon
} from "react-share";
import {
  EmailShareButton, FacebookShareButton, InstapaperShareButton, LineShareButton, LinkedinShareButton, LivejournalShareButton,
  MailruShareButton, OKShareButton, PinterestShareButton, PocketShareButton, RedditShareButton, TelegramShareButton, TumblrShareButton, TwitterShareButton,
  ViberShareButton, VKShareButton, WhatsappShareButton, WorkplaceShareButton
} from "react-share";

import ReviewPart from './product.reviews';
import PersonalizedSugg from './product.sugg';
import Footer from '../footer/Footer';
import { Link } from "react-router-dom";

function ProductDescription() {
  const [product, setProduct] = useState([]);
  const [lowestPrice, setLowestPrice] = useState([]);
  const [chosenProductSize, setChosenProductSize] = useState("");
  const [chosenProductColor, setChosenProductColor] = useState("");
  const [HighestPromo, setHighestPromo] = useState("");

  const [chosenSubProduct, setChosenSubProduct] = useState();
  const [imageProduct, setImageProduct] = useState();
  const [miniImageProduct, setMiniImageProduct] = useState();
  const imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  function reload() {
    forceUpdate();
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  //tant que taille et couleur ne sont pas choisies, ne pas afficher de prix...
  let id = useRouteMatch("/product/:id").params.id;
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_LINK + "/api/product/" + id).then((resp) => {
      setProduct(resp.data);
      //Getting the lowest price
      let prices = {};
      let product_temp = resp.data;
      let unavailable_msg = "Available Soon...";
      prices[product_temp.id] = [];
      if (isEmpty(product_temp.subproducts)) {
        console.log("vide", product_temp);
        //Product doesnt have subproducts, display unavailable_msg
        prices[product_temp.id].push(unavailable_msg);
      } else {
        //Product has subproducts
        product_temp.subproducts.map((p) =>
          prices[product_temp.id].push(p.price)
        );
      }
      //Boucler sur l'objet pour voir si il y a un prix minimal ou si il n'est pas disponible
      if (Object.keys(prices).length > 0) {
        const entries = Object.entries(prices);
        for (const [id, prices_list] of entries) {
          if (prices_list[0] == unavailable_msg) {
            product_temp["lowest_price"] = unavailable_msg;
          } else {
            product_temp["lowest_price"] = Math.min.apply(Math, prices_list);
          }
        }
      }

      let test = Math.max.apply(
        Math,
        resp.data.subproducts.map((o) => o.promo)
      );
      setHighestPromo(parseInt(test));
      setLowestPrice(product_temp["lowest_price"]);
    });

    return () => { };
  }, [ignored]);

  const [completeDes, setCompleteDes] = useState(".. More ⇒");
  const loadingScreen = [];
  let countstockAll = 0;
  let SizeOption = [];
  let ColorOption = [];
  let testProps = "";
  let subCategory = "";
  let Categoryname = "";
  let Unavailable = [];

  if (product) {
    // console.log(product)
    if (product.length == 0) {
      loadingScreen.push(<div className="loading-screen"></div>);
    } else {
      subCategory = product.subCategory.name;
      Categoryname = product.subCategory.Category.name;
      testProps = product.description;
      let count = 0;
      let arr_color_no_rep = [];
      let arr_size_no_rep = [];
      if (product.subproducts && product.subproducts.length > 0) {
        for (let i = 0; i < product.subproducts.length; i++) {
          countstockAll = countstockAll + product.subproducts[i].stock;
          if (
            !SizeOption.find(
              (item) => item.props.value === product.subproducts[i].size
            )
          ) {
            if (!arr_size_no_rep.includes(product.subproducts[i].size)) {
              arr_size_no_rep.push(product.subproducts[i].size);
              SizeOption.push(
                <option
                  key={"option-size" + product.subproducts[i].size}
                  value={product.subproducts[i].size}
                >
                  {product.subproducts[i].size}
                </option>
              );
            }
          }

          if (
            !ColorOption.find(
              (item) => item.props.value === product.subproducts[i].color.id
            )
          ) {
            if (!arr_color_no_rep.includes(product.subproducts[i].color.id)) {
              arr_color_no_rep.push(product.subproducts[i].color.id);
              ColorOption.push(
                <option
                  key={"option-color-" + product.subproducts[i].id}
                  value={product.subproducts[i].color.id}
                >
                  {product.subproducts[i].color.name}
                </option>
              );
            }
          }
        }
      }
    }
    if (product.status == false) {
      Unavailable.push(
        <div className="overlayUnavailable">
          <h5>This product is unavailable</h5>
        </div>
      );
      countstockAll = 0;
    }
  }

  const details = {
    title: product.title,
    price: lowestPrice,
    promo: product.promo,
    price_promo:
      Number(lowestPrice) - Number(lowestPrice) * (Number(product.promo) / 100),
    description_1: testProps.substr(0, 192),
    description_2: testProps.substr(192),
  };

  useEffect(() => {
    let obj = { "img-0": imageDefault };

    if (product && product.images) {
      //[0] = default, à modifier en state
      obj = {};
      if (chosenProductColor) {
        for (let i = 0; i < product.images.length; i++) {
          console.log(
            "testing img",
            product.images[i].color_id,
            chosenProductColor,
            product.images[i].links.length
          );
          if (
            product.images[i].color_id === chosenProductColor &&
            product.images[i].links.length > 0
          ) {
            for (let j = 0; j < product.images[i].links.length; j++) {
              console.log("inside-2", i, j, product.images[i].links[j]);
              obj["img-" + j] =
                process.env.REACT_APP_API_LINK + "" + product.images[i].links[j];
            }
          }
          let verif = 0;
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) verif++;
          }
          if (isEmpty(obj)) obj = { "img-0": imageDefault };
        }
      } else if (product.images[0]) {
        for (let i = 0; i < product.images[0].links.length; i++) {
          obj["img-" + i] =
            process.env.REACT_APP_API_LINK + "" + product.images[0].links[i];
        }
      }
    }

    let imgprod = [];
    let minimgprod = [];
    for (let [key, value] of Object.entries(obj)) {
      const ref = React.createRef();
      const handleClick = () =>
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      imgprod.push(
        <span key={value + "span"} ref={ref}>
          <ReactImageMagnify {...showImage(value)} />
        </span>
      );
      setImageProduct(imgprod);
      minimgprod.push(
        <div key={value + "div"} onClick={handleClick}>
          <img className="imgIcone" src={value} />
        </div>
      );
      setMiniImageProduct(minimgprod);
    }
  }, [product, chosenProductColor]);

  function showImage(pathImg) {
    const imageProps = {
      smallImage: {
        alt: "",
        isFluidWidth: true,
        src: pathImg,
      },
      largeImage: {
        src: pathImg,
        width: 2200,
        height: 2200,
      },
      enlargedImageContainerStyle: { background: "#fff", zIndex: 9 },
      className: "imgScroll",
      imageClassName: "styleImage",
    };
    return imageProps;
  }

  function Complete() {
    $(".complete").slideToggle("fast");
    if (completeDes == ".. More ⇒") {
      setCompleteDes("Less ⇐");
    } else if (completeDes == "Less ⇐") {
      setCompleteDes(".. More ⇒");
    }
  }

  const setChosenProduct = async () => {
    console.log("PROFESSIONNAL TESTING", chosenProductColor, chosenProductSize);
    setChosenProductSize(""); //permet de ne pas boucler inf
    await setChosenSubProduct(
      product.subproducts.filter(
        (item) =>
          item.size == chosenProductSize && item.color.id == chosenProductColor
      )[0]
    );
  };

  const verifyIfAProductIsChosen = () => {
    if (chosenSubProduct && chosenSubProduct != null) {
      return true;
    } else {
      return false;
    }
  };

  const subproductsAvailable = () => {
    let pathCat = "/search?category=" + Categoryname;
    let pathSub = "/search?subcategory=" + subCategory;

    // console.log(HighestPromo);
    return (
      <div className="divDetails">
        <span>
          <Link to={pathCat}>{Categoryname}</Link> /{" "}
          <Link to={pathSub}>{subCategory}</Link>
        </span>
        {Unavailable}
        <h1>{details.title}</h1>
        <h3 className="prix">
          {verifyIfAProductIsChosen() ? (
            chosenSubProduct.promo > 0 ? (
              <>
                <span className="was">
                  <s>{chosenSubProduct.price} €</s>
                </span>
                <span className="now">
                  {" "}
                  {Math.round(
                    chosenSubProduct.price * (chosenSubProduct.promo / 100)
                  )}{" "}
                  €{" "}
                </span>
              </>
            ) : (
                chosenSubProduct.price + "€"
              )
          ) : HighestPromo > 0 ? (
            <>
              Starts at{" "}
              <span className="was">
                <s>{details.price} €</s>
              </span>
              <span className="now">
                {" "}
                {Math.round(details.price * (HighestPromo / 100))} €
              </span>
            </>
          ) : (
                "Starts at " + details.price + "€"
              )}{" "}
        </h3>
        <p className="description">
          {details.description_1}
          <span className="complete">{details.description_2}</span>
        </p>
        {testProps.length > 192 ? (
          <p className="more" onClick={Complete}>
            {completeDes}
          </p>
        ) : null}
        {chosenProductSize != "" && chosenProductColor != ""
          ? console.log("PRODUCT IS CHOSEN") + setChosenProduct()
          : null}
        <p className="pt-5">Color</p>
        <select
          id="selectColor"
          defaultValue="No-Choice-Color"
          onChange={(e) =>
            e.preventDefault() +
            console.log(e.target.value) +
            setChosenProductColor(e.target.value)
          }
        >
          <option
            value="No-Choice-Color"
            key="001"
            className="selectChoice"
            disabled
          >
            --- COLOR ({ColorOption.length})---
          </option>
          {ColorOption}
        </select>
        {chosenProductColor ? (
          <>
            <p>Size</p>
            <select
              id="selectSize"
              defaultValue="No-Choice-Size"
              onChange={(e) =>
                e.preventDefault() +
                console.log(e.target.value) +
                setChosenProductSize(e.target.value)
              }
            >
              {createOptions()}
              {/* {SizeOption} */}
            </select>
          </>
        ) : null}
        <p className="text-secondary">
          {verifyIfAProductIsChosen() ? (
            <span>
              <b>{chosenSubProduct.stock}</b> items available
            </span>
          ) : (
              <span>
                <b>{countstockAll}</b> total items available
              </span>
            )}
        </p>
        {product.status == true ? (
          <>
            <button onClick={addCart} className="btn-cart">
              Add to cart
            </button>
            <div className="row my-3 mr-1 float-right share-div">
              <FacebookShareButton url={window.location.href}>
                <FacebookIcon size={28} iconFillColor="black" className="ml-1"></FacebookIcon>
              </FacebookShareButton>
              <EmailShareButton url={window.location.href}>
                <EmailIcon size={28} iconFillColor="black" className="ml-1"></EmailIcon>
              </EmailShareButton>
              <RedditShareButton url={window.location.href}>
                <RedditIcon size={28} iconFillColor="black" className="ml-1"></RedditIcon>
              </RedditShareButton>
              <TwitterShareButton url={window.location.href}>
                <TwitterIcon size={28} iconFillColor="black" className="ml-1"></TwitterIcon>
              </TwitterShareButton>
              <WhatsappShareButton url={window.location.href}>
                <WhatsappIcon size={28} iconFillColor="black" className="ml-1"></WhatsappIcon>
              </WhatsappShareButton>
            </div>
          </>
        ) : (
            <button className="btn-cart">Out of stock</button>
          )}
      </div>
    );
  };

  const addCart = () => {
    let panier = sessionStorage.getItem("panier", []);
    if (chosenSubProduct && chosenSubProduct.id) {
      if (panier == null) {
        sessionStorage.setItem(
          "panier",
          JSON.stringify([{ productid: chosenSubProduct.id, quantite: 1 }])
        );
      } else {
        let cart = JSON.parse(panier);
        let ishere = true;
        cart.map((e) => {
          if (e.productid == chosenSubProduct.id) {
            ishere = false;
          }
        });
        cart.map((e) => {
          if (e.productid == chosenSubProduct.id) {
            e.quantite = Number(e.quantite) + 1;
          }
          if (ishere) {
            cart.push({ productid: chosenSubProduct.id, quantite: 1 });
            ishere = false;
          }
        });
        sessionStorage.setItem("panier", JSON.stringify(cart));
      }
      document.location.reload(true);
    } else {
      console.log("pas select");
      toast.error("Please select size and color !", { position: "top-center" });
    }
  };

  const subproductsUnavailable = () => {
    return (
      <div className="divDetails">
        <h1>{details.title}</h1>
        <h3 className="prix">
          {verifyIfAProductIsChosen()
            ? chosenSubProduct.price + "€"
            : details.price}{" "}
        </h3>
        {Unavailable}
        <p className="description">
          {details.description_1}
          <span className="complete">{details.description_2}</span>
        </p>
        <p className="more" onClick={Complete}>
          {completeDes}
        </p>
        <p>
          {verifyIfAProductIsChosen()
            ? chosenSubProduct.stock + " pièces disponibles"
            : countstockAll + " pièces totales disponibles"}
        </p>
        {chosenProductSize != "" && chosenProductColor != ""
          ? console.log("PRODUCT IS CHOSEN") + setChosenProduct()
          : null}
        <select
          id="selectSize"
          onChange={(e) =>
            e.preventDefault() +
            console.log(e.target.value) +
            setChosenProductSize(e.target.value)
          }
        >
          <option value="" className="selectChoice" disabled>
            --- SIZE ({SizeOption.length})---
          </option>
          {SizeOption}
        </select>
        <button
          className="btn-cart"
          style={{ background: "lightgrey", border: "lightgrey" }}
        >
          Unavalaible
        </button>
      </div>
    );
  };

  const createOptions = () => {
    let arr = product.subproducts.filter(
      (item) => item.color.id == chosenProductColor
    );
    let options = [];
    let arr_size_no_rep = [];
    options.push(
      <option
        value="No-Choice-Size"
        key="size-no-choice"
        className="selectChoice"
        disabled
      >
        --- SIZE ({arr.length})---
      </option>
    );
    for (let i = 0; i < arr.length; i++) {
      let size_value = arr[i].size;
      if (!arr_size_no_rep.includes(size_value)) {
        arr_size_no_rep.push(size_value);
        options.push(
          <option key={"sub-option-size-" + i + size_value} value={size_value}>
            {size_value}
          </option>
        );
      }
    }
    return options;
  };

  return (
    <div>
      <ToastContainer />
      <div className="container-fluid m-0 p-0">
        <div className="row m-0 p-0">
          <div className="col-md-7 m-0 p-0">
            {product.status == true ? (
              <>
                {" "}
                <div className="ulImgProduct">{miniImageProduct}</div>
                <div className="ImageContainer">{imageProduct}</div>
              </>
            ) : (
                <>
                  <div className="ulImgProduct unavailable">
                    {miniImageProduct}
                  </div>
                  <div className="ImageContainer unavailable">{imageProduct}</div>
                </>
              )}
          </div>
          <div className="col-md-5 productImgBg  border-right m-0 p-0">
            {product.subproducts && product.subproducts.length > 0
              ? subproductsAvailable()
              : subproductsUnavailable()}
          </div>
        </div>
        <div className="row m-4 p-0 border-top">
          <ReviewPart id={id} />
        </div>
        <div className="col-sm-12">
          <PersonalizedSugg reload={reload}/>
        </div>
        <div className="col-sm-12 mt-5">
          <Footer />
        </div>

      </div>
    </div>
  );
}

export default ProductDescription;
