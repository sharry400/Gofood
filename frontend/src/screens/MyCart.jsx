import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { usecart, usedispatchcart } from '../components/ContextReducer'

const MyCart = () => {
    const cartItems = usecart()
    const dispatch = usedispatchcart()
    const navigate = useNavigate()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.qty),
        0
    )

    const handleRemoveItem = (id, size) => {
        dispatch({ type: 'REMOVE', id, size })
    }

    const handleQtyChange = (id, size, qty) => {
        dispatch({ type: 'UPDATE_QTY', id, size, qty: Number(qty) })
    }

    const handleCheckout = async () => {
        if (!localStorage.getItem('authToken')) {
            alert('Please login first')
            navigate('/login')
            return
        }

        if (cartItems.length === 0 || isCheckingOut) {
            return
        }

        const email = localStorage.getItem('userEmail')
        if (!email) {
            alert('Please login again before checkout')
            navigate('/login')
            return
        }

        const orderData = {
            email,
            orderItems: cartItems,
            totalAmount,
        }

        setIsCheckingOut(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/orderData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(orderData)
            })

            let json
            try {
                json = await response.json()
            } catch {
                throw new Error(`Checkout failed with status ${response.status}`)
            }

            if (!response.ok || !json.success) {
                throw new Error(json.message || `Checkout failed with status ${response.status}`)
            }

            dispatch({ type: 'DROP' })
            alert('Order placed successfully')
            navigate('/home')
        } catch (error) {
            console.error(error)
            alert(error.message || 'Something went wrong while placing order')
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className='container mt-5'>
                <h2 className='mb-4'>My Cart</h2>

                {cartItems.length === 0 ? (
                    <div className='text-center'>
                        <h4>Your cart is empty</h4>
                        <button className='btn btn-success mt-3' onClick={() => navigate('/home')}>
                            Go to Home
                        </button>
                    </div>
                ) : (
                    <div className='row'>
                        <div className='col-md-8'>
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${item.size}-${index}`} className='card mb-3'>
                                    <div className='card-body d-flex justify-content-between align-items-center'>
                                        <div className='d-flex align-items-center gap-3 m-1'>
                                            <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} className='me-3' />
                                            <div>
                                                <h5>{item.name}</h5>
                                                <p className='mb-1'>Size: {item.size}</p>
                                                <p className='mb-0'>Price: Rs. {Number(item.price)}</p>
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center gap-2'>
                                            <select
                                                className='form-select form-select-sm'
                                                value={item.qty}
                                                onChange={(e) => handleQtyChange(item.id, item.size, e.target.value)}
                                            >
                                                {[1, 2, 3, 4, 5, 6].map((qty) => (
                                                    <option key={qty} value={qty}>{qty}</option>
                                                ))}
                                            </select>
                                            <button className='btn btn-sm btn-danger' onClick={() => handleRemoveItem(item.id, item.size)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='col-md-4'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h4>Order Summary</h4>
                                    <p className='mb-2'>Items: {cartItems.reduce((sum, item) => sum + Number(item.qty), 0)}</p>
                                    <p className='mb-2'>Delivery: Free</p>
                                    <h5>Total: Rs. {totalAmount}</h5>
                                    <button className='btn btn-success w-100 mt-3' onClick={handleCheckout} disabled={isCheckingOut}>
                                        {isCheckingOut ? 'Processing...' : 'Checkout'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default MyCart
