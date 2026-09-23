import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'


const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/foodData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      })
      let json = await response.json()
      console.log(json)
      if (!json.success) {
        alert("Enter Valid Credentials")
        return
      }
      localStorage.setItem('authToken', json.authToken)
      localStorage.setItem('userEmail', credentials.email)
      navigate('/home')
      alert("Login successful")
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    }
  }

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value })
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div
        className="card text-white shadow-lg"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#212529", // Matching your website's dark background
          border: "1px solid #198754", // Green border accent
          borderRadius: "10px"
        }}
      >
        <div className="card-header text-center" style={{ borderBottom: "1px solid #198754" }}>
          <h3 className="m-0 py-2" style={{ color: "#198754", fontWeight: "bold" }}>Login</h3>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label" style={{ fontWeight: "500" }}>Email address</label>
              <input
                type="email"
                className="form-control text-white shadow-none"
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="Enter your email"
                style={{
                  backgroundColor: "#2d333b",
                  borderColor: "#495057"
                }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label" style={{ fontWeight: "500" }}>Password</label>
              <input
                type="password"
                className="form-control text-white shadow-none"
                id="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Enter your password"
                style={{
                  backgroundColor: "#2d333b",
                  borderColor: "#495057"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 mt-2 py-2"
              style={{
                backgroundColor: "#198754", // GoFood Green
                color: "white",
                fontWeight: "bold",
                borderRadius: "6px"
              }}
            >
              Submit
            </button>
            <p className='mt-2 text-center'>Don't Have any Account<Link to='/signup' class="btn btn-link p-0 ms-1 align-baseline">Signup</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login