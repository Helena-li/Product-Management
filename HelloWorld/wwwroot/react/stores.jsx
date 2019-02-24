import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon, Label, Menu, Table, Dropdown, Modal, Form, Pagination } from 'semantic-ui-react'
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
export default class Stores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stores: [],
            openAddStatus: false,
            openEditStatus: false,
            openDeleteStatus: false,
            itemObject: {},
            storeName: '',
            storeAddress: '',
            activePage: 1,
            totalPages: 1,
            itemsPerPage: 10,
            itemsTotalNum: 0,

            outputArray: [],
            clickedColumn: null,
            direction: null,
            dateTime: [],
        }
    }
    componentDidMount() {
        this.getAllStores();
    }
    getAllStores() {
        axios.get("/Stores/GetAllStores")
            .then(data => this.setState({
                stores: data.data,
                itemsTotalNum: data.data.length,
                totalPages: Math.ceil(data.data.length / this.state.itemsPerPage),
                outputArray: data.data.slice(0, this.state.itemsPerPage),
            }))
            .catch(e => console.log(e));
    }
    //------------post
    handleEditStore = (e) => {
        let data = {
            Name: this.state.storeName,
            Address: this.state.storeAddress
        }
        axios.post("/Stores/Edit/" + e, qs.stringify(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(() => {
                this.getAllStores();
            })
            .catch(e => {
                console.log(e)
            });
        this.handleEditClose();
    }
    handleDeleteStore = (e) => {
        axios.post("/Stores/Delete/" + e)
            .then(() => {
                this.getAllStores();
            })
            .catch(e => {
                console.log(e)
            });
        this.handleDeleteClose();
    }
    postAddStores = () => {
        let data = {
            Name: this.state.storeName,
            Address: this.state.storeAddress
        }
        axios.post("/Stores/Create", qs.stringify(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(() => {
                this.getAllStores();
            })
            .catch(e => {
                console.log(e)
            });
        this.handleAddClose();
    }
    //-------------handle modal open status
    handleEditOpen = (item) => {
        this.setState({
            openEditStatus: true,
            itemObject: item,
            storeName: item.name,
            storeAddress: item.address
        })
    }
    handleEditClose = () => {
        this.setState({ openEditStatus: false })
    }
    handleDeleteOpen = (item) => {
        this.setState({
            openDeleteStatus: true,
            itemObject: item,
        })
    }
    handleDeleteClose = () => {
        this.setState({ openDeleteStatus: false });
    }
    handleAddOpen = () => {
        this.setState({ openAddStatus: true });
    }
    handleAddClose = () => {
        this.setState({ openAddStatus: false });
    }
    //--------on change handles
    handleChangeName = (event) => {
        this.setState({ storeName: event.target.value });
    }
    handleChangeAddress = (event) => {
        this.setState({ storeAddress: event.target.value });
    }
    //-----------sort and page control
    handlePaginationChange = (e, { activePage }) => {
        this.setState({
            activePage,
            outputArray: this.sortArray(this.state.itemsPerPage, activePage),
        })
    }
    changePageDisplayItems = (event, data) => {
        this.setState({
            itemsPerPage: data.value,
            totalPages: Math.ceil(this.state.itemsTotalNum / data.value),
            outputArray: this.sortArray(data.value, 1),
            activePage: 1,
        });
    }

    sortArray = (pageDisplay, page) => {
        const { clickedColumn, stores, direction } = this.state

        if (direction === 'ascending') {
            return _.sortBy(stores, [clickedColumn]).slice((page - 1) * pageDisplay, page * pageDisplay)
        }
        else if (direction === 'descending') {
            return _.sortBy(stores, [clickedColumn]).reverse().slice((page - 1) * pageDisplay, page * pageDisplay);
        }
        else {
            return stores.slice((page - 1) * pageDisplay, page * pageDisplay);
        }
    }

    handleSort = (clickedColumnNameNow) => {
        const { clickedColumn, stores, direction } = this.state
        if (clickedColumnNameNow !== clickedColumn) {
            this.setState({
                clickedColumn: clickedColumnNameNow,
                direction: 'ascending',
                activePage: 1,
                outputArray: _.sortBy(stores, [clickedColumnNameNow]).slice(0, this.state.itemsPerPage),
            })
        }
        else {
            if (direction === 'ascending') {
                this.setState({
                    direction: 'descending',
                    activePage: 1,
                    outputArray: _.sortBy(stores, [clickedColumnNameNow]).reverse().slice(0, this.state.itemsPerPage),
                })
            }
            else if (direction === 'descending') {
                this.setState({
                    direction: null,
                    clickedColumn: null,
                    activePage: 1,
                    outputArray: stores.slice(0, this.state.itemsPerPage),
                })
            }

        }
    }
    //----------------
    renderStoresCells() {
        return this.state.outputArray.map(item => {
            return (
                <Table.Row key={item.id}>
                    <Table.Cell >{item.name}</Table.Cell>
                    <Table.Cell >{item.address}</Table.Cell>
                    <Table.Cell>
                        <Modal trigger={<Button icon="edit" color='yellow' onClick={() => { this.handleEditOpen(item) }} content="Edit" />}
                            open={this.state.openEditStatus}
                            onClose={this.handleEditClose}
                            closeOnDimmerClick={false}>
                            <Modal.Header>Edit Stores</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <label>Name</label>
                                        <input value={this.state.storeName} onChange={this.handleChangeName} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Address</label>
                                        <input value={this.state.storeAddress} onChange={this.handleChangeAddress} />
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.handleEditClose}>cancel</Button>
                                <Button color='green' icon labelPosition='right'
                                    onClick={() => { this.handleEditStore(this.state.itemObject.id) }}>
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
                            open={this.state.openDeleteStatus}
                            onClose={this.handleDeleteClose}
                            closeOnDimmerClick={false}>
                            <Modal.Header>Delete Stores</Modal.Header>
                            <Modal.Content>
                                <p>Are you sure?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.handleDeleteClose}>cancel</Button>
                                <Button color='red' icon labelPosition='right'
                                    onClick={() => { this.handleDeleteStore(this.state.itemObject.id) }}>
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
    renderAddStore() {
        return (
            <div>
                <Modal trigger={<Button color='blue' onClick={this.handleAddOpen} >New Store</Button>}
                    open={this.state.openAddStatus}
                    onClose={this.handleAddClose}
                    closeOnDimmerClick={false}>
                    <Modal.Header>Create Stores</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <input value={this.state.storeName} onChange={this.handleChangeName} />
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <input value={this.state.storeAddress} onChange={this.handleChangeAddress} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.handleAddClose}>cancel</Button>
                        <Button color='green' icon labelPosition='right'
                            onClick={this.postAddStores}>
                            create
                            <Icon name='checkmark' />
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
    render() {
        const { activePage, totalPages, clickedColumn, direction } = this.state
        return (
            <div>
                {this.renderAddStore()}
                <Table celled striped fixed sortable>
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
                    <Table.Body>{this.renderStoresCells()}</Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <div>
                    <Dropdown compact value={this.state.itemsPerPage}
                        selection options={pagesOptions}
                        onChange={this.changePageDisplayItems} />
                    <Pagination floated='right'
                        onPageChange={this.handlePaginationChange}
                        activePage={activePage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        )
    }
}
const app = document.getElementById('main');
ReactDOM.render(<div><Stores /></div>, app);