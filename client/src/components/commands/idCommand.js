import './command.css';
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Table, TableHeader, DataTableCell, TableBody, TableCell } from '@david.kucsai/react-pdf-table';
import Footer from '../footer/Footer';


function CommandTracking() {
    const [divOrderProduct, setDivOrderProduct] = useState([]);
    const [isDelivred, setIsDelivred] = useState(false);
    const [total, setTotal] = useState(false);
    const [productsCost, setProductsCost] = useState(0);
    const [fdp, setFdp] = useState(0);
    const [shippingAddress, setShippingAddress] = useState({});
    const [billingAddress, setBillingAddress] = useState({});
    const [allProduct, setAllProduct] = useState({});
    const [createdAt, setCreatedAt] = useState("");
    const [showPDF, setShowPDF] = useState(false);

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let idOrder = useQuery().get("order");

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/user/order/" + idOrder, config).then(res => {
            console.log(res.data)
            setShippingAddress(res.data.shippingAddress);
            setBillingAddress(res.data.billingAddress);
            setTotal(res.data.cost);
            let productCost = res.data.subproducts.reduce((accumulator, currentValue) => {
                let price = currentValue.promo ? currentValue.price - (currentValue.price * (currentValue.promo / 100)) : currentValue.price;
                return accumulator + price;
            }, 0);
            let shippingCost = res.data.cost - productCost;
            
            setFdp(shippingCost.toFixed(2));
            setProductsCost(productCost.toFixed(2));
            
            // setFdp(res.data.subproducts.reduce((accumulator, currentValue) => {

            // }))
            setAllProduct(res.data.subproducts);
            setCreatedAt(new Date(res.data.createdAt));

            if (Number(res.data.status) == 1) {
                setIsDelivred(true);
            }
            const newProduct = res.data.subproducts.map((product, index) =>
                <tr className="tablebordertest" key={index}>
                    <td className="paddright">
                        <img className="imgOrder" src={process.env.REACT_APP_API_LINK + `/api/image/${product.subproduct.product.id}/default/1.jpg`} />
                    </td>
                    <td>
                        <span className="ml-3"><b>Title:</b> {product.subproduct.product.title}</span><br />
                        <span className="ml-3"><b>Color:</b> {product.subproduct.color.name}</span>
                    </td>
                    <td>
                        <span><b>Size:</b> {product.subproduct.size}</span>
                    </td>
                    <td>
                        <span><b>Sex:</b> {product.subproduct.product.sex}</span>
                    </td>
                    <td>
                        {product.promo ?
                            <span><b>Price:</b> {product.price - (product.price * (product.promo / 100))} € - <s className="text-danger">{product.price} €</s></span>
                            : <span><b>Price:</b> {product.price} €</span>
                        }
                    </td>
                </tr>
            );
            setDivOrderProduct(newProduct);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    function Print() {
        setShowPDF(!showPDF);
    }

    const styles = StyleSheet.create({
        background: {
            backgroundColor: '#E4E4E4'
        },
        page: {
            flexDirection: 'row'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 2
        },
        right: {
            textAlign: "right"
        },
        marginTop: {
            marginTop: 10
        },
        marginBottom: {
            marginBottom: 10
        },
        img: {
            marginLeft: 20,
            width: 50
        }
    });

    const MyDocument = () => (
        <Document>
            <Page size="A4">
                <div style={styles.page}>
                    <View style={styles.section}>
                        <Image src="https://img.icons8.com/metro/2x/8-circle.png" style={styles.img} />
                    </View>
                    <View style={styles.section}>
                        <Text>INVOICE</Text>
                        <Text>From 8-Commerce</Text>
                    </View>
                    <br />
                </div>
                <View style={styles.section}>
                    <Text>Shipping Address</Text>
                    <Table data={[{ shippingAddress: shippingAddress, total: total }]} >
                        <TableHeader>
                            <TableCell style={styles.background}>Firstname</TableCell>
                            <TableCell style={styles.background}>Lastname</TableCell>
                            <TableCell style={styles.background}>Country</TableCell>
                            <TableCell style={styles.background}>City</TableCell>
                            <TableCell style={styles.background}>Delivery address</TableCell>
                        </TableHeader>
                        <TableBody>
                            <DataTableCell getContent={(r) => r.shippingAddress.firstname} />
                            <DataTableCell getContent={(r) => r.shippingAddress.lastname} />
                            <DataTableCell getContent={(r) => r.shippingAddress.country} />
                            <DataTableCell getContent={(r) => r.shippingAddress.city} />
                            <DataTableCell getContent={(r) => r.shippingAddress.address} />
                        </TableBody>
                    </Table>
                    <Text>Billing Address</Text>
                    <Table data={[{ billingAddress: billingAddress, total: total }]}>
                        <TableHeader>
                            <TableCell style={styles.background}>Firstname</TableCell>
                            <TableCell style={styles.background}>Lastname</TableCell>
                            <TableCell style={styles.background}>Country</TableCell>
                            <TableCell style={styles.background}>City</TableCell>
                            <TableCell style={styles.background}>Delivery address</TableCell>
                        </TableHeader>
                        <TableBody>
                            <DataTableCell getContent={(r) => r.billingAddress.firstname} />
                            <DataTableCell getContent={(r) => r.billingAddress.lastname} />
                            <DataTableCell getContent={(r) => r.billingAddress.country} />
                            <DataTableCell getContent={(r) => r.billingAddress.city} />
                            <DataTableCell getContent={(r) => r.billingAddress.address} />
                        </TableBody>
                    </Table>
                    <Text>Sold By</Text>
                    <Table data={[{ name: "8-Commerce", address: "14 rue fructidor", country: "France", city: "93400 Saint-Ouen", tva: "FR12487773327" }]}>
                        <TableHeader>
                            <TableCell style={styles.background}>Company Name</TableCell>
                            <TableCell style={styles.background}>Address</TableCell>
                            <TableCell style={styles.background}>Country</TableCell>
                            <TableCell style={styles.background}>City</TableCell>
                            <TableCell style={styles.background}>TVA</TableCell>
                        </TableHeader>
                        <TableBody>
                            <DataTableCell getContent={(r) => r.name} />
                            <DataTableCell getContent={(r) => r.address} />
                            <DataTableCell getContent={(r) => r.country} />
                            <DataTableCell getContent={(r) => r.city} />
                            <DataTableCell getContent={(r) => r.tva} />
                        </TableBody>
                    </Table>
                    <Text style={styles.marginTop}>Order Made on: {createdAt.getDate() + "/" + (createdAt.getMonth() + 1) + "/" + createdAt.getFullYear()}</Text>
                    <Text style={styles.marginBottom}>Order Number: {idOrder}</Text>
                    <Text>Products Bought</Text>
                    <TableHeader>
                        <TableCell style={styles.background}>Title</TableCell>
                        <TableCell style={styles.background}>Tax</TableCell>
                        <TableCell style={styles.background}>Price</TableCell>
                    </TableHeader>
                    {allProduct.map((res, index) =>
                        <Table key={index}>
                            <TableBody data={[{ subproduct: res }]}>
                                <DataTableCell getContent={(r) => r.subproduct.subproduct.product.title} />
                                <DataTableCell getContent={(r) => (r.subproduct.price * 0.2) + " €"} />
                                <DataTableCell getContent={(r) => r.subproduct.price + " €"} />
                            </TableBody>
                        </Table>
                    )}
                    <Text style={styles.right}>Products Price: {productsCost} €</Text>
                    <Text style={styles.right}>Shipping Fees: {fdp} €</Text>
                    <Text style={styles.right}>Total Price: {total} €</Text>
                </View>
            </Page>
        </Document>
    );

    const App = () => (
        <>
            <button className="btn btn-outline-dark btnCloseFacture" onClick={Print}>Close</button>
            <PDFViewer width="100%" height="100%">
                <MyDocument />
            </PDFViewer>
        </>
    );

    return (
        <>
            {
                showPDF ? <App /> :
                    <>
                        <div className="container mt-5 d-flex justify-content-between">
                            <h1>Order number: {idOrder}</h1>
                            <i className="material-icons marg print mb-5" onClick={Print}>print</i>
                        </div>
                        <div className="container">
                            <div className="d-flex">
                                <div className="col-sm-6 border-right pr-4">
                                    <h2 className="text-center mb-4">Shipping Address</h2>
                                    <div>
                                        <table className="bordertable tablOrder">
                                            <tbody>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Firstname:</b></h6></th>
                                                    <td className="text-right p-2"><span>{shippingAddress.firstname}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Lastname:</b></h6></th>
                                                    <td className="text-right p-2"><span>{shippingAddress.lastname}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Country:</b></h6></th>
                                                    <td className="text-right p-2"><span>{shippingAddress.country}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>City:</b></h6></th>
                                                    <td className="text-right p-2"><span>{shippingAddress.city}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Delivery address:</b></h6></th>
                                                    <td className="text-right p-2"><span>{shippingAddress.address}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-sm-6 pl-4">
                                    <h2 className="text-center mb-4">Billing Address</h2>
                                    <div>
                                        <table className="bordertable tablOrder">
                                            <tbody>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Firstname:</b></h6></th>
                                                    <td className="text-right p-2"><span>{billingAddress.firstname}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Lastname:</b></h6></th>
                                                    <td className="text-right p-2"><span>{billingAddress.lastname}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Country:</b></h6></th>
                                                    <td className="text-right p-2"><span>{billingAddress.country}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>City:</b></h6></th>
                                                    <td className="text-right p-2"><span>{billingAddress.city}</span></td>
                                                </tr>
                                                <tr className="bordertable">
                                                    <th className="bordertable titleTable p-2"><h6><b>Delivery address:</b></h6></th>
                                                    <td className="text-right p-2"><span>{billingAddress.address}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-center mb-4 mt-5">Delivery status</h2>
                            <h5><b>Status: </b><span>{isDelivred ? 'Delivred' : 'In transition...'}</span></h5>
                            {isDelivred ?
                                <div className="mt-4">
                                    <i className="material-icons marg arrivedC">where_to_vote</i>
                                    <ProgressBar striped variant="success" now={100} />
                                </div>
                                : <div className="mt-4">
                                    <i className="material-icons marg">where_to_vote</i>
                                    <i className="material-icons marg intransition">room</i>
                                    <i className="material-icons marg intransition2 disabledC">room</i>
                                    <ProgressBar animated now={50} className="rotate90" />
                                </div>
                            }
                        </div>
                        <div className="container mb-5">
                            <h2 className="text-center mb-3">Your articles</h2>
                            <h5 className="text-right mt-5">
                                <span className="cost"><b>Subtotal : </b>{productsCost} €</span>
                                <span className="cost"><b>Shipping : </b>{fdp} €</span>
                                <span className="cost"><b>Total : </b>{total} €</span>
                            </h5>
                            <div className="divOrderCart pl-3 pr-3" >
                                <table className="productinCart">
                                    <tbody>{divOrderProduct}</tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-sm-12 mt-5">
                            <Footer />
                        </div>
                    </>
            }
        </>
    )
}

export default CommandTracking;