import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Home from './screens/Home'
import Login from './screens/Login';
import Signup from './screens/Signup';
import MyCart from './screens/MyCart';
import MyOrders from './screens/MyOrders';
import { CartProvider } from './components/ContextReducer';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <div>
            <Routes>
              <Route path='/' element={<Navigate to='/home' replace />} />
              <Route exact path='/home' element={<Home />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/signup' element={<Signup />} />
              <Route exact path='/cart' element={<MyCart />} />
              <Route exact path='/myorders' element={<MyOrders />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </>
  )
}

export default App
