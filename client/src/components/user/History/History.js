import axios from "axios";
import React, { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Table, TableHeader, DataTableCell, TableBody, TableCell } from '@david.kucsai/react-pdf-table';
import { Link } from "react-router-dom";

function ShowOrder(props) {
    const [history, setHistory] = useState([]);
    const [showPDF, setShowPDF] = useState(false);
    const [tableOrder, setTableOrder] = useState(false);

    function getDate(date) {
        let d = new Date(date);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    }

    function getInvoice(id) {
        console.log(id);
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + "/api/user/" + props.idUser + "/orders").then(res => {
            setTableOrder(res.data.userOrders)
            const newDataHistory = res.data.userOrders.map(e =>
                <tr key={e.id}>
                    <td scope="row" className=""><p className=" ml=3 mt-3 mb-3 align-items-center">{e.trackingNumber}</p></td>
                    <td><p className=" mr-3 mt-3 mb-3 ml-1 align-items-center">{e.status != "" ? "Delivered" : " In transition"}</p></td>
                    <td><p className=" mr-3 mt-3 mb-3 ml-1 align-items-center">{e.packaging !== null ? e.packaging.name : " without"}</p></td>
                    <td><p className=" mr-3 mt-3 mb-3 ml-1 align-items-center">{getDate(e.createdAt)}</p></td>
                    <td><p className=" mr-3 mt-3 mb-3 ml-1 align-items-center">{e.cost} €</p></td>
                    <td>
                        <p className=" mt-3 mb-3 mr-3 align-items-center">
                            <Link to={'/command?order=' + e.trackingNumber}>
                            <button className="btn btn-outline-secondary m-0">
                                Show
                            </button>
                            </Link>
                        </p>
                    </td>
                    {/* <td className="text-nowrap">
                        <p className=" mt-3 mb-3 mr-3 align-items-center">
                            <button className="btn btn-outline-secondary m-0" onClick={() => { getInvoice(e.id) }}>Get Invoice</button>
                        </p>
                    </td> */}
                </tr>
            )
            setHistory(newDataHistory);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    function getPDF() {
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
        },
        padding: {
            paddingRight: 20
        },
        paddingBackground: {
            paddingRight: 20,
            backgroundColor: '#E4E4E4'
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
                    <Table data={[{ tableOrder: tableOrder }]} >
                        <TableHeader>
                            <TableCell style={styles.paddingBackground}>TrackingNumber</TableCell>
                            <TableCell style={styles.background}>Status</TableCell>
                            <TableCell style={styles.background}>Packaging</TableCell>
                            <TableCell style={styles.background}>Date</TableCell>
                            <TableCell style={styles.background}>Price</TableCell>
                        </TableHeader>
                    </Table>
                    {tableOrder.map((res, index) =>
                        <Table key={index}>
                            <TableBody data={[{ order: res }]}>
                                <DataTableCell style={styles.padding} getContent={(r) => r.order.trackingNumber.substr(0, 16) + "\n" + r.order.trackingNumber.substr(16, 32)} />
                                <DataTableCell getContent={(r) => r.order.status != "" ? "Delivered" : " In transition"} />
                                <DataTableCell getContent={(r) => r.order.packaging !== null ? r.order.packaging.name : "whithout"} />
                                <DataTableCell getContent={(r) => getDate(r.order.createdAt)} />
                                <DataTableCell getContent={(r) => r.order.cost} />
                            </TableBody>
                        </Table>
                    )}
                </View>
            </Page>
        </Document>
    );

    const App = () => (
        <>
            <button className="btn btn-outline-dark btnCloseFacture" onClick={getPDF}>Close</button>
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
                        <div className="d-flex justify-content-between">
                            <h1>Order History</h1>
                            <p className="float-right mt-3">
                                Get the PDF history
                            <span className="getpdf" onClick={getPDF}><i className="material-icons md-45 marg ml-2 down">save_alt</i></span>
                            </p>
                        </div>
                        <div className="mt-3 row border  bg-light  p-2">
                            <table className="">
                                <tbody>
                                    <tr className="">
                                        <th className="pr-3">TrackingNumber</th>
                                        <th className="pr-3">Status</th>
                                        <th className="pr-3">Packaging</th>
                                        <th className="pr-3">Date</th>
                                        <th className="pr-3">Price</th>
                                        <th className="pr-3">Details</th>
                                        {/* <th className="pr-3">Invoice</th> */}
                                    </tr>
                                    {history.length > 0 ? history : null}
                                </tbody>
                            </table>
                            {history.length > 0 ? null : <h1 className="noOrder">No order set</h1>}
                        </div>
                    </>
            }
        </>
    )
}

export default ShowOrder;