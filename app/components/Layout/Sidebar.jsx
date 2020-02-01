import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router';
import pubsub from 'pubsub-js';
import { Collapse } from 'react-bootstrap';
import SidebarRun from './Sidebar.run';
import api from '../API/api';
import UtilService from '../Common/UtilService';
import Config from '../Common/Config';

class Sidebar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            userBlockCollapse: true,
            collapse: {
                dashboard: this.routeActive('dashboard'),
                management: false,
                trips: false
            }
        };
        this.pubsub_token = pubsub.subscribe('toggleUserblock', () => {
            this.setState({
                userBlockCollapse: !this.state.userBlockCollapse
            });
        });
        this.currentUser = api.getCurrentUser();
    };

    componentDidMount() {
        // pass navigator to access router api
        SidebarRun(this.navigator.bind(this));
    }

    navigator(route) {
        this.props.router.push(route)
    }

    componentWillUnmount() {
        // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
        pubsub.unsubscribe(this.pubsub_token);
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        for (let p in paths) {
            if (this.props.router.isActive(paths[p]) === true)
                return true;
        }
        return false;
    }

    toggleItemCollapse(stateName) {
        var newCollapseState = {};
        for (let c in this.state.collapse) {
            if (this.state.collapse[c] === true && c !== stateName)
                this.state.collapse[c] = false;
        }
        this.setState({
            collapse: {
                [stateName]: !this.state.collapse[stateName]
            }
        });
    }

    isAllowedURL(url) {
        // if (api.getCurrentUser().role.code == 100) {
        //     return true;
        // }
        // // console.log("isAllowedURL", Config.urls)
        // if (Config.urls.indexOf(url) == -1) {
        //     return false;
        // }
        return true;
    }

    render() {
        return (
            <aside className='aside'>
                { /* START Sidebar (left) */}
                <div className="aside-inner">
                    <nav data-sidebar-anyclick-close="" className="sidebar">
                        { /* START sidebar nav */}
                        <ul className="nav">
                            { /* START user info */}
                            <li className="has-user-block">
                                <Collapse id="user-block" in={this.state.userBlockCollapse}>
                                    <div>
                                        <div className="item user-block">
                                            { /* User picture */}
                                            <div className="user-block-picture">
                                                <div className="user-block-status">
                                                    <img src={UtilService.getProfileFromPath(this.currentUser.logo)} alt="Avatar" className="img-thumbnail img-circle" />
                                                    {this.currentUser.is_verify ? <div className=" circle circle-success circle-lg"></div> : <div className=" circle circle-danger circle-lg"></div>}
                                                </div>
                                            </div>
                                            { /* Name and Job */}
                                            <div className="user-block-info">
                                                <span className="user-block-name">Hello, {this.currentUser.name}</span>
                                                <span className="user-block-role">{this.currentUser.role ? this.currentUser.role.name : ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </li>
                            { /* END user info */}
                            { /* Iterates over all sidebar items */}
                            {/*<li className="nav-heading ">
                                <span data-localize="sidebar.heading.HEADER">Main Navigation</span>
                            </li>*/}
                            <li className={this.routeActive('business/dashboard') ? 'active' : ''} style={{ display: this.isAllowedURL('business/dashboard') ? 'block' : 'none' }}>
                                <Link to="business/dashboard" title="Dashboard">
                                    <em className="icon-speedometer"></em>
                                    <span data-localize="sidebar.nav.DASHBOARD">Dashboard</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('business/foods') ? 'active' : ''} style={{ display: this.isAllowedURL('business/foods') ? 'block' : 'none' }}>
                                <Link to="business/foods" title="foods">
                                    <em className="icon-handbag"></em>
                                    <span data-localize="sidebar.nav.EARNINGS">My Foods</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('business/history') ? 'active' : ''} style={{ display: this.isAllowedURL('business/history') ? 'block' : 'none' }}>
                                <Link to="business/history" title="History Orders">
                                    <em className="icon-refresh"></em>
                                    <span data-localize="sidebar.nav.EARNINGS">History Orders</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('business/earnings') ? 'active' : ''} style={{ display: this.isAllowedURL('business/earnings') ? 'block' : 'none' }}>
                                <Link to="business/earnings" title="Earnings">
                                    <em className="icon-wallet"></em>
                                    <span data-localize="sidebar.nav.EARNINGS">My Earnings</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('business/problems') ? 'active' : ''} style={{ display: this.isAllowedURL('business/problems') ? 'block' : 'none' }}>
                                <Link to="business/problems" title="Report Problem">
                                    <em className="icon-support"></em>
                                    <span data-localize="sidebar.nav.EARNINGS">Report Problem</span>
                                </Link>
                            </li>
                            <li>
                                <div className="nav-item" title="Settings" onClick={this.toggleItemCollapse.bind(this, 'settings')}>
                                    <em className="icon-settings"></em>
                                    <span>Settings</span>
                                </div>
                                <Collapse in={this.state.collapse.settings}>
                                    <ul id="#" className="nav sidebar-subnav">
                                        <li className={this.routeActive('urls') ? 'active' : ''} style={{ display: this.isAllowedURL('/urls') ? 'block' : 'none' }}>
                                            <Link to="urls" title="Urls">
                                                <span>Urls</span>
                                            </Link>
                                        </li>
                                        <li className={this.routeActive('roles') ? 'active' : ''} style={{ display: this.isAllowedURL('/roles') ? 'block' : 'none' }}>
                                            <Link to="roles" title="Roles">
                                                <span>Roles</span>
                                            </Link>
                                        </li>
                                        <li className={this.routeActive('documents') ? 'active' : ''} style={{ display: this.isAllowedURL('/documents') ? 'block' : 'none' }}>
                                            <Link to="documents" title="Documents">
                                                <span>Documents</span>
                                            </Link>
                                        </li>
                                        <li className={this.routeActive('brands') ? 'active' : ''} style={{ display: this.isAllowedURL('/brands') ? 'block' : 'none' }}>
                                            <Link to="brands" title="Brands">
                                                <span>Brands</span>
                                            </Link>
                                        </li>
                                        <li className={this.routeActive('colors') ? 'active' : ''} style={{ display: this.isAllowedURL('/colors') ? 'block' : 'none' }}>
                                            <Link to="colors" title="Colors">
                                                <span>Colors</span>
                                            </Link>
                                        </li>
                                        <li className={this.routeActive('profile') ? 'active' : ''} style={{ display: this.isAllowedURL('/profile') ? 'block' : 'none' }}>
                                            <Link to="profile" title="Profile">
                                                <span>Profile</span>
                                            </Link>
                                        </li>
                                        <li className={this.routeActive('configuration') ? 'active' : ''} style={{ display: this.isAllowedURL('/configuration') ? 'block' : 'none' }}>
                                            <Link to="configuration" title="Configuration">
                                                <span>Configuration</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </Collapse>
                            </li>
                        </ul>
                        { /* END sidebar nav */}
                    </nav>
                </div>
                { /* END Sidebar (left) */}
            </aside>
        );
    }

}

export default withRouter(Sidebar);
