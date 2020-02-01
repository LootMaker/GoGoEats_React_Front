import { createStore } from 'redux';

const reducer = (state, action) => {

    if(action.type === "NEW_ORDER_REQUEST") {
        return {
            ...state,
            orders: state.orders.concat(action.message)
        }
    }
    
    return state;
}

export default createStore(reducer, { orders: [] });