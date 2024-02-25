import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppHeader from './Components/Header'
import PageContent from './Components/PageContent'
import CartProvider from './CartContext'

function App () {
  return (
    <div className='App'>
      <CartProvider>
        <BrowserRouter>
          <AppHeader />
          <PageContent />
        </BrowserRouter>
      </CartProvider>
    </div>
  )
}
export default App
