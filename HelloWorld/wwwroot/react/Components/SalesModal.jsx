import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

const ButtonExampleButton = () => <Button>Click Here</Button>

export default class ButtonExampleButton extends Component {
    render() {
        return (
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

        )
    }
}



