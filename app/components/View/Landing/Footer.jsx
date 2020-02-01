import React from 'react';
import { Router, Route, Link, History } from 'react-router';
import { Row, Col } from 'react-bootstrap';
class Footer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
                <div className="footer">
                    
                    <div className="container">

                        <Col lg={12} className="first_footer">

                            <Col lg={4}>
                                <img src="/img/gogo_footer.png" width={120}/>

                                <div className="social_footer">
                                    <a href="#"><span className="icon-social-facebook"></span></a>
                                    <a href="#"><span className="icon-social-twitter"></span></a>
                                    <a href="#"><span className="icon-social-instagram"></span></a>
                                </div>

                            </Col>

                            <Col lg={4}>
                                <ul>
                                    <li><a href="#">Acerca de Gogo</a></li>
                                    <li><a href="#">Conviértete repartidor con nosotros</a></li>
                                    <li><a href="#">Afiliacion de restaurantes</a></li>
                                </ul>
                            </Col>

                            <Col lg={4}>
                                <ul>
                                    <li><a href="#">Preguntas Frecuentes</a></li>
                                    <li><a href="#">Contáctenos</a></li>
                                </ul>
                            </Col>
                        </Col>

                        <Col lg={12} className="second_footer">

                            <Col lg={4}>
                                <div className="stores_footer">
                                    <img src="/img/app_store.png"/>
                                    <img src="/img/google_play.png"/>
                                </div>
                            </Col>

                            <Col lg={8}>
                                <a href="#" className="footer_terms">Términos y Condiciones</a>
                            </Col>

                        </Col>

                    </div>

                </div>
        )
    }
}

export default Footer