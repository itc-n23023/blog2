import { createContext, useState } from 'react'

export const CartContext = createContext({
  items: [],
  getCartQueryStr: () => {},
  getTotalQuantity: () => {},
  getProductQuantity: () => {},
  transformedCartItems: () => {},
  addOneToCart: () => {},
  changeItemQuantity: () => {},
  deleteFromCart: () => {},
  deleteAllFromCart: () => {}
})

export function CartProvider ({ children }) {
  const [cartProducts, setCartProducts] = useState([])

  // [ { id: 1 , quantity: 3 }, { id: 2, quantity: 1 } ]

  function getCartQueryStr () {
    // id:a OR id:b
    return cartProducts.map(item => `id:${item.id}`).join(' OR ')
  }

  function getTotalQuantity () {
    return cartProducts.reduce((sum, item) => sum + item.quantity, 0)
  }

  function getProductQuantity (id) {
    const quantity = cartProducts.find(product => product.id === id)?.quantity

    if (quantity === undefined) {
      return 0
    }

    return quantity
  }

  function transformedCartItems (cartItems) {
    return cartItems.map(item => {
      const price = item.cardmarket.prices.averageSellPrice
      const quantity = getProductQuantity(item.id)

      return {
        key: item.id,
        image: item.images.large,
        price: price,
        quantity: quantity,
        total: price * quantity
      }
    })
  }

  function addOneToCart (id) {
    const quantity = getProductQuantity(id)

    if (quantity === 0) {
      setCartProducts([
        ...cartProducts,
        {
          id: id,
          quantity: 1
        }
      ])
    } else {
      setCartProducts(
        cartProducts.map(product =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      )
    }
  }

  function changeItemQuantity (id, value) {
    setCartProducts(
      cartProducts.map(product =>
        product.id === id ? { ...product, quantity: value } : product
      )
    )
  }

  function deleteFromCart (id) {
    setCartProducts(cartProducts =>
      cartProducts.filter(currentProduct => {
        return currentProduct.id !== id
      })
    )
  }

  function deleteAllFromCart () {
    setCartProducts([])
  }

  const contextValue = {
    items: cartProducts,
    getCartQueryStr,
    getTotalQuantity,
    getProductQuantity,
    transformedCartItems,
    addOneToCart,
    changeItemQuantity,
    deleteFromCart,
    deleteAllFromCart
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}

export default CartProvider
