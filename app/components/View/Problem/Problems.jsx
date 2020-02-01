import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table } from 'react-bootstrap';
import SortHeader from '../../Control/SortHeader';

import api from '../../API/api';
import ProblemService from '../../API/ProblemService';
import UtilService from '../../Common/UtilService';
import * as CONST from '../../Common/constants';

class Problems extends Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            selectedProblem: {
            },
            problemList: [],
            // for pagination
            numOfPages: 1,
            activePage: 1,
            // for sort
            activeIndex: -1,
            sortField: "",
            sortDirection: 0,
        }

        this._closeEditForm = this._closeEditForm.bind(this);
        this.editForm = null;
        this.currentBusiness = api.getCurrentUser();
    }

    componentDidMount() {
        document.title = "Problem List - gogo";

        this._searchProblems(1);

        this.ifMounted = true
        this.editForm = $('form#editForm').parsley();
        $(document.body).removeClass("editsidebar-open");
    }

    _searchProblems(page, e) {
        if (e)
            e.preventDefault();

        var query = this.refs.query.value;
        if (this.state.sortDirection != 0) {
            query += "&sort=" + this.state.sortDirection + "&field=" + this.state.sortField
        }
        query += "&offset=" + CONST.NUM_PER_PAGES * (page - 1) + "&count=" + CONST.NUM_PER_PAGES

        ProblemService.readBusinessProblems(this.currentBusiness.id, (res) => {
            this.ifMounted && this.setState({
                problemList: res,
                activePage: page,
                numOfPages: Math.ceil(res.total / CONST.NUM_PER_PAGES)
            })

            console.log("Get Problems ", this.state.problemList)
        }, (err) => {
        });
    }

    _closeEditForm(e) {
        e.preventDefault();
        $(document.body).removeClass("editsidebar-open");
    }

    _createProblem(e) {
        // initialize user data and variable
        this.ifMounted && this.setState({
            selectedProblem: {
                title: "",
                desription: "",
                status: 0
            },
            editOption: false,
            formTitle: "New Problem"
        });

        // reset validation
        this.editForm = $('form#editForm').parsley();
        this.editForm.reset();

        $(document.body).addClass("editsidebar-open");
    }

    _changeField(field, e) {
        e.preventDefault();

        var selectedProblem = this.state.selectedProblem;
        selectedProblem[field] = e.target.value;

        // update selected problem state
        this.setState({
            selectedProblem: selectedProblem
        });
    }

    _submitForm(e) {
        e.preventDefault();

        var selectedProblem = this.state.selectedProblem;

        this.editForm = $('form#editForm').parsley();
        this.editForm.validate();

        if (this.editForm.isValid()) {
            
            ProblemService.createProblem(selectedProblem, this.currentBusiness.id, (res) => {
                // console.log("create:", res);
                this._searchProblems(this.state.activePage);

                // show notifiy
                $.notify("Problem is created successfully.", "success");
                $(document.body).removeClass("editsidebar-open");
            }, (err) => {
                // console.log(err.message);
                $.notify(err.message, "danger");
            });

        } else {
            // console.log("Invalid user data");
            $.notify("Input data is invalid driver data", "warning");
        }
    }

    render() {
        return(
            <ContentWrapper>
               <div className="content-heading">
                    Problems List
                    <div className="pull-right btn_mobile">
                        <button className="btn btn-new pull-right" >Add New</button>
                    </div>
                </div>
                <Row>
                <Col lg={ 12 }>
                    <Panel>
                        <Row className="mb-lg">
                        <Col md={8}>
                                <form className="form-inline">
                                    <div className="input-group">
                                        <input ref="query" placeholder="Search user, driver" className="form-control"  style={{ width: '250px' }} />
                                        <span className="input-group-btn">
                                            <button className="btn btn-business">
                                                Search
                                            </button>
                                        </span>
                                    </div>
                                </form>
                            </Col>
                              <Col md={4}>
                                <button className="btn pull-right btn-business" onClick={ this._createProblem.bind(this) }>New Problem</button>
                            </Col>
                        </Row>
                        <div className="table-responsive">
                        <Table id="datatable1" responsive striped hover className="b0">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30px" }}>#</th>
                                            <th>
                                                <SortHeader
                                                    label={'Problem Name'}
                                                    sortField="problem"
                                                    sortIndex={0}>
                                                </SortHeader>
                                            </th>
                                            <th>
                                                <SortHeader
                                                    label={'Description'}
                                                    sortField="type"
                                                    sortIndex={1}>
                                                </SortHeader>
                                            </th>
                                            <th>
                                                <SortHeader
                                                    label={'Status'}
                                                    sortField="status"
                                                    sortIndex={2}>
                                                </SortHeader>
                                            </th>
                                            <th>
                                                <SortHeader
                                                    label={'Create At'}
                                                    sortField="create"
                                                    sortIndex={3}>
                                                </SortHeader>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.problemList.map((item, i) => {
                                                return (
                                                    <tr key={'problemTr' + i} className="tr-hover">
                                                        <td>{(this.state.activePage - 1) * CONST.NUM_PER_PAGES + i + 1}</td>
                                                        <td>{item.title}</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.status ? <div className="badge p-sm bg-success">Resolve</div> : <div className="badge p-sm bg-danger">Pending</div>}</td>
                                                        <td>{UtilService.getDateTime(item.createdAt)}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Panel>
                    </Col>
                </Row>
                <aside className="editsidebar">
                    <div className="sidebar-header"><legend>{this.state.formTitle}</legend></div>
                    <form id="editForm" className="form" data-parsley-validate="">
                        <div className="form-group">
                            <label className="control-label">Problem Name</label>
                            <input type="text" value={this.state.selectedProblem.title || ''} placeholder="Problem Name" required="required" onChange={this._changeField.bind(this, 'title')} className="form-control" />
                        </div>

                        <div className="form-group">
                            <label className="control-label">Description</label>
                            <textarea onChange={this._changeField.bind(this, 'description')} className="form-control" rows="6" placeholder="Tell us about your problem">{this.state.selectedProblem.description || ''}</textarea>
                        </div>

                    </form>

                    <Button bsStyle="success" style={{ position: 'absolute', bottom: '15px', left: '20px' }} onClick={this._submitForm.bind(this)}>
                        <i className="fa fa-check fa-lg"></i>
                    </Button>
                    <Button bsStyle="danger" style={{ position: 'absolute', bottom: '15px', left: '90px', display: this.state.editOption ? 'block' : 'none' }} >
                        <i className="fa fa-trash fa-lg"></i>
                    </Button>
                    <Button bsStyle="primary" style={{ position: 'absolute', bottom: '15px', right: '20px', }} onClick={this._closeEditForm}>
                        <i className="fa fa-times fa-lg"></i>
                    </Button>
                </aside>
            </ContentWrapper>
        )
    }
}

export default Problems;