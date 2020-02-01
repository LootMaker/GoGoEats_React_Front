import React from 'react';
import _ from 'underscore'
import { Grid, Row, Col, Panel, Button, Table, FormControl, FormGroup, Pagination } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router';

import ContentWrapper from '../../Layout/ContentWrapper';
import api from '../../API/api';
import UtilService from '../../Common/UtilService';
import RestaurantService from '../../API/RestaurantService';
import * as CONST from '../../Common/constants';
import SortHeader from '../../Control/SortHeader';

class Restaurants extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        // init state params 
        this.state = {
            brands: [],
            selectedRestaurant: {
                id: "",
                models: []
            },
            selectedModel: {
                code: 1,
                value: ''
            },

            sidebarType: 0, //0 - Brand , 1 - Model
            showBrandDetail: false,
            formTitle: "New Restaurant",
            editOption: true //false-create, true-edit
        }

        this._createRestaurant = this._createRestaurant.bind(this);
    }

    componentDidMount() {
        $(document.body).removeClass("editsidebar-open");

        this.ifMounted = true
        this.brandEditForm = $('form#brandEditForm').parsley();
        this.modelEditForm = $('form#modelEditForm').parsley();

        this._searchRestaurants();
    }

    componentWillUnmount() {
        this.ifMounted = false;
        $(document.body).removeClass("editsidebar-open");
    }

    _searchRestaurants() {
        RestaurantService.jsx.readRestaurants((res) => {
            console.log(res)
            this.ifMounted && this.setState({
                restaurants: res
            })
        }, (err) => {
            $.notify(err.message, "danger");
        });
    }

    _createRestaurant(e) {
        e.preventDefault();

        this.ifMounted && this.setState({
            selectedRestaurant: {
                title: "",
                models: []
            },
            sidebarType: 0,
            showBrandDetail: false,
            editOption: false,
            formTitle: "New Restaurant"
        })
        // reset validation
        this.brandEditForm = $('form#brandEditForm').parsley();
        this.brandEditForm.reset();

        $(document.body).addClass("editsidebar-open");
    }

    _editRestaurant(restaurant, e) {
        e.preventDefault();
        e.stopPropagation();

        this.ifMounted && this.setState({
            selectedRestaurant: _.clone(restaurant),
            editOption: true,
            sidebarType: 0,
            formTitle: "Edit Restaurant"
        });
        // reset validation
        this.brandEditForm = $('form#brandEditForm').parsley();
        this.brandEditForm.reset();

        $(document.body).addClass("editsidebar-open");
    }

    _showRestaurant(restaurant, e) {
        e.preventDefault();

        this.ifMounted && this.setState({
            selectedRestaurant: _.clone(restaurant),
            showBrandDetail: true,
        });

        $(document.body).removeClass("editsidebar-open");
    }

    _deleteBrandInList(brand, e) {
        e.preventDefault();
        this.state.selectedRestaurant.id = brand.id;

        var $this = this;
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this item!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function () {
            $this._deleteBrand();
        });
    }

    _deleteBrand() {
        // delete brand
        RestaurantService.deleteRestaurant(this.state.selectedRestaurant.id, (res) => {
            this._searchBrands();
            this.ifMounted && this.setState({
                showBrandDetail: false,
            });

            $(document.body).removeClass("editsidebar-open");
            $.notify("Brand is deleted correctly.", "success");
        }, (err) => {
            // console.log(err.message);
            $.notify(err.message, "danger");
        });
    }

    _closeEditForm(e) {
        e.preventDefault();
        $(document.body).removeClass("editsidebar-open");
    }

    _changeBrandField(field, e) {
        e.preventDefault();

        // update all fields when change content
        var selectedRestaurant = this.state.selectedRestaurant;
        selectedRestaurant[field] = e.target.value;

        // update selected brand state
        this.setState({ selectedRestaurant });
    }

    //=============================================================
    // Model Info
    //=============================================================

    _addModel(e) {
        e.preventDefault();

        this.ifMounted && this.setState({
            selectedModel: {
                code: 1,
                value: ''
            },
            sidebarType: 1,
            editOption: false,
            formTitle: "Add Model"
        });
        this.modelEditForm = $('form#modelEditForm').parsley();
        this.modelEditForm.reset()

        $(document.body).addClass("editsidebar-open");
    }

    _editModel(model, e) {
        e.preventDefault();

        this.ifMounted && this.setState({
            selectedModel: $.extend(true, {}, model),
            editOption: true,
            sidebarType: 1,
            formTitle: "Edit Model"
        });
        this.modelEditForm = $('form#modelEditForm').parsley();
        this.modelEditForm.reset()

        $(document.body).addClass("editsidebar-open");
    }

    _changeModelField(field, e) {
        e.preventDefault();

        var selectedModel = this.state.selectedModel;
        if (field == "code") {
            selectedModel[field] = Number(e.target.value);
        } else {
            selectedModel[field] = e.target.value;
        }
        // update selected user state
        this.setState({ selectedModel });
    }

    _deleteModel() {
        var models = this.state.selectedRestaurant.models;
        var model = _.find(models, (o) => {
            return o.code == this.state.selectedModel.code;
        });
        var idx = models.indexOf(model);
        models.splice(idx, 1);

        RestaurantService.updateModels(this.state.selectedRestaurant.id, models, (res) => {
            this.ifMounted && this.setState({
                selectedRestaurant: this.state.selectedRestaurant,
                showBrandDetail: true,
            });

            $.notify("Model is deleted successfully.", "success");
            $(document.body).removeClass("editsidebar-open");
        }, (err) => {
            // console.log(err.message);
            $.notify(err.message, "danger");
        })
    }

    _deleteConfirm(e) {
        e.preventDefault();

        var $this = this;
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this item!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function () {
            if ($this.state.sidebarType == 0) {
                $this._deleteBrand();
            } else {
                $this._deleteModel();
            }
        });
    }

    _submitForm(e) {
        e.preventDefault();

        if (this.state.sidebarType == 0) {
            this.brandEditForm = $('form#brandEditForm').parsley();
            this.brandEditForm.validate();

            if (this.brandEditForm.isValid()) {
                if (this.state.editOption) {
                    // update restaurant
                    RestaurantService.updateRestaurant(this.state.selectedRestaurant, (res) => {
                        var restaurants = this.state.restaurants;
                        var restaurant = _.find(restaurants, (o) => {
                            return o.id == res.id;
                        });

                        _.extend(restaurant, res);

                        // update state
                        this.ifMounted && this.setState({ restaurants });

                        $.notify("Restaurant is updated successfully.", "success");
                        $(document.body).removeClass("editsidebar-open");
                    }, (err) => {
                        $.notify(err.message, "danger");
                    })

                } else {
                    // create restaurant
                    RestaurantService.createRestaurant(this.state.selectedRestaurant, (res) => {
                        this._searchBrands();

                        // show notifiy
                        $.notify("Restaurant is created successfully.", "success");
                        $(document.body).removeClass("editsidebar-open");
                    }, (err) => {
                        $.notify(err.message, "danger");
                    });
                }
            } else {
                $.notify("Input data is invalid brand data", "warning");
            }
        } else if (this.state.sidebarType == 1) {
            this.modelEditForm = $('form#modelEditForm').parsley();
            this.modelEditForm.validate();

            if (this.modelEditForm.isValid()) {
                var models = this.state.selectedRestaurant.models;
                if (this.state.editOption) {
                    var model = _.find(models, (o) => {
                        return o.code == this.state.selectedModel.code;
                    });
                    _.extend(model, this.state.selectedModel);
                } else {
                    models.push(this.state.selectedModel);
                }

                RestaurantService.updateModels(this.state.selectedRestaurant.id, models, (res) => {
                    this.ifMounted && this.setState({
                        selectedRestaurant: this.state.selectedRestaurant,
                        showBrandDetail: true,
                    });

                    $.notify("Model is upinserted successfully.", "success");
                    $(document.body).removeClass("editsidebar-open");
                }, (err) => {
                    // console.log(err.message);
                    $.notify(err.message, "danger");
                })
            } else {
                $.notify("Input data is invalid model data", "warning");
            }
        }
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    Restaurants
                </div>
                <div>
                    <Row>
                        <Col lg={6}>
                            <Panel>
                                <Row>
                                    <Col md={12}>
                                        <legend>
                                            Brands
                                            <button className="btn btn-sm btn-primary pull-right" onClick={this._createRestaurant}>New Restaurant</button>
                                        </legend>
                                    </Col>
                                </Row>

                                <Table id="groupTable" responsive striped hover className="b0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th className="text-center">
                                                <strong>Title</strong>
                                            </th>
                                            <th className="text-center">
                                                <strong>Actions</strong>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.restaurants.map((item, i) => {
                                                return (
                                                    <tr key={'restaurantTr' + i} className="tr-hover" onClick={this._showRestaurant.bind(this, item)}>
                                                        <td>{i + 1}</td>
                                                        <td className="text-center">{item.title}</td>
                                                        <td className="text-center">
                                                            <button className="btn btn-xs btn-primary mr" onClick={this._editRestaurant.bind(this, item)}>Edit</button>
                                                            <button className="btn btn-xs btn-danger" onClick={this._deleteBrandInList.bind(this, item)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                        {(() => {
                                            if (this.state.restaurants.length == 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan={5}>
                                                            <p className="text-center">There is no any data.</p>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        })()}
                                    </tbody>
                                </Table>
                            </Panel>
                        </Col>
                        <Col lg={6}>
                            <Panel style={{ display: this.state.showBrandDetail == 1 ? 'block' : 'none' }}>
                                <Row>
                                    <Col md={12}>
                                        <legend>
                                            Models
                                            <button className="btn btn-sm btn-primary pull-right" onClick={this._addModel.bind(this)}>Add model</button>
                                        </legend>
                                    </Col>
                                </Row>
                                <Table id="modelTable" responsive striped hover className="b0">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: '80px' }}><strong>Code ID</strong></th>
                                            <th className="text-center">
                                                <strong>Title</strong>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.selectedRestaurant.models.map((item, i) => {
                                                return (
                                                    <tr key={'modelTr' + i} className="tr-hover" onClick={this._editModel.bind(this, item)}>
                                                        <td className="text-center">{item.code}</td>
                                                        <td className="text-center">{item.value}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                        {(() => {
                                            if (this.state.selectedBrand.models.length == 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan={2}>
                                                            <p className="text-center">There is no any data.</p>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        })()}
                                    </tbody>
                                </Table>
                            </Panel>
                        </Col>
                    </Row>
                    <aside className="editsidebar">
                        <div className="sidebar-header"><legend>{this.state.formTitle}</legend></div>
                        <form id="brandEditForm" className="form" data-parsley-validate="" style={{ display: this.state.sidebarType == 0 ? 'block' : 'none' }}>
                            <div className="form-group" style={{ display: this.state.sidebarType == 0 ? 'block' : 'none' }}>
                                <label className="control-label">Restaurant Name</label>
                                <input type="text" value={this.state.selectedRestaurant.title || ''} required="required" onChange={this._changeBrandField.bind(this, 'title')} className="form-control" />
                            </div>
                        </form>
                        <form id="modelEditForm" className="form" data-parsley-validate="" style={{ display: this.state.sidebarType == 1 ? 'block' : 'none' }}>
                            <div className="form-group" style={{ display: this.state.sidebarType == 1 ? 'block' : 'none' }}>
                                <label className="control-label">Code ID</label>
                                <input type="text" value={this.state.selectedModel.code || 0} required="required" readOnly={this.state.editOption} onChange={this._changeModelField.bind(this, 'code')} className="form-control" />
                            </div>
                            <div className="form-group" style={{ display: this.state.sidebarType == 1 ? 'block' : 'none' }}>
                                <label className="control-label">Code value</label>
                                <input type="text" value={this.state.selectedModel.value || ''} required="required" onChange={this._changeModelField.bind(this, 'value')} className="form-control" />
                            </div>
                        </form>
                        <Button bsStyle="success" style={{ position: 'absolute', bottom: '15px', left: '20px', }} onClick={this._submitForm.bind(this)}>
                            <i className="fa fa-check fa-lg"></i>
                        </Button>
                        <Button bsStyle="danger" style={{ position: 'absolute', bottom: '15px', left: '90px', display: this.state.editOption ? 'block' : 'none' }} onClick={this._deleteConfirm.bind(this)}>
                            <i className="fa fa-trash fa-lg"></i>
                        </Button>
                        <Button bsStyle="primary" style={{ position: 'absolute', bottom: '15px', right: '20px', }} onClick={this._closeEditForm.bind(this)}>
                            <i className="fa fa-times fa-lg"></i>
                        </Button>
                    </aside>
                </div>
            </ContentWrapper>
        );
    }
}

export default Restaurants;