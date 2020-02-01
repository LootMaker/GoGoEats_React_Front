import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import { Grid, Row, Col, Dropdown, MenuItem, Tooltip, OverlayTrigger, Panel, Button } from 'react-bootstrap';

import ContentWrapper from '../../Layout/ContentWrapper';
import DashboardRun from './DashboardV2.run';
import initSlimScroll from '../../Common/slimscroll'

import OrderService from '../../API/OrderService';
import store from '../../../redux/store';

class DashboardV2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: []
        };

        this._goUsers        = this._goUsers.bind(this);
        this._goDrivers      = this._goDrivers.bind(this);
        this._goRestaurants  = this._goRestaurants.bind(this);
        this._goTransactions = this._goTransactions.bind(this);

        store.subscribe(() => {
            this.setState({
                orders: store.getState().orders
            })
        });
    }

    componentDidMount() {
        document.title = "Dashboard - gogo";

        this._initVisitorsChart();
        this._initTripsChart();

        $('[data-scrollable]').each(initSlimScroll);
    }

    componentWillUnmount() {

    }

    _initVisitorsChart() {
        var chartNode = this.refs.visitors_chart;
        var data = [{
            "label": "Visitors",
            "color": "#9cd159",
            "data": [
                ["Jan", 27],
                ["Feb", 82],
                ["Mar", 56],
                ["Apr", 14],
                ["May", 28],
                ["Jun", 77],
                ["Jul", 23],
                ["Aug", 49],
                ["Sep", 81],
                ["Oct", 20],
                ["Nov", 120],
                ["Dec", 60]
            ],
        }];

        var options = {
            series: {
                bars: {
                    align: 'center',
                    lineWidth: 0,
                    show: true,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                // position: 'right' or 'left'
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        if (chartNode) {
            $(chartNode).height($(chartNode).data('height') || 222);
            $.plot(chartNode, data, options);
        }
    }

    _initTripsChart() {
        var chartNode = this.refs.trips_chart;
        var data = [{
            "label": "Completed",
            "color": "#1f92fe",
            "data": [
                ["Jan", 70],
                ["Feb", 40],
                ["Mar", 70],
                ["Apr", 85],
                ["May", 59],
                ["Jun", 93],
                ["Jul", 66],
                ["Aug", 86],
                ["Sep", 60],
                ["Oct", 44],
                ["Nov", 55],
                ["Dec", 60]
            ]
        }, {
            "label": "Cancelled",
            "color": "#f0693a",
            "data": [
                ["Jan", 10],
                ["Feb", 18],
                ["Mar", 21],
                ["Apr", 12],
                ["May", 27],
                ["Jun", 24],
                ["Jul", 16],
                ["Aug", 39],
                ["Sep", 15],
                ["Oct", 14],
                ["Nov", 23],
                ["Dec", 15],
            ]
        }];

        var options = {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true,
                    radius: 4
                },
                splines: {
                    show: true,
                    tension: 0.4,
                    lineWidth: 1,
                    fill: 0.5
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                max: 150, // optional: use it for a clear represetation
                tickColor: '#eee',
                //position: 'right' or 'left',
                tickFormatter: function (v) {
                    return v /* + ' visitors'*/;
                }
            },
            shadowSize: 0
        };

        if (chartNode) {
            $(chartNode).height($(chartNode).data('height') || 222);
            $.plot(chartNode, data, options);
        }
    }

    _goUsers(e) {
        e.preventDefault();
    }

    _goDrivers(e) {
        e.preventDefault();
    }

    _goRestaurants(e) {
        e.preventDefault();
    }

    _goTransactions(e) {
        e.preventDefault();
    }

    /* ================== Order Flow =================== */

    _acceptOrder(order, e) {
        e.preventDefault()

        console.log("_acceptOrder");
        return

        OrderService.readOrder(order.id, (res) => {
            //console.log("users", res);
            this.ifMounted && this.setState({
                
            })
        }, (err) => {

        });

    }

    _declineOrder(order, e) {
        e.preventDefault()

        console.log("_declineOrder");
        return

        OrderService.declineOrder(order.id, (res) => {
            //console.log("users", res);
            this.ifMounted && this.setState({
                
            })
        }, (err) => {

        });

    }

    render() {
        const tooltip = function (text) {
            return (
                <Tooltip id="tooltip">{text}</Tooltip>
            );
        };

        return (
            <ContentWrapper>
                <div className="content-heading">
                    Dashboard
                    { <small data-localize="dashboard.WELCOME">Welcome to gogo!</small>}
                </div>
                <Row>
                    <Col lg={6}>

                    <div className="box_orders">
                        <div className="box_orders_title bg-inverse-light">New Orders</div>

                        <div className="box_orders_content">
                            {
                                this.state.orders.map((item, i) => {
                                    return (
                                        <div key={'foodTr' + i} className="media bb p">
                                            <small className="pull-right">
                                                <div className="manage_orders_btn">
                                                    <button className="btn-sm btn btn-success" onClick={this._acceptOrder.bind(this, item)}>
                                                        Accept
                                                    </button>
                                                    <button className="btn-sm btn btn-danger" onClick={this._declineOrder.bind(this, item)}>
                                                        Decline
                                                    </button>
                                                </div>
                                            </small>
                                            <div className="pull-left">
                                                <img src="img/user/05.jpg" alt="Image" className="media-object img-circle thumb32"/>
                                            </div>
                                            <div className="media-body">
                                                <div className="media-heading">
                                                    <p className="m0">
                                                        <a href="#">
                                                            <strong>{item.data.message}</strong>
                                                        </a>
                                                    </p>
                                                    <p className="m0 text-muted">Pickup: San Jose, Costa Rica</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>{/* box_orders_content */}

                    </div>{/* box_orders */}
                    </Col>
                    <Col lg={6}>
                    <div className="box_orders">
                        <div className="box_orders_title bg-success">Orders Ready</div>

                        <div className="box_orders_content">

                            <div className="media bb p">
                                <small className="pull-right">
                                    <div className="manage_orders_btn">
                                        <button className="btn-sm btn btn-success">
                                            Accept
                                        </button>
                                        <button className="btn-sm btn btn-danger">
                                            Decline
                                        </button>
                                    </div>
                                </small>
                                <div className="pull-left">
                                    <img src="img/user/05.jpg" alt="Image" className="media-object img-circle thumb32"/>
                                </div>
                                <div className="media-body">
                                    <div className="media-heading">
                                    <p className="m0">
                                        <a href="#">
                                            <strong>Order #1324</strong>
                                        </a>
                                    </p>
                                    <p className="m0 text-muted">Pickup: San Jose, Costa Rica</p>
                                    </div>
                                </div>
                            </div>

                            <div className="media bb p">
                                <small className="pull-right text-muted">12m ago</small>
                                <div className="pull-left">
                                    <img src="img/user/05.jpg" alt="Image" className="media-object img-circle thumb32"/>
                                </div>
                                <div className="media-body">
                                    <div className="media-heading">
                                    <p className="m0">
                                        <a href="#">
                                            <strong>Order #1323</strong>
                                        </a>
                                    </p>
                                    <p className="m0 text-muted">Pickup: San Jose, Costa Rica</p>
                                    </div>
                                </div>
                            </div>

                        </div>{/* box_orders_content */}

                    </div>{/* box_orders */}
                    </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

DashboardV2.contextTypes = {
    router: PropTypes.object.isRequired
}
export default DashboardV2;
