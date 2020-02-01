import React from 'react';
import ReactDom from 'react-dom';
import { Row, Col, Panel, Button, Tabs, Tab } from 'react-bootstrap';
import { browserHistory } from 'react-router'
import _ from 'underscore'

import ContentWrapper from '../../Layout/ContentWrapper';
import api from '../../API/api';
import DriverService from '../../API/DriverService';
import UtilService from '../../Common/UtilService';
import * as CONST from '../../Common/constants';
import initSlimScroll from '../../Common/slimscroll'
import SortHeader from '../../Control/SortHeader';
import ProfileTab from './tabs/ProfileTab';
import ReviewsTab from './tabs/ReviewsTab';
import CarsTab from './tabs/CarsTab';

class DriverProfile extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            driver: {},
            location: "",
            recent_trips: [],
            cancelled_count: 0,
            completed_count: 0,
            key: 1
        }
    }

    componentDidMount() {
        this.ifMounted = true;

        var driver_id = this.props.location.query.driver_id
        this._readDetailDriver(driver_id)

        $('[data-scrollable]').each(initSlimScroll);
    }

    componentWillUnmount() {
        this.ifMounted = false;
    }

    _readDetailDriver(id) {
        // console.log("driver_id:", id);
        DriverService.readDetailDriver(id, (res) => {
            // console.log("res:", res);
            this.ifMounted && this.setState({
                driver: res.driver,
                location: res.location,
                recent_trips: res.recent_trips,
                cancelled_count: res.cancelled_count,
                completed_count: res.completed_count,
            })
        }, (err) => {
        });
    }

    _handleSelect(key) {
        this.ifMounted && this.setState({
            key
        });
    }

    _backPage(e) {
        console.log("back...")
        if (e)
            e.preventDefault();
        browserHistory.goBack();
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <button type="button" className="btn btn-link pull-left" onClick={this._backPage.bind(this)}>
                        <em className="fa icon-arrow-left"></em>
                    </button>
                    Driver Profile
                </div>
                <Row>
                    <Col md={4}>
                        <div className="panel panel-default">
                            <div className="panel-body text-center">
                                <div className="pv">
                                    <img src={UtilService.getProfileFromPath(this.state.driver.image)} alt="Contact" className="center-block img-responsive img-circle img-thumbnail thumb80" />
                                </div>
                                <h3 className="m0 text-bold">{this.state.driver.user_name}</h3>
                                <div className="mv">
                                    <p className="m0">
                                        <em className="fa fa-fw fa-map-marker"></em>{this.state.location}</p>
                                </div>
                                <div className="text-center">
                                    <a href="#" className="btn btn-primary">Send message</a>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <div className="pull-right label label-danger">{this.state.cancelled_count}</div>
                                <div className="pull-right label label-success">{this.state.completed_count}</div>
                                <div className="panel-title">Recent Trips</div>
                            </div>
                            { /* START list group*/}
                            <div data-height="230" data-scrollable="" className="list-group">
                                { /* START list group item*/}
                                {
                                    this.state.recent_trips.map((item, i) => {
                                        return (
                                            <a key={"recent" + i} href="#" className="list-group-item" >
                                                <div className="media-box">
                                                    <div className="pull-left">
                                                        <img src={UtilService.getProfileFromPath(item.user.image)} alt="Image" className="media-box-object img-circle thumb32" />
                                                    </div>
                                                    <div className="media-box-body clearfix">
                                                        <small className="pull-right">{UtilService.getDateTime2ByFormat(item.updated_at, "MM-DD HH:mm")}</small>
                                                        <strong className="media-box-heading text-primary">
                                                            {item.status == "Completed" ? <span className="circle circle-success circle-lg text-left"></span> : <span className="circle circle-danger circle-lg text-left"></span>}
                                                            {item.user.user_name}
                                                        </strong>
                                                        <p className="mb-sm">
                                                            <small><strong className="text-danger">Pick: </strong>{item.pick.location} <strong className="text-danger">Drop: </strong> {item.drop.location}</small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })
                                }
                                { /* END list group item*/}
                                {(() => {
                                    if (this.state.recent_trips.length == 0) {
                                        return (
                                            <p className="text-center " style={{ marginTop: '100px' }}>There is no any data.</p>
                                        )
                                    }
                                })()}
                            </div>
                            { /* END list group*/}
                            { /* START panel footer*/}
                            <div className="panel-footer clearfix">
                                <a href="#" className="pull-left">
                                    <small>Load more</small>
                                </a>
                            </div>
                            { /* END panel-footer*/}
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="panel panel-default" style={{ height: '630px' }}>
                            <div className="panel-body">
                                <Tabs activeKey={this.state.key} onSelect={this._handleSelect.bind(this)} justified id="tabID">
                                    <Tab key="profile" eventKey={1} title="Profile">
                                        {this.state.key == 1 && <ProfileTab driver={this.state.driver}
                                            updateDriver={(driver) => this.ifMounted && this.setState(driver)}
                                            backPage={() => browserHistory.goBack()} />}
                                    </Tab>
                                    <Tab key="cars" eventKey={2} title="Cars">
                                        {this.state.key == 2 && <CarsTab driver={this.state.driver} />}
                                    </Tab>
                                    <Tab key="reviews" eventKey={3} title="Reviews">
                                        {this.state.key == 3 && <ReviewsTab driver_id={this.state.driver.id} />}
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
        )
    };
}

export default DriverProfile;