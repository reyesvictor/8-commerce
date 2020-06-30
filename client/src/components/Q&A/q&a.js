import React from 'react';
import Footer from '../footer/Footer';
import { UncontrolledCollapse, CardBody, Card } from 'reactstrap';
import './q&a.css';

function Questions() {

    return (
        <>
            <div className="container mb-5 pb-5">
                <h1 className="text-center">Frequently Asked Questions</h1>
                <h4 id="toggler" className="titleFAQ">Where can I buy blueprint. products ?</h4>
                <UncontrolledCollapse toggler="#toggler">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>Our online store ships the blueprint. range to many destinations worldwide. We aim to offer the full range of products at all times (subject to availability). Our products are also available in specialty retailers and concept stores around the world. blueprint. cannot guarantee nor supervise the availability of stock at our reseller locations. For details of our official retailers, please write us a message on the Customer Support page.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler0" className="titleFAQ">How can I know what's in stock ?</h4>
                <UncontrolledCollapse toggler="#toggler0">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>The styles and materials shown on the blueprint. online store represent our current product selection. Availability is shown on each product detail page. Our collections are constantly evolving, and certain seasonal colours and styles are available for a limited time only. Sign up for the blueprint. newsletter to stay up to date on new arrivals and offers.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler1" className="titleFAQ">Which currency are your prices shown in ?</h4>
                <UncontrolledCollapse toggler="#toggler1">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>In our North Americas and Asia-Pacific webstores prices are displayed in USD. In our European online stores, prices are displayed in EUR.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler2" className="titleFAQ">Do you ship worldwide? What does it cost ?</h4>
                <UncontrolledCollapse toggler="#toggler2">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>We ship to many destinations worldwide. We offer free standard shipping to all destinations listed. For more information and Express Shipping charges for your country, please refer to our Shipping Info page.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler3" className="titleFAQ">Can I track my order ?</h4>
                <UncontrolledCollapse toggler="#toggler3">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>Yes, once your order has been dispatched from our warehouse you will receive an email with a tracking number.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler4" className="titleFAQ">What is your return policy ?</h4>
                <UncontrolledCollapse toggler="#toggler4">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>You may return products within 14 days of delivery of your order. To proceed with a return, please open a Return Request on your blueprint. account and follow the instructions provided. You are responsible for the return shipping costs.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler5" className="titleFAQ">Is my product covered by warranty ?</h4>
                <UncontrolledCollapse toggler="#toggler5">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>There is a 12-month warranty on all bag and a 6-month warranty on sleeves. For more more information see our&nbsp;Warranty page.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler6" className="titleFAQ">I have experienced some technical problems in the online store.</h4>
                <UncontrolledCollapse toggler="#toggler6">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>If you are experiencing technical problems with the online store please let us know at support@coteetciel.com. If you are able to attach a screenshot of the issue, this will aid us in finding a solution.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler7" className="titleFAQ">How can I clean my blueprint. product ?</h4>
                <UncontrolledCollapse toggler="#toggler7">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>We recommend that you clean your product by wiping with a slightly damp cloth soaked in water only. blueprint. cannot guarantee the product will not be discoloured or damaged with alternative methods and liquids. blueprint. advise against waterproof sprays, as these may result in fabric discolouration. blueprint. warranties do not cover damages resulting from inappropriate cleaning methods.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler8" className="titleFAQ">How do I know if my laptop/device fits into a blueprint. bag ?</h4>
                <UncontrolledCollapse toggler="#toggler8">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>blueprint. bags are designed to accommodate almost all models of laptops in the sizes nominated on the product (e.g. 17”/15”/13” etc.). If you are unsure, the dimensions of the device pocket can be found in the product detail page for your reference.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h4 id="toggler9" className="titleFAQ">How can I be sure of the authenticity of products ?</h4>
                <UncontrolledCollapse toggler="#toggler9">
                    <Card style={{ border: "1px solid rgb(230, 230, 230)", height: "100%" }}>
                        <CardBody style={{ color: "black", backgroundColor: "white" }}>
                            <p>blueprint. authenticity is proven by the logo blueprint., and our products are only available in our online store and at certified retailers and online platforms.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>
            </div>

            <Footer />
        </>
    )
}

export default Questions;