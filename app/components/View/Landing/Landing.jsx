import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Link, History } from 'react-router';
import { Row, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Form, FormGroup, Button, FormControl } from 'react-bootstrap';

import api from '../../API/api';
import SiteService from '../../API/SiteService';
import BusinesService from '../../API/BusinesService';
import UtilService from '../../Common/UtilService';
import Footer from './Footer';

class Landing extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            error: false,
            msgError: "",
            businessList: {
                total: 0,
                items: []
            },
            businessRegister: 0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this._goToLogin = this._goToLogin.bind(this);
    }

    componentWillUnmount() {
        this.ifMounted = false;
    }

    componentDidMount() {
        this.ifMounted = true;
        document.title = "Gogo Eats";
        // this.formInstance = $('form#registerForm')
        // .parsley()
        // .on('field:validated', () => {
        //     this.ifMounted && this.setState({
        //         error: false
        //     })
        // });
        this._searchBusiness();
    }

    _searchBusiness() {
        SiteService.readBusinesses((res) => {
            console.log("getData", res);
            this.ifMounted && this.setState({
                businessList: res
            })
        }, (err) => {
            console.log(err)
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        var isValid = this
            .formInstance
            .isValid();

        if (isValid) {
            const name     = this.refs.name.value;
            const email    = this.refs.email.value;
            const password = this.refs.password.value;

            BusinesService.register(name, email, password, (res) => {
                // var _router = this.context.router;
                // _router.push('/introduce');
                this.setState({ businessRegister: 1 });
            }, (err) => {
                console.log(err.message)
                this.setState({ error: true, msgError: err.message })
            });
        }
    }

    _goToLogin(e) {
        if (e) {
            e.stopPropagation()
            e.preventDefault()
        }
        this.context.router.push('/login');
    }

    render() {
        return(
            <div>
                <Navbar className="header_site" collapseOnSelect fixedTop={true}>
                    <Navbar.Header>
                        <Navbar.Brand className="logo_site">
                            <a href="#"><img src="/img/gogo_footer.png" width="100" /></a>
                        </Navbar.Brand>
                    <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} href="#">Preguntas Frecuentes</NavItem>
                            <NavItem eventKey={1} href="#" onClick={this._goToLogin}>Iniciar Sesión</NavItem>
                            <NavItem eventKey={1} className="register_btn" href="#">Regístrarse</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div className="slide">
                    
                            <Col lg={1} className="profile_pic">
                                
                            </Col>
                            <Col lg={6} className="text_home">
                                <h2 className="title_home">Encuentra tu comida favorita a tan solo un toque</h2>
                                <p>Eat’s On facilita las tareas para pedir comida, ya sea express o cuando estás en el local del proveedor. Olvídate de tener que llamar para ordenar comida, de limitarte solo a los proveedores que tienen express, tener que pedir todo de un solo proveedor, de esperas eternas para que el mesero te atienda o para pagar en la caja.</p>

                                <div className="links_home">
                                    <a className="about_more" href="#">Conocer más de gogo </a>
                                    <a className="driving_home" href="#">Conductir con nosotros </a>
                                </div>
                            </Col>
                    
                </div>{/* slide */}
           
                <div className="how_works">
                    
                    <div className="title_reference">
                        <h2>Así es como funciona</h2>
                        <span>En 3 sencillos pasos</span>
                        <div className="liners_bottom"></div>
                    </div>

                        <div className="container cont_works">
                            <Row>
                                <Col lg={4}>
                                    <img src="/img/icons/restaurant.png" width={85}/>
                                    <h4>Selecciona un restaurante</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla cum voluptate, iste mollitia eius vero sed</p>
                                </Col>
                                <Col lg={4}>
                                    <img src="/img/icons/burger.png" width={85}/>
                                    <h4>Elige tu platillo favorito</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla cum voluptate, iste mollitia eius vero sed</p>
                                </Col>
                                <Col lg={4}>
                                    <img src="/img/icons/motorcycle.png" width={85}/>
                                    <h4>Disfruta la entrega</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla cum voluptate, iste mollitia eius vero sed</p>
                                </Col>
                            </Row>
                        </div>
                </div>{/* how_works */}


                <div className="download_app">
                    <div className="container">
                        <Col lg={6}>
                            <img src="/img/iphone.png"/>
                        </Col>

                        <Col lg={5} className="download_box">
                            <h3>Descarga la app. <span className="blockes">Tu platillo favorito en solo minutos</span></h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                            Ad officia minima cum libero, commodi</p>
                            <div className="dowload_links">
                                <a href="#"><img src="/img/app_store.png"/></a>
                                <a href="#"><img src="/img/google_play.png"/></a>
                            </div>
                        </Col>
                    </div>{/* container */}
                </div>{/* download_app */}


                <div className="problem_lading">
                    <div className="container">
                        <Col lg={6}>
                            <h3>¿ Tienes alguna pregunta ?</h3>
                        </Col>
                        <Col lg={6}>
                            <a className="btn_faq_landing" href="#"> <span className="icon-support"></span> Preguntas Frecuentes</a>
                        </Col>
                    </div>
                </div>{/* problem_lading */}

                <Footer/>

            </div>
        )
    }
}

Landing.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Landing;