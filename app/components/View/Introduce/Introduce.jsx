import React from 'react';
import PropTypes from 'prop-types';
import TimeInput from 'react-time-input';
import DatePicker from 'react-datepicker';
import _ from 'underscore'

import { Router, Route, Link, History } from 'react-router';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId } from 'react-places-autocomplete';
import Select from 'react-select';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, Modal, ModalBody, ModalHeader } from 'react-bootstrap';


import api from '../../API/api';
import BusinessService from '../../API/BusinessService';
import BusinesService from '../../API/BusinesService';
import UploadService from '../../API/UploadService';
import MealKindService from '../../API/MealKindService';
import DietaryService from '../../API/DietaryService';
import FoodTypeService from '../../API/FoodTypeService';
import UtilService from '../../Common/UtilService';

class Introduce extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            error: false,
            showModal: false,
            selectedBusiness: {
                geoLocation: {},
                bankInfo: {},
                schedules: [{ weekday: 0 }, { weekday: 1 }, { weekday: 2 }, { weekday: 3 }, { weekday: 4 }, { weekday: 5 }, { weekday: 6 }],
            },
            mealKinds: [],
            dietaries: [],
            foodTypes: [],
            dayStatus: ''
        }
        this._handleSelectPlace = this._handleSelectPlace.bind(this)
        this._handleChange = this._handleChange.bind(this)
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleSchedule = this._handleSchedule.bind(this);
        this._currentUser = api.getCurrentUser();

        console.log(this.state.selectedBusiness.schedules)
    }

    componentWillUnmount() {
        this.ifMounted = false;
    }

    componentDidMount() {
        this.ifMounted = true;
        document.title = "Introduce restaurant";

        this.formInstance = $('form#updateForm')
            .parsley()
            .on('field:validated', () => {
                this.ifMounted && this.setState({
                    error: false
                })
            });


        var businessId = this._currentUser.id
        this._readBusinessProfile(businessId)

        this._searchMealKinds()
        this._searchDietaries()
        this._searchFoodTypes()

        if ($.fn.filestyle)
            $('.filestyle').filestyle();
    }

    _initTimePicker() {
        // TimePicker
        setTimeout(() => {
            this.state.selectedBusiness.schedules.map((item, i) => {
                $('#day_time_' + item.weekday).prop('checked', true);
                $('#day_' + item.weekday + '_from').datetimepicker({
                    format: 'LT',
                    ignoreReadonly: true

                });
                $('#day_' + item.weekday + '_to').datetimepicker({
                    format: 'LT',
                    ignoreReadonly: true

                });
                $('#day_' + item.weekday + '_from').on('dp.change', this._changeTime.bind(this, item.weekday, "from"));
                $('#day_' + item.weekday + '_to').on('dp.change', this._changeTime.bind(this, item.weekday, "to"));
            })
        }, 500)
    }

    _readBusinessProfile(id, e) {
        if (e) {
            e.preventDefault();
        }

        console.log("_readBusinessProfile", id);
        BusinessService.readBusiness(id, (res) => {
            this.ifMounted && this.setState((old) => {
                old.selectedBusiness = res
            })

            console.log("res", res);
        }, (err) => {
            console.log(err)
        });
    }

    _searchMealKinds() {
        MealKindService.readMealKinds((res) => {
            this.ifMounted && this.setState({
                mealKinds: res.items
            })
        }, (err) => {
            $.notify(err.message, "danger");
        });
    }

    _searchDietaries() {
        DietaryService.readDietaries((res) => {
            this.ifMounted && this.setState({
                dietaries: res.items
            })
        }, (err) => {
            $.notify(err.message, "danger");
        });
    }

    _searchFoodTypes() {
        FoodTypeService.readFoodTypes((res) => {
            this.ifMounted && this.setState({
                foodTypes: res.items
            })
        }, (err) => {
            $.notify(err.message, "danger");
        });
    }

    _handleSubmit(e) {
        e.preventDefault();
        var isValid = this
            .formInstance
            .isValid();
        console.log("business", this.state.business);

        if (isValid) {

            BusinessService.updateBusiness(this.state.selectedBusiness, (res) => {
                $.notify("Business is updated successfully.", "success");
                this.context.router.push('/dashboard');
            }, (err) => {
                $.notify(err.message, "danger");
            })
        }
    }

    _changeField(field, e) {
        e.preventDefault();
        // update all fields when change content
        var selectedBusiness = this.state.selectedBusiness;

        if (field == "logo") {
            this._uploadFile(field, this.refs.logo.files[0]);
            return
        } else if (field == "bankName") {
            selectedBusiness.bankInfo.name = e.target.value;
        } else if (field == "bankAccount") {
            selectedBusiness.bankInfo.account = e.target.value;
        } else if (field == "bankNumber") {
            selectedBusiness.bankInfo.number = e.target.value;
        } else {
            selectedBusiness[field] = e.target.value;
        }

        this.ifMounted && this.setState((old) => {
            old.selectedBusiness = selectedBusiness
        });
    }

    _uploadFile(field, file) {
        var business = this.state.selectedBusiness;

        const data = new FormData();
        data.append('path', 'business');
        data.append('file', file)

        UploadService.uploadImage(data, (res) => {
            // console.log(res)
            $.notify("File is uploaded successfully", "success");
            business[field] = res.path;
            // reset state
            this.setState({ business });
        }, (err) => {
            $.notify("File is not uploaded", "danger");
        });
    }

    _handleSchedule(e) {
        e.preventDefault();

        var selectedBusiness = this.state.selectedBusiness;
        selectedBusiness.schedules.map((item, i) => {
            setTimeout(() => {
                $('#day_time_' + item.weekday).prop('checked', item.enabled);
                $('#day_' + item.weekday + '_from').datetimepicker({
                    format: 'LT',
                    ignoreReadonly: true

                });
                $('#day_' + item.weekday + '_to').datetimepicker({
                    format: 'LT',
                    ignoreReadonly: true

                });
                $('#day_' + item.weekday + '_from').on('dp.change', this._changeTime.bind(this, item.weekday, 'from'));
                $('#day_' + item.weekday + '_to').on('dp.change', this._changeTime.bind(this, item.weekday, 'to'));
            }, 100)
        })
        this.setState({ showModal: true })
    }

    _closeModal() {
        this.setState({
            showModal: false
        });
        var selectedBusiness = this.state.selectedBusiness;
        console.log("Close ", selectedBusiness);
    }

    _changeSwitch(field, e) {
        e.preventDefault();

        setTimeout(() => {
            var selectedBusiness = this.state.selectedBusiness;
            selectedBusiness.schedules[field].enabled = UtilService.changeSwitchValue($('#day_time_' + field))
            this.ifMounted && this.setState({
                selectedBusiness: selectedBusiness
            })
        }, 100)
    }

    // Time functions
    _changeTime(weekday, type, e) {
        e.preventDefault()
        var selectedBusiness = this.state.selectedBusiness;

        // console.log(weekday, type, e.date.unix())

        if (type == "from") {
            selectedBusiness.schedules[weekday].openTime = Number(e.date.unix())
        } else if (type == "to") {
            selectedBusiness.schedules[weekday].closeTime = Number(e.date.unix())
        }
        this.ifMounted && this.setState((old) => {
            old.selectedBusiness = selectedBusiness
        });
    }

    _getMultiOptions(optioins) {
        var ret = []

        _.map(optioins, (o) => {
            ret.push({
                value: o.code,
                label: o.name
            })
        })
        return ret
    }

    _changeMultiOptions(field, selList) {
        var business = this.state.selectedBusiness;
        var options = []
        _.map(selList, (o) => {
            options.push(
                o.value
            )
        })
        business[field] = options;

        this.ifMounted && this.setState({ business });
    }

    _handleChange(address) {
        // update all fields when change content
        var selectedBusiness = this.state.selectedBusiness;
        selectedBusiness.geoLocation.address = address;
        // update selected state
        this.setState({ selectedBusiness });
    }

    _handleSelectPlace(address, placeId) {
        geocodeByAddress(address, (err, { lat, lng }, results) => {
            if (err) {
                $.notify(err, "warning");
                this.setState({
                    addressLoading: false
                })
            }

            // check address
            var selectedBusiness = this.state.selectedBusiness;
            var address_components = results[0]['address_components'];
            // check city available
            if (!_.contains(results[0]['types'], "locality")) {
                $.notify("Please input correct city string...", "warning");
            }
            selectedBusiness.geoLocation.address = address;
            selectedBusiness.geoLocation.placeId = placeId;
            selectedBusiness.geoLocation.geoJson = { type: "Point", coordinates: [lng, lat] };
            this.setState({ selectedBusiness });
        })
    }

    render() {

        const cssClasses = {
            root: 'form-group',
            label: 'form-label',
            input: 'Demo__search-input',
            autocompleteContainer: 'Demo__autocomplete-container'
        }

        const inputProps = {
            value: this.state.selectedBusiness.geoLocation.address || '',
            onChange: this.handleChange,
            onBlur: () => {
                console.log('blur!')
            },
            type: 'search',
            placeholder: "Please input location...",
            autoFocus: true,
            name: 'Demo__input',
        }

        const AutocompleteItem = ({ formattedSuggestion }) => (
            <div className="Demo__suggestion-item">
                <i className='fa fa-map-marker Demo__suggestion-icon' />
                <strong>{formattedSuggestion.mainText}</strong>{' '}
                <small className="text-muted">{formattedSuggestion.secondaryText}</small>
            </div>)

        return (
            <div>
                <div className="__introduce_header topnavbar">
                    <img src="img/logo_introduce_business.png" width="120" alt="Gogo" />
                </div>{ /* __introduce_header */}

                <div className="container __introduce_page">

                    <div className="__introduce_welcome">
                        <div className="__introduce_w_title">Bienvenido, {this._currentUser.name}</div>
                        <div className="__introduce_w_desc">Te invitamos a completar la siguiente información</div>
                    </div>{ /* __introduce_welcome */}

                    <div className="__introduce_form col-md-12">

                        <Panel>
                            <form id="updateForm" method="post" data-parsley-validate="" noValidate className="mb-lg" onSubmit={this._handleSubmit}>

                                <Row>
                                    <Col md={4}>
                                        <div className="pv">
                                            <img src={UtilService.getImageFromPath(this.state.selectedBusiness.logo)} alt="" className="center-block img-responsive img-rounded" style={{ height: '164px' }} />
                                        </div>
                                        <div className="text-center">
                                            <input
                                                type="file"
                                                ref="logo"
                                                data-classbutton="btn btn-default"
                                                data-classinput="form-control inline"
                                                className="form-control filestyle"
                                                accept="image/jpg,image/png,image/jpeg"
                                                onChange={this._changeField.bind(this, 'logo')} />
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <Row>
                                            <div className="panel-heading text-bold">Owner Information</div>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.selectedBusiness.owner_name || this._currentUser.name} placeholder="Name" onChange={this._changeField.bind(this, 'owner_name')} required="required" className="form-control" />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.selectedBusiness.owner_phone || ''} placeholder="Phone" onChange={this._changeField.bind(this, 'owner_phone')} required="required" className="form-control" />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.selectedBusiness.owner_email || this._currentUser.email} placeholder="Email" onChange={this._changeField.bind(this, 'owner_email')} required="required" className="form-control" readOnly />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.selectedBusiness.owner_identification || ''} placeholder="Identification" onChange={this._changeField.bind(this, 'owner_identification')} required="required" className="form-control" />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div className="panel-heading text-bold">Bank Account Information</div>
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.selectedBusiness.bankInfo ? this.state.selectedBusiness.bankInfo.name : '' || ''} placeholder="Bank Name" onChange={this._changeField.bind(this, 'bankName')} required="required" className="form-control" />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.selectedBusiness.bankInfo ? this.state.selectedBusiness.bankInfo.account : '' || ''} placeholder="Account Holder Name" onChange={this._changeField.bind(this, 'bankAccount')} required="required" className="form-control" />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.selectedBusiness.bankInfo ? this.state.selectedBusiness.bankInfo.number : '' || ''} placeholder="Number Account" onChange={this._changeField.bind(this, 'bankNumber')} required="required" className="form-control" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="panel-heading text-bold">More Information</div>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <select className="form-control" required="required" value={this.state.selectedBusiness.priceLevel || ''} onChange={this._changeField.bind(this, 'priceLevel')}>
                                                <option value="0">Price Level</option>
                                                <option value="1">$</option>
                                                <option value="2">$$</option>
                                                <option value="3">$$$</option>
                                                <option value="4">$$$$</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <select className="form-control" required="required" value={this.state.selectedBusiness.preparationTime || ''} onChange={this._changeField.bind(this, 'preparationTime')}>
                                                <option value="0">Prepartion time</option>
                                                <option value="1">10~25 mins</option>
                                                <option value="2">25~35 mins</option>
                                                <option value="3">35~45 mins</option>
                                                <option value="4">Over 1hr</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <input type="text" value={this.state.selectedBusiness.website || ''} placeholder="Website" required="required" onChange={this._changeField.bind(this, 'website')} className="form-control" />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <a href="#" className="form-control clearfix btn-block" onClick={this._handleSchedule}>
                                                <span className="pull-left">Schedule</span>
                                                <span className="pull-right">
                                                    <em className="fa fa-chevron-circle-right"></em>
                                                </span>
                                            </a>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <PlacesAutocomplete
                                                inputProps={inputProps}
                                                onSelect={this._handleSelectPlace}
                                                autocompleteItem={AutocompleteItem}
                                                classNames={cssClasses}
                                                onEnterKeyDown={this._handleSelectPlace}
                                                required="required"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <div className="form-group">
                                            <Select
                                                name="form-field-name"
                                                placeholder="Select meal kinds"
                                                value={this.state.selectedBusiness.mealKindCodes}
                                                options={this._getMultiOptions(this.state.mealKinds)}
                                                multi={true}
                                                onChange={this._changeMultiOptions.bind(this, 'mealKindCodes')}
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <div className="form-group">
                                            <Select
                                                name="form-field-name"
                                                placeholder="Select dietaries"
                                                value={this.state.selectedBusiness.dietaryCodes}
                                                options={this._getMultiOptions(this.state.dietaries)}
                                                multi={true}
                                                onChange={this._changeMultiOptions.bind(this, 'dietaryCodes')}
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <div className="form-group">
                                            <Select
                                                name="form-field-name"
                                                placeholder="Select food types"
                                                value={this.state.selectedBusiness.foodTypeCodes}
                                                options={this._getMultiOptions(this.state.foodTypes)}
                                                multi={true}
                                                onChange={this._changeMultiOptions.bind(this, 'foodTypeCodes')}
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <div className="form-group">
                                            <textarea value={this.state.selectedBusiness.description || ''} placeholder="Short Description" required="required" onChange={this._changeField.bind(this, 'description')} className="form-control" style={{ height: '85px', resize: 'none' }} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <button type="submit" className="btn __introduce_f_button_update">COMPLETE REGISTER</button>
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </Panel>
                    </div>{ /* __introduce_form */}
                </div>{ /* __introduce_page */}

                <Modal show={this.state.showModal} onHide={this._closeModal.bind(this)}>
                    <ModalHeader closeButton className="header_modals">
                        <Modal.Title>Please Select Your Schelude.</Modal.Title>
                    </ModalHeader>
                    <ModalBody className="body_modal">
                        <div className="schedule_list">
                            {
                                this.state.selectedBusiness.schedules.map((item, i) => {
                                    return (
                                        <div key={'schedule' + i} className="schedule_item">
                                            <Col sm={5} className="name_day">
                                                <Col sm={5}>
                                                    {item.name}
                                                </Col>
                                                <Col sm={5}>
                                                    <label className="switch switch-sm">
                                                        <input type="checkbox" id={"day_time_" + item.weekday} onClick={this._changeSwitch.bind(this, item.weekday)} />
                                                        <em></em>
                                                    </label>
                                                </Col>
                                                <Col sm={2}>

                                                </Col>
                                            </Col>
                                            <Col sm={7}>
                                                <Col sm={6}>
                                                    {/* <input type="time" className={'form-control'} required="required" onChange={this._changeTime.bind(this, 'day_' + item.id + '_from')} /> */}
                                                    <div id={"day_" + item.weekday + "_from"} className="input-group date">
                                                        <input type="text" className="form-control" required="required" value={UtilService.getShortTime1(item.openTime)} onChange={this._changeTime.bind(this, item.weekday, "from")} />
                                                        <span className="input-group-addon">
                                                            <span className="fa fa-clock-o"></span>
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    {/* <input type="time" className={'form-control'} required="required" onChange={this._changeTime.bind(this, 'day_' + item.id + '_to')} /> */}
                                                    <div id={"day_" + item.weekday + "_to"} className="input-group date">
                                                        <input type="text" className="form-control" required="required" value={UtilService.getShortTime1(item.closeTime)} onChange={this._changeTime.bind(this, item.weekday, "to")} />
                                                        <span className="input-group-addon">
                                                            <span className="fa fa-clock-o"></span>
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Col>
                                        </div>
                                    );
                                })
                            }
                        </div>{ /* schedule_list */}

                        <div className="botton_s">
                            &nbsp;
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

Introduce.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Introduce;