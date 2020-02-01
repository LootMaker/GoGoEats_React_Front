import React from 'react';
import _ from 'underscore'
import { Grid, Row, Col, Panel, Button, Table, FormControl, FormGroup, Pagination } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router';

import ContentWrapper from '../../Layout/ContentWrapper';
import api from '../../API/api';
import UtilService from '../../Common/UtilService';
import * as CONST from '../../Common/constants';
import SortHeader from '../../Control/SortHeader';

class Earnings extends React.Component {
    constructor(props, context) {
        super(props, context);
        // init state params 
        this.state = {
            // for pagination
            numOfPages: 1,
            activePage: 1,
            // for sort
            activeIndex: -1,
            sortField: "",
            sortDirection: 0,
        }
    }

    componentDidMount() {
        document.title = "My Earnings - Gogo Eats"
        this.ifMounted = true;
    }

    componentWillUnmount() {
        this.ifMounted = false;
    }

    _sortList(field, direction) {
        this.state.sortField = field;
        this.state.sortDirection = direction;
        this.ifMounted && this.setState({
            sortField: field,
            sortDirection: direction
        })
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    My Earnings
                </div>
                <Row>
                    <Col sm={12}>
                        { /* START panel */ }
                            <Panel>
                                <form role="form" className="form">
                                    <Col sm={6}>
                                        <label>Select Dates of Earnings</label>
                                        <FormControl componentClass="select" name="account" className="form-control m-b">
                                            <option>Current Week</option>
                                            <option>From December 1 to 7 December ( 2017 )</option>
                                        </FormControl>
                                    </Col>
                                    <Col sm={3}>
                                        <button className="btn btn-business btn-filter" onClick={this._createFood}>Filter Earnings</button>
                                    </Col>
                                </form>
                            </Panel>
                        { /* END panel */ }
                    </Col>
                </Row>

                <Panel>
                        <Table id="datatable1" responsive striped hover className="b0">
                            <thead>
                                <tr>
                                    <th style={{ width: "30px" }}>#</th>
                                    <th>
                                        <SortHeader
                                            label={'Order #'}
                                            action={this._sortList.bind(this)}
                                            sortField="order_number"
                                            sortIndex={0}
                                            activeIndex={this.state.activeIndex}
                                            setActiveIndex={(idx) => this.setState({ activeIndex: idx })}>
                                        </SortHeader>
                                    </th>
                                    <th>
                                        <SortHeader
                                            label={'Pickup Address'}
                                            action={this._sortList.bind(this)}
                                            sortField="pickup"
                                            sortIndex={0}
                                            activeIndex={this.state.activeIndex}
                                            setActiveIndex={(idx) => this.setState({ activeIndex: idx })}>
                                        </SortHeader>
                                    </th>
                                    <th>
                                        <SortHeader
                                            label={'Drop Address'}
                                            action={this._sortList.bind(this)}
                                            sortField="drop"
                                            sortIndex={1}
                                            activeIndex={this.state.activeIndex}
                                            setActiveIndex={(idx) => this.setState({ activeIndex: idx })}>
                                        </SortHeader>
                                    </th>
                                    <th>
                                        <SortHeader
                                            label={'Driver'}
                                            action={this._sortList.bind(this)}
                                            sortField="driver"
                                            sortIndex={3}
                                            activeIndex={this.state.activeIndex}
                                            setActiveIndex={(idx) => this.setState({ activeIndex: idx })}>
                                        </SortHeader>
                                    </th>
                                    <th>
                                        <SortHeader
                                            label={'User'}
                                            action={this._sortList.bind(this)}
                                            sortField="user"
                                            sortIndex={3}
                                            activeIndex={this.state.activeIndex}
                                            setActiveIndex={(idx) => this.setState({ activeIndex: idx })}>
                                        </SortHeader>
                                    </th>
                                    <th>
                                        <SortHeader
                                            label={'Total'}
                                            action={this._sortList.bind(this)}
                                            sortField="freeDelivery"
                                            sortIndex={3}
                                            activeIndex={this.state.activeIndex}
                                            setActiveIndex={(idx) => this.setState({ activeIndex: idx })}>
                                        </SortHeader>
                                    </th>
                                    <th>
                                        <SortHeader
                                            label={'Gogo Fee'}
                                            action={this._sortList.bind(this)}
                                            sortField="freeDelivery"
                                            sortIndex={3}
                                            activeIndex={this.state.activeIndex}
                                            setActiveIndex={(idx) => this.setState({ activeIndex: idx })}>
                                        </SortHeader>
                                    </th>
                                    <th>
                                        Total Earnings
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr className="tr-hover">
                                <td>1</td>
                                <td>31245</td>
                                <td>San Jose, Costa Rica</td>
                                <td>San Pedro, Costa Rica</td>
                                <td>Xian Tiang</td>
                                <td>Anderson Quezada</td>
                                <td>{ CONST.CR_CURRENCY } 1,456</td>
                                <td>{ CONST.CR_CURRENCY } 256</td>
                                <td>{ CONST.CR_CURRENCY } 1,256</td>
                            </tr>
                            </tbody>
                        </Table>
                    </Panel>
            </ContentWrapper>
        );
    }
}

export default Earnings;