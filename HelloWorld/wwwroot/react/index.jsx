import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon, Menu, Table, Dropdown, Modal, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css'
import axios from 'axios';
import qs from 'querystring';
import _ from 'lodash';

const pagesOptions = [
    {
        text: '1',
        value: 1,

    },
    {
        text: '5',
        value: 5,

    },
    {
        text: '10',
        value: 10,

    },
]

//const state = { modalOpen: false }
//const handleOpen = () => this.setState({modalOpen:true})
//const handleClose = () => this.setState({modalOpen:false})



export default class Customers extends Component {
    //----------initial
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            modalOpen: false,
            modalEditOpen: false,
            modalDeleteOpen: false,
            name: '',
            address: '',
            addIsChange: false,
            createStatus: 'Create customer',
            editStatus: 'Edit customer',
            itemObject: {},

            clickedColumn: null,
            outputData: [],
            direction: null,
            pageDisplay: 10,
            countOutputArray: null,
            menuNum: null,
            outputArray: [],
            pageNum: 1,
        };
    }
    //--------'add customer' input control
    handleChangeName = (event) => {
        this.setState({ name: event.target.value });
        this.state.addIsChange = true;
    }
    handleChangeAddress = (event) => {
        this.setState({ address: event.target.value });
        this.state.addIsChange = true;
    }
    //--------'add customer' modal control
    handleOpen = () => this.setState({ modalOpen: true });

    handleClose = () => this.setState({ modalOpen: false });
    //--------'edit customer' modal control
    handleEditOpen = (item) => this.setState({
        modalEditOpen: true,
        itemObject: item,
        name: item.name,
        address: item.address,
    });

    handleEditClose = () => this.setState({ modalEditOpen: false });
    //--------'delete customer' modal control
    handleDeleteOpen = (item) => this.setState({
        modalDeleteOpen: true,
        itemObject: item,
    });

    handleDeleteClose = () => this.setState({ modalDeleteOpen: false });
    //---------------------------------------------
    componentDidMount() {
        this.getCustomerData();
    }
    //---------customer data
    getCustomerData = () => {
        axios.get("/Customers/GetAllCustomers")
            .then((data) => {
                this.setState({
                    customers: data.data,
                    countOutputArray: data.data.length,
                    menuNum: Math.ceil(data.data.length / this.state.pageDisplay),
                    outputArray: data.data.slice(0, this.state.pageDisplay),
                });
            })
            .catch(e => console.log(e));
        //this.getArray();
    }


    //-----------post data to customer
    postCustomerData = (data, path) => {

        axios.post(path, qs.stringify(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(() => {
                this.getCustomerData();
            })
            .catch(e => {
                console.log(e)
            });
    }
    //-----------reset status for customer add-----------------------
    //-----------------------------------------------------
    resetCreatCustomer = () => {
        this.setState({
            name: '',
            address: '',
            addIsChange: false,
            modalOpen: false,
            modalEditOpen: false,
            modalDeleteOpen: false,
        }, () => {
            console.log(this.state)
        });
    }
    //-----------handle Create Customer button in modal
    //---------------------------------------------------
    handleCreateCustomer = () => {

        if (this.state.addIsChange) {
            let newCustomerData = {
                Name: this.state.name,
                Address: this.state.address
            };
            this.postCustomerData(newCustomerData, "/Customers/Create");
            this.handleClose();
        }
    }

    //---------------------------------------------
    //---------------------------------------------
    //---------------------------------------------
    //---------------------------------------------
    //-----------create customer modal
    renderAddCustomerModal() {
        return (
            <Modal
                trigger={<Button onClick={this.handleOpen} color='blue'>New Customer</Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
                closeOnDimmerClick={false}>
                <Modal.Header>{this.state.createStatus}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <input type="text" placeholder='input your name' onChange={this.handleChangeName} />
                        </Form.Field>
                        <Form.Field>
                            <label>Address</label>
                            <input type="text" placeholder='input your address' onChange={this.handleChangeAddress} />

                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={this.handleClose}>
                        cancel
                    </Button>
                    <Button color='green' icon labelPosition='right'
                        onClick={this.handleCreateCustomer}
                    >
                        create
                        <Icon name='checkmark' />
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
    //------------edit customer modal
    handleEditCustomer = (e) => {
        console.log(e);
        if (this.state.addIsChange) {
            let newCustomerData = {
                Id: e,
                Name: this.state.name,
                Address: this.state.address
            };
            //this.postCustomerData(newCustomerData, "/Customers/Edit")
            axios.post("/Customers/Edit/" + e, qs.stringify(newCustomerData), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(() => {
                    this.getCustomerData();
                })
                .catch(e => {
                    console.log(e)
                });
            this.handleEditClose();
        }

    }
    handleDeleteCustomer = (e) => {

        axios.post("/Customers/Delete/" + e)
            .then(() => {
                this.getCustomerData();
            })
            .catch(e => {
                console.log(e)
            });
        this.handleDeleteClose();
    }
    //-----sort table
    //--back to page 1 if change sort maner in a page
    handleSort = (clickedColumnNameNow) => {
        const { clickedColumn, customers, direction } = this.state
        if (clickedColumnNameNow !== clickedColumn) {
            this.setState({
                clickedColumn: clickedColumnNameNow,
                direction: 'ascending',
                pageNum: 1,
                outputArray: _.sortBy(customers, [clickedColumnNameNow]).slice(0, this.state.pageDisplay),
            })
        }
        else {
            if (direction === 'ascending') {
                this.setState({
                    direction: 'descending',
                    pageNum: 1,
                    outputArray: _.sortBy(customers, [clickedColumnNameNow]).reverse().slice(0, this.state.pageDisplay),
                })
            }
            else if (direction === 'descending') {
                this.setState({
                    direction: null,
                    clickedColumn: null,
                    pageNum: 1,
                    outputArray: customers.slice(0, this.state.pageDisplay),
                })
            }

        }
    }
    //-----------display control
    handlePageDisplay = (event, data) => {
        // const { clickedColumn, customers, direction } = this.state
        this.setState({
            pageDisplay: data.value,
            menuNum: Math.ceil(this.state.countOutputArray / data.value),
            outputArray: this.sortArray(data.value),
            pageNum: 1,
        });

    }
    //---back to page 1 if change display items in a page
    sortArray = (pageDisplay) => {
        const { clickedColumn, customers, direction } = this.state
        if (direction === 'ascending') {
            return _.sortBy(customers, [clickedColumn]).slice(0, pageDisplay)
        }
        else if (direction === 'descending') {
            return _.sortBy(customers, [clickedColumn]).reverse().slice(0, pageDisplay);
        }
        else {
            return customers.slice(0, pageDisplay);
        }
    }

    sortArrayforChagePage = (pageDisplay, page) => {
        const { clickedColumn, customers, direction } = this.state

        if (direction === 'ascending') {
            return _.sortBy(customers, [clickedColumn]).slice((page - 1) * pageDisplay, page * pageDisplay)
        }
        else if (direction === 'descending') {
            return _.sortBy(customers, [clickedColumn]).reverse().slice((page - 1) * pageDisplay, page * pageDisplay);
        }
        else {
            return customers.slice((page - 1) * pageDisplay, page * pageDisplay);
        }
    }

    handlePages = (page) => {
        if (page === 0) {
            return;
        }
        else if (page > this.state.menuNum) {
            return;
        }
        else {
            this.setState({
                pageNum: page,
                outputArray: this.sortArrayforChagePage(this.state.pageDisplay, page)
            });
        }
    }


    handleMenu = () => {
        return (
            <Menu floated='right' pagination>
                <Menu.Item as='a' icon onClick={() => { this.handlePages(this.state.pageNum - 1) }}>
                    <Icon name='chevron left' />
                </Menu.Item>
                {Array.from(new Array(this.state.menuNum), (val, index) => index + 1)
                    .map(i => {
                        return (<Menu.Item key={i} as='a' onClick={() => { this.handlePages(i) }}>{i}</Menu.Item>)
                    })
                }

                <Menu.Item as='a' icon onClick={() => { this.handlePages(this.state.pageNum + 1) }}>
                    <Icon name='chevron right' />
                </Menu.Item>
            </Menu>
        )
    }
    //------------------display customer list
    renderCustomersCell() {
        return this.state.outputArray.map(item => {

            return (

                <Table.Row key={item.id}>
                    <Table.Cell >{item.name}</Table.Cell>
                    <Table.Cell >{item.address}</Table.Cell>
                    <Table.Cell>

                        <Modal trigger={<Button icon="edit" color='yellow' onClick={() => { this.handleEditOpen(item) }} content="Edit" />}
                            open={this.state.modalEditOpen}
                            onClose={this.handleEditClose}
                            closeOnDimmerClick={false}>
                            <Modal.Header>Edit customer</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <label>Name</label>
                                        <input value={this.state.name} onChange={this.handleChangeName} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Address</label>
                                        <input value={this.state.address} onChange={this.handleChangeAddress} />
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.handleEditClose}>cancel</Button>
                                <Button color='green' icon labelPosition='right'
                                    onClick={() => { this.handleEditCustomer(this.state.itemObject.id) }}>
                                    edit
                                        <Icon name='checkmark' />
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Table.Cell>
                    <Table.Cell>

                        <Modal trigger={
                            <Button icon labelPosition='left' color='red'
                                onClick={() => { this.handleDeleteOpen(item) }}>
                                <Icon name='trash' />
                                DELETE
                            </Button>
                        }
                            open={this.state.modalDeleteOpen}
                            onClose={this.handleDeleteClose}
                            closeOnDimmerClick={false}>
                            <Modal.Header>Delete customer</Modal.Header>
                            <Modal.Content>
                                <p>Are you sure?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.handleDeleteClose}>cancel</Button>
                                <Button color='red' icon labelPosition='right'
                                    onClick={() => { this.handleDeleteCustomer(this.state.itemObject.id) }}>
                                    delete
                                        <Icon name='delete' />
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Table.Cell>
                </Table.Row>
            )
        })
    }



    render() {
        const { clickedColumn, direction } = this.state

        return (
            <div>
                <div>
                    {this.renderAddCustomerModal()}
                    <Table sortable celled striped fixed>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={clickedColumn === 'name' ? direction : null}
                                    onClick={() => { this.handleSort('name') }}>
                                    Name
                        </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={clickedColumn === 'address' ? direction : null}
                                    onClick={() => { this.handleSort('address') }}>
                                    Address
                        </Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.renderCustomersCell()}
                        </Table.Body>

                        <Table.Footer>

                        </Table.Footer>
                    </Table>
                    <Dropdown
                        value={this.state.pageDisplay}
                        selection options={pagesOptions}
                        onChange={this.handlePageDisplay} />
                    {this.handleMenu()}
                </div>

            </div>);
    }
}

const app = document.getElementById('main');
ReactDOM.render(
    <div>
        <Customers />
    </div>
    , app);
