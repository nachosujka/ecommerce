import  { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { addDoc, collection, documentId, getDocs, query, where, writeBatch } from "firebase/firestore"
import {db} from '../../services/firebase'
import Swal from 'sweetalert2'
 const Checkout = () => {

  const [loading, setLoading] = useState(false)
  const [orderCreated, SetOrderCreated] = useState(false)

  const {cart, totalQuantity, getTotal, clearCart} = useCart()
  const total = getTotal()


  const createOrder = async () =>{
    setLoading(true)
    try{
const objOrder ={
  buyer:{
    name: "Leandro",
lastName: "Martinez",
phone: "1147983147",
addres: "qcq"
  },
  items: cart,
  totalQuantity,
  total,
  date: new Date()
}
const ids= cart.map((item)=>item.id)

const productRef = collection(db, "products")

const productsAddedFromFirestore = await getDocs(
  query(productRef, where(documentId(), "in", ids)))
const {docs} = productsAddedFromFirestore;

const outOfStock = []
const batch = writeBatch(db)

docs.forEach((doc)=>{
  const dataDoc = doc.data()
  const stockDB = dataDoc.stock

  const productAddedToCart = cart.find((prod)=> prod.id === doc.id)
  const productQuantity = productAddedToCart?.quantity;
  
  if (stockDB>= productQuantity) {
    batch.update(doc.ref, {stock: stockDB - productQuantity})
  }else{
outOfStock.push({id: doc.id, ...dataDoc})
  }
})

if (outOfStock.length === 0) {
  await batch.commit()

  const orderRef = collection(db, "orders")
  const orderAdded = await addDoc(orderRef, objOrder)
  console.log(`El id de su orden es ${orderAdded.id}`)
  Swal.fire({
    text: "Su compra a sido realizada",
    icon: "success"
  })
  SetOrderCreated(true)
  clearCart()
}else{
  Swal.fire({
    text: "Hay productos que estan fuera de stock",
    icon: "error"
  })
}
    }catch(error){
      console.log("")
    }finally{
      setLoading(false)
    }

    if (loading) {
      return <h1>Se esta generando la orden</h1>
    }

    if (orderCreated) {
      return <h1>La orden fue creada correctamente</h1>
    }

  }
    return (
      <>
        <div>
        {cart.map((item) => (
          <article key={item.id}>
            <header>
              <h2 className="text-secondary text-center bg-info m-5">
                {item.name}{" "}
                <span className="badge">Cantidad: {totalQuantity}</span>
              </h2>
            </header>
          </article>
        ))}
      </div>
      <h1 className="text-center">Checkout</h1>
      {/* formulario */}
      <div className="d-flex justify-content-center p-3 ">
        <button className="btn btn-info" onClick={createOrder}>
          Generar Orden
        </button>
      </div>
      </>
    )
  }


export default Checkout
