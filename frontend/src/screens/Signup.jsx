import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Signup = () => {
    const nav = useNavigate()
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", location: "", confirmPassword: "" })
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (credentials.password !== credentials.confirmPassword) {
            alert("Passwords do not match")
            return
        }
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/foodData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: credentials.name,
                    location: credentials.location,
                    email: credentials.email,
                    password: credentials.password
                })
            })
            const json = await response.json()
            console.log(json)
            if (!json.success) {
                alert("Enter Valid Credentials")
                return
            }
            else {
                localStorage.setItem('token', json.authToken)
                nav('/login')
                alert("Signup successful")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        }
    }
    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value })
    }
    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", margin: "40px auto" }}>
                <div
                    className="card text-white shadow-lg"
                    style={{
                        maxWidth: "500px",
                        width: "100%",
                        backgroundColor: "#212529",
                        border: "1px solid #198754",
                        borderRadius: "10px"
                    }}
                >
                    <div className="card-header text-center" style={{ borderBottom: "1px solid #198754" }}>
                        <h3 className="m-0 py-2" style={{ color: "#198754", fontWeight: "bold" }}>Sign Up</h3>
                    </div>

                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label" style={{ fontWeight: "500" }}>Name</label>
                                <input
                                    type="text"
                                    className="form-control text-white shadow-none"
                                    id="name"
                                    name="name"
                                    value={credentials.name}
                                    onChange={onChange}
                                    placeholder="Enter your name"
                                    style={{ backgroundColor: "#2d333b", borderColor: "#495057" }}
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label" style={{ fontWeight: "500" }}>Email address</label>
                                <input
                                    type="email"
                                    className="form-control text-white shadow-none"
                                    id="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={onChange}
                                    placeholder="Enter your email"
                                    autoComplete="off"
                                    style={{ backgroundColor: "#2d333b", borderColor: "#495057" }}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label" style={{ fontWeight: "500" }}>Password</label>
                                <input
                                    type="password"
                                    className="form-control text-white shadow-none"
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={onChange}
                                    placeholder="Enter your password"
                                    style={{ backgroundColor: "#2d333b", borderColor: "#495057" }}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label" style={{ fontWeight: "500" }}>Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control text-white shadow-none"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={credentials.confirmPassword}
                                    onChange={onChange}
                                    placeholder="Confirm your password"
                                    style={{ backgroundColor: "#2d333b", borderColor: "#495057" }}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="location" className="form-label" style={{ fontWeight: "500" }}>Address</label>
                                <input
                                    type="text"
                                    className="form-control text-white shadow-none"
                                    id="location"
                                    name="location"
                                    value={credentials.location}
                                    onChange={onChange}
                                    placeholder="Enter your full address"
                                    style={{ backgroundColor: "#2d333b", borderColor: "#495057" }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn w-100 mt-2 py-2"
                                style={{
                                    backgroundColor: "#198754",
                                    color: "white",
                                    fontWeight: "bold",
                                    borderRadius: "6px"
                                }}
                            >
                                Submit
                            </button>
                            <p className='mt-2 text-center'>Already Have an Account<Link to='/login' class="btn btn-link p-0 ms-1 align-baseline">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup