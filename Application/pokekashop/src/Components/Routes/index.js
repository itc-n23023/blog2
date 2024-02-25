import { Routes, Route } from 'react-router-dom'
import Products from '../../Components/Products'

function AppRoutes () {
  return (
    <Routes>
      <Route path='/' element={<Products />}></Route>
      <Route path='/:supertype' element={<Products />}></Route>
    </Routes>
  )
}
export default AppRoutes
