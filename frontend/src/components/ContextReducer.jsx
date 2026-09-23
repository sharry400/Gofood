import React, { createContext, useContext, useEffect, useReducer } from 'react'

const CartstateContext = createContext()
const CartDispatchContext = createContext()
const CART_STORAGE_KEY = 'gofood_cart'

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD': {
            const item = action.item
            const existingItem = state.find(
                (cartItem) => cartItem.id === item.id && cartItem.size === item.size
            )

            if (existingItem) {
                return state.map((cartItem) =>
                    cartItem.id === item.id && cartItem.size === item.size
                        ? { ...cartItem, qty: cartItem.qty + item.qty }
                        : cartItem
                )
            }

            return [...state, item]
        }

        case 'REMOVE': {
            return state.filter(
                (cartItem) => !(cartItem.id === action.id && cartItem.size === action.size)
            )
        }

        case 'UPDATE_QTY': {
            return state.map((cartItem) =>
                cartItem.id === action.id && cartItem.size === action.size
                    ? { ...cartItem, qty: action.qty }
                    : cartItem
            )
        }

        case 'DROP': {
            return []
        }

        default:
            return state
    }
}

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, [], () => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY)
            return savedCart ? JSON.parse(savedCart) : []
        } catch (error) {
            console.error('Unable to load cart from storage:', error)
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
        } catch (error) {
            console.error('Unable to save cart to storage:', error)
        }
    }, [state])

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartstateContext.Provider value={state}>
                {children}
            </CartstateContext.Provider>
        </CartDispatchContext.Provider>
    )
}

export const usecart = () => useContext(CartstateContext)
export const usedispatchcart = () => useContext(CartDispatchContext)