import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const MyOrders = () => {
    const [orderData, setOrderData] = useState([])

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const email = localStorage.getItem('userEmail')

                if (!email) {
                    return
                }

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/myOrderData?email=${encodeURIComponent(email)}`)
                const json = await response.json()

                if (json.success) {
                    setOrderData(json.orderData)
                }
            } catch (error) {
                console.error('Unable to fetch order history:', error)
            }
        }

        fetchMyOrders()
    }, [])

    return (
        <>
            <Navbar />
            <div className='container mt-5'>
                <h2 className='mb-4'>My Orders</h2>

                {orderData.length === 0 ? (
                    <div className='alert alert-info'>No orders yet.</div>
                ) : (
                    orderData.map((order, orderIndex) => (
                        <div key={`${order._id || orderIndex}`} className='card mb-4'>
                            <div className='card-body'>
                                <h5 className='card-title'>Order #{orderIndex + 1}</h5>
                                <p className='mb-2'>Placed on: {new Date(order.date).toLocaleString()}</p>
                                <p className='mb-3'>Total Amount: Rs. {order.totalAmount}</p>

                                {order.orderItems && order.orderItems.map((item, itemIndex) => (
                                    <div key={`${item.id || itemIndex}-${item.size}`} className='d-flex align-items-center border-top py-3'>
                                        <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} className='me-3' />
                                        <div>
                                            <h6>{item.name}</h6>
                                            <p className='mb-1'>Size: {item.size}</p>
                                            <p className='mb-1'>Qty: {item.qty}</p>
                                            <p className='mb-0'>Price: Rs. {Number(item.price) * Number(item.qty)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

export default MyOrders
