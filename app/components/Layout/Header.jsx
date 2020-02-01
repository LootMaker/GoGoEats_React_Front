import React from 'react';
import PropTypes from 'prop-types';
import pubsub from 'pubsub-js';
import { NavDropdown, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Router, Route, Link, History } from 'react-router';

import UtilService from '../Common/UtilService'
import HeaderRun from './Header.run'
import api from '../API/api'
import store from '../../redux/store'

// Necessary to create listGroup inside navigation items
class CustomListGroup extends React.Component {
    render() {
        return (
            <ul className="list-group">
                {this.props.children}
            </ul>
        );
    }
}

class Header extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            user: {}
        };
        // userId is business id
        this.userId = $.localStorage.get("business").id;
        this.connection = null;
        this.subscription = null;
        this.onSelectUserMenu = this.onSelectUserMenu.bind(this);
    }

    componentDidMount() {
        HeaderRun();

        this.ifMounted = true;
        // this function must be called after login
        if (api.loggedIn()) {
            this._initConnection();
        } 
    }

    componentWillUnmount() {
        this.ifMounted = false;

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connection) {
            this.connection.disconnect();
            this.connection = null;
        }
    }

    _initConnection() {
        UtilService.getWebSocketConnection(this.userId, (err, con) => {
            if (err) {
                // put code to retry connection
                console.log("connection error:", err)
                return;
            }
            this.connection = con
            this._subscribeSocket();
        })
    }

    _subscribeSocket() {
        var callbacks = {
            "message": (message) => {
                // See below description of message format
                // this is part after receive message, you have to parsing this part.
                console.log("message", message.data);
                store.dispatch({
                    type: "NEW_ORDER_REQUEST",
                    message
                })
            },
            "join": (message) => {
                // See below description of join message format
                console.log("join", message);
            },
            "leave": (message) => {
                // See below description of leave message format
                console.log("leave", message);
            },
            "subscribe": (context) => {
                // See below description of subscribe callback context format
                console.log("subscribe", context);
            },
            "error": (errContext) => {
                // See below description of subscribe error callback context format
                console.log("error", err);
            },
            "unsubscribe": (context) => {
                // See below description of unsubscribe event callback context format
                console.log("unsubscribe", context);
            },
            "presence": (message) => {
                console.log("message", message);
            }
        }

        // this is channel subscribe
        // this.subscription = this.connection.subscribe(this.userId, callbacks)
        this.subscription = this.connection.subscribe("public:" + this.userId, callbacks)
    }

    toggleUserblock(e) {
        e.preventDefault();
        pubsub.publish('toggleUserblock');
    }

    onSelectUserMenu(eventKey) {
        if (eventKey == 4.1) { //go profile

        } else {
            //logout
            api.logout();
            this.context.router.push('login')
        }
    }

    render() {
        const ddAlertTitle = (
            <span>
                <em className="icon-bell"></em>
                <span className="label label-danger">11</span>

            </span>
        )
        const ddLogoutTitle = (
            <span>
                <em className="icon-logout"></em>
            </span>
        )
        return (
            <header className="topnavbar-wrapper">
                { /* START Top Navbar */}
                <nav role="navigation" className="navbar topnavbar">
                    { /* START navbar header */}
                    <div className="navbar-header">
                        <a href="#/" className="navbar-brand">
                            <div className="brand-logo">
                                <img src="img/logo_white.png" alt="gogo" className="img-responsive logo_gogo_dash" />
                            </div>
                            <div className="brand-logo-collapsed">
                                <img src="img/logo_white.png" alt="gogo" className="img-responsive img-coll"/>
                            </div>
                        </a>
                    </div>
                    { /* END navbar header */}
                    { /* START Nav wrapper */}
                    <div className="nav-wrapper">
                        { /* START Left navbar */}
                        <ul className="nav navbar-nav">
                            <li>
                                { /* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
                                <a href="#" data-trigger-resize="" data-toggle-state="aside-collapsed" className="hidden-xs">
                                    <em className="fa fa-navicon"></em>
                                </a>
                                { /* Button to show/hide the sidebar on mobile. Visible on mobile only. */}
                                <a href="#" data-toggle-state="aside-toggled" data-no-persist="true" className="visible-xs sidebar-toggle">
                                    <em className="fa fa-navicon"></em>
                                </a>
                            </li>
                            { /* START User avatar toggle */}
                            <li>
                                { /* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
                                <a id="user-block-toggle" href="#" onClick={this.toggleUserblock}>
                                    <em className="icon-user"></em>
                                </a>
                            </li>
                            { /* END User avatar toggle */}
                            { /* START lock screen */}
                            { /* <li>
                                <Link to="lock" title="Lock screen">
                                    <em className="icon-lock"></em>
                                </Link>
                            </li> */}
                            { /* END lock screen */}
                        </ul>
                        { /* END Left navbar */}
                        { /* START Right Navbar */}
                        <ul className="nav navbar-nav navbar-right">
                            { /* Fullscreen (only desktops) */}
                            <li className="visible-lg">
                                <a href="#" data-toggle-fullscreen="">
                                    <em className="fa fa-expand"></em>
                                </a>
                            </li>
                            { /* START Alert menu */}
                            { /*
                            <NavDropdown noCaret eventKey={3} title={ddAlertTitle} className="dropdown-list" id="basic-nav-dropdown" >
                                <CustomListGroup>
                                    <ListGroupItem href="javascript:void(0)">
                                        <div className="media-box">
                                            <div className="pull-left">
                                                <em className="fa fa-twitter fa-2x text-info"></em>
                                            </div>
                                            <div className="media-box-body clearfix">
                                                <p className="m0">New followers</p>
                                                <p className="m0 text-muted">
                                                    <small>1 new follower</small>
                                                </p>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem href="javascript:void(0)">
                                        <div className="media-box">
                                            <div className="pull-left">
                                                <em className="fa fa-envelope fa-2x text-warning"></em>
                                            </div>
                                            <div className="media-box-body clearfix">
                                                <p className="m0">New e-mails</p>
                                                <p className="m0 text-muted">
                                                    <small>You have 10 new emails</small>
                                                </p>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem href="javascript:void(0)">
                                        <div className="media-box">
                                            <div className="pull-left">
                                                <em className="fa fa-tasks fa-2x text-success"></em>
                                            </div>
                                            <div className="media-box-body clearfix">
                                                <p className="m0">Pending Tasks</p>
                                                <p className="m0 text-muted">
                                                    <small>11 pending task</small>
                                                </p>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem href="javascript:void(0)">
                                        <small>More notifications</small>
                                        <span className="label label-danger pull-right">14</span>
                                    </ListGroupItem>

                                </CustomListGroup>
                            </NavDropdown>
                            */ }
                            { /* END Alert menu */}
                            { /* START Logout menu */}
                            <NavDropdown noCaret eventKey={4} title={ddLogoutTitle} id="basic-nav-dropdown" >
                                <MenuItem className="animated flipInX" eventKey={4.3} onSelect={this.onSelectUserMenu}>Logout</MenuItem>
                            </NavDropdown>
                            { /* END Alert menu */}
                            <li>
                                <a href="#" data-toggle-state="offsidebar-open" data-no-persist="true">
                                    <em className="icon-notebook"></em>
                                </a>
                            </li>

                            { /* END Offsidebar menu */}
                        </ul>
                        { /* END Right Navbar */}
                    </div>
                    { /* END Nav wrapper */}

                </nav>
                { /* END Top Navbar */}
            </header>
        );
    }

}

Header.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Header;
