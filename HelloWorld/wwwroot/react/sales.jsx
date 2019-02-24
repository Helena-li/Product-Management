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
export default class Sales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sale: [],
            customers: [],
            products: [],
            stores: [],
            saleItem: {},
            customerId: null,
            productId: null,
            storeId: null,
            dateSold: '',
            openAddStatus: false,
            openEditStatus: false,
            openDeleteStatus: false,

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
        this.getAllSales();
        this.getAllOptions();

    }
    getAllSales = () => {
        axios.get("/Sales/AllSales")
            .then((data) => {
                this.setState({
                    sale: data.data,
                    itemsTotalNum: data.data.length,
                    totalPages: Math.ceil(data.data.length / this.state.itemsPerPage),
                    outputArray: data.data.slice(0, this.state.itemsPerPage),
                });
            }).catch(e => console.log(e));
    }
    getAllOptions = () => {
        axios.get("/Customers/GetAllCustomers")
            .then((data) => {
                this.setState({ customers: data.data.map(x => { return { text: x.name, value: x.id } }) });
            })
            .catch(e => console.log(e))
        axios.get("/Products/GetAllProducts")
            .then((data) => {
                this.setState({ products: data.data.map(x => { return { text: x.name, value: x.id } }) });
            })
            .catch(e => console.log(e))
        axios.get("/Stores/GetAllStores")
            .then((data) => {
                this.setState({ stores: data.data.map(x => { return { text: x.name, value: x.id } }) });
            })
            .catch(e => console.log(e))
    }
    //------------post data
    postEditSales = () => {
        let data = {
            ProductId: this.state.productId,
            CustomerId: this.state.customerId,
            StoreId: this.state.storeId,
            DateSold: this.state.dateSold,
        }
        axios.post("/Sales/Edit/" + this.state.saleItem.id, qs.stringify(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(() => {
                this.getAllSales();
            })
            .catch(e => {
                console.log(e)
            });
        this.handleEditClose();
    }

    postAddSales = () => {
        let data = {
            ProductId: this.state.productId,
            CustomerId: this.state.customerId,
            StoreId: this.state.storeId,
            DateSold: this.state.dateSold,
        }
        axios.post("/Sales/Create", qs.stringify(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(() => {
                this.getAllSales();
            })
            .catch(e => {
                console.log(e)
            });
        this.handleAddClose();
    }
    deleteSaleRecords = (e) => {
        axios.post("/Sales/Delete/" + e)
            .then(() => {
                this.getAllSales();
            })
            .catch(e => {
                console.log(e)
            });
        this.handleDeleteClose();
    }
    //-------------handle modal open status
    handleEditOpen = (item) => {
        this.setState({
            openEditStatus: true,
            saleItem: item,
            customerId: item.customerId,
            productId: item.productId,
            storeId: item.storeId,
            dateSold: item.date,
        })
    }
    handleEditClose = () => {
        this.setState({ openEditStatus: false })
    }
    handleDeleteOpen = (item) => {
        this.setState({
            openDeleteStatus: true,
            saleItem: item,
        })
    }
    handleDeleteClose = () => {
        this.setState({ openDeleteStatus: false })
    }
    handleAddOpen = () => {
        this.setState({ openAddStatus: true })
    }
    handleAddClose = () => {
        this.setState({ openAddStatus: false })
    }
    //----------------

    //---------change dropdown for edit
    changeCustomer = (event, data) => {
        this.setState({ customerId: data.value })
    }
    changeProduct = (event, data) => {
        this.setState({ productId: data.value })
    }
    changeStore = (event, data) => {
        this.setState({ storeId: data.value })
    }
    changeDate = (event) => {
        this.setState({ dateSold: event.target.value });
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
        const { clickedColumn, sale, direction } = this.state

        if (direction === 'ascending') {
            return _.sortBy(sale, [clickedColumn]).slice((page - 1) * pageDisplay, page * pageDisplay)
        }
        else if (direction === 'descending') {
            return _.sortBy(sale, [clickedColumn]).reverse().slice((page - 1) * pageDisplay, page * pageDisplay);
        }
        else {
            return sale.slice((page - 1) * pageDisplay, page * pageDisplay);
        }
    }

    handleSort = (clickedColumnNameNow) => {
        const { clickedColumn, sale, direction } = this.state
        if (clickedColumnNameNow === 'dateSort') {
            sale.map(item => {
                item.dateSort = new Date(item.date)
            });
        }

        if (clickedColumnNameNow !== clickedColumn) {
            this.setState({
                clickedColumn: clickedColumnNameNow,
                direction: 'ascending',
                activePage: 1,
                outputArray: _.sortBy(sale, [clickedColumnNameNow]).slice(0, this.state.itemsPerPage),
            })
        }
        else {
            if (direction === 'ascending') {
                this.setState({
                    direction: 'descending',
                    activePage: 1,
                    outputArray: _.sortBy(sale, [clickedColumnNameNow]).reverse().slice(0, this.state.itemsPerPage),
                })
            }
            else if (direction === 'descending') {
                this.setState({
                    direction: null,
                    clickedColumn: null,
                    activePage: 1,
                    outputArray: sale.slice(0, this.state.itemsPerPage),
                })
            }

        }
    }
    //--------------display sales list
    renderSalesCell() {
        return this.state.outputArray.map(item => {
            return (

                <Table.Row key={item.id}>
                    <Table.Cell >{item.customer}</Table.Cell>
                    <Table.Cell >{item.product}</Table.Cell>
                    <Table.Cell>{item.store}</Table.Cell>
                    <Table.Cell>{item.date}</Table.Cell>
                    <Table.Cell>
                        <Modal trigger={
                            <Button icon labelPosition='left' color='yellow'
                                onClick={() => { this.handleEditOpen(item) }} >
                                <Icon name='edit' />
                                Edit
                            </Button>}
                            open={this.state.openEditStatus}
                            onClose={this.handleEditClose}
                            closeOnDimmerClick={false}>
                            <Modal.Header>Edit sales</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <label>Date sold</label>
                                        <input value={this.state.dateSold} onChange={this.changeDate} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Customer</label>
                                        <Dropdown value={this.state.customerId} selection options={this.state.customers}
                                            onChange={this.changeCustomer} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Product</label>
                                        <Dropdown value={this.state.productId} selection options={this.state.products}
                                            onChange={this.changeProduct} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Store</label>
                                        <Dropdown value={this.state.storeId} selection options={this.state.stores}
                                            onChange={this.changeStore} />
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black'
                                    onClick={this.handleEditClose}>cancel</Button>
                                <Button color='green' icon labelPosition='right'
                                    onClick={this.postEditSales}>
                                    Edit
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
                            </Button>}
                            open={this.state.openDeleteStatus}
                            onClose={this.handleDeleteClose}
                            closeOnDimmerClick={false}>
                            <Modal.Header>Delete sales</Modal.Header>
                            <Modal.Content>
                                <p>Are you sure?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.handleDeleteClose} >cancel</Button>
                                <Button color='red' icon labelPosition='right'
                                    onClick={() => this.deleteSaleRecords(this.state.saleItem.id)}>
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
    //-----------------------------------
    render() {
        const { activePage, totalPages, clickedColumn, direction } = this.state
        return (
            <div>
                <Modal trigger={<Button color='blue' onClick={this.handleAddOpen} >New Sales</Button>}
                    open={this.state.openAddStatus}
                    onClose={this.handleAddClose}
                    closeOnDimmerClick={false}>
                    <Modal.Header>Create sales</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Date sold</label>
                                <input placeholder='please input the date' onChange={this.changeDate} />
                            </Form.Field>
                            <Form.Field>
                                <label>Customer</label>
                                <Dropdown placeholder='' selection options={this.state.customers} onChange={this.changeCustomer} />
                            </Form.Field>
                            <Form.Field>
                                <label>Product</label>
                                <Dropdown placeholder='' selection options={this.state.products} onChange={this.changeProduct} />
                            </Form.Field>
                            <Form.Field>
                                <label>Store</label>
                                <Dropdown placeholder='' selection options={this.state.stores} onChange={this.changeStore} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.handleAddClose}>cancel</Button>
                        <Button color='green' icon labelPosition='right'
                            onClick={this.postAddSales}>
                            create
                                <Icon name='checkmark' />
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Table celled striped fixed sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                sorted={clickedColumn === 'customer' ? direction : null}
                                onClick={() => { this.handleSort('customer') }}>
                                Customer
                                </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={clickedColumn === 'product' ? direction : null}
                                onClick={() => { this.handleSort('product') }}>
                                Product
                                </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={clickedColumn === 'store' ? direction : null}
                                onClick={() => { this.handleSort('store') }}>
                                Store
                                </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={clickedColumn === 'dateSort' ? direction : null}
                                onClick={() => { this.handleSort('dateSort') }}>
                                Date Sold
                                </Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{this.renderSalesCell()}</Table.Body>
                    <Table.Footer>
                        <Table.Row></Table.Row>
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
const app = document.getElementById('salesMain');
ReactDOM.render(
    <Sales />
    , app);

