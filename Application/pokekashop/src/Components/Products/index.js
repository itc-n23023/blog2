import {
  Button,
  Card,
  Image,
  List,
  message,
  Input,
  Pagination,
  Typography
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useEffect, useState, useContext } from 'react'
import { getProductsByCategory } from '../../API'
import { useParams } from 'react-router-dom'
import { CartContext } from '../../CartContext'

function Products () {
  const [loading, setLoading] = useState(false)
  const param = useParams()
  const cart = useContext(CartContext)
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(1)
  const [page, setPage] = useState(1)
  const [superType, setSuperType] = useState('*')
  const [name, setName] = useState('')

  useEffect(() => {
    const superType = param?.supertype ? param.supertype : '*'
    setSuperType(superType)
    setPage(1)
    setName('')
    setLoading(true)
    getProductsByCategory(1, superType, '*').then(res => {
      if (!res) return
      setItems(res.data)
      setTotalCount(res.totalCount)
      setLoading(false)
    })
  }, [param])

  // Pagination
  const fetchProductsByName = name => {
    setLoading(true)
    setPage(1)
    setName(name)
    getProductsByCategory(1, superType, name ? `*${name}*` : '*').then(res => {
      if (!res) return
      setItems(res.data)
      setTotalCount(res.totalCount)
      setLoading(false)
    })
  }

  const fetchProducts = page => {
    setLoading(true)
    setPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    getProductsByCategory(page, superType, name ? `*${name}*` : '*').then(
      res => {
        if (!res) return
        setItems(res.data)
        setLoading(false)
      }
    )
  }

  return (
    <div className='productsContainer'>
      <div className='paginationContainer'>
        <Input
          addonBefore={<SearchOutlined />}
          placeholder='search name'
          style={{ width: 500 }}
          value={name}
          onChange={event => fetchProductsByName(event.target.value)}
        />
        <Typography.Title level={5}>{totalCount} items</Typography.Title>
      </div>
      <List
        loading={loading}
        grid={{ column: 5 }}
        renderItem={(product, index) => {
          return (
            <Card
              className='itemCard'
              key={index}
              cover={<Image src={product.images.large} />}
            >
              Price: €{product.cardmarket.prices.averageSellPrice}
              <Button
                type='link'
                onClick={() => {
                  message.success(`${product.name} has been added to cart!`)
                  cart.addOneToCart(product.id)
                }}
              >
                Add to Cart
              </Button>
            </Card>
          )
        }}
        dataSource={items}
      />
      <div className='paginationContainer'>
        <Pagination
          total={totalCount}
          showTotal={total => `Total ${total} items`}
          pageSize={40}
          showSizeChanger={false}
          current={page}
          onChange={page => fetchProducts(page)}
        />
      </div>
    </div>
  )
}

export default Products
