import React from 'react'
import { useCart } from '../../hooks/useCart'
import CartItem from '../CartItem/CartItem'
import { Link } from 'react-router-dom'


const Cart = () => {
    const {cart, getTotal, totalQuantity} = useCart()
    const total = getTotal()

    if (totalQuantity === 0) {
      return <h1>No hay items en el carrito</h1>
    }

    return (
      <div>
        {cart.map((item)=>( 
        <CartItem key={item.id} {...item}/>
        ))}
        <h3>Total: $ {total}</h3>
        <div>
          <Link to="/checkout" className='btn btn-primary'>Checkout</Link>
        </div>
      </div>
    )
}

export default Cart
