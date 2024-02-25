import {
  HomeFilled,
  ShoppingCartOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Drawer,
  InputNumber,
  Menu,
  message,
  Table,
  Image,
  Typography
} from 'antd'
import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart } from '../../API'
import { CartContext } from '../../CartContext'

const { Text } = Typography

function AppHeader () {
  const navigate = useNavigate()

  const onMenuClick = item => {
    navigate(`/${item.key}`)
  }
  return (
    <div className='appHeader'>
      <Menu
        className='appMenu'
        onClick={onMenuClick}
        mode='horizontal'
        items={[
          {
            label: <HomeFilled />,
            key: ''
          },
          {
            label: 'type',
            key: 'supertype',
            children: [
              {
                label: 'AllCards',
                key: '*'
              },
              {
                label: 'Pokémon',
                key: 'Pokémon'
              },
              {
                label: 'Trainers',
                key: 'Trainer'
              },
              {
                label: 'Energy',
                key: 'Energy'
              }
            ]
          }
        ]}
      />
      <Typography.Title>Pokemon Card Store</Typography.Title>
      <AppCart />
    </div>
  )
}
function AppCart () {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)
  const cart = useContext(CartContext)

  useEffect(() => {
    setTotalQuantity(cart.getTotalQuantity)
  }, [cart])

  const onConfirmOrder = values => {
    console.log({ values })
    setCartDrawerOpen(false)
    cart.deleteAllFromCart()
    setCartItems([])
    message.success('Your order has been placed successfully.')
  }

  return (
    <div>
      <Badge
        onClick={() => {
          if (!totalQuantity) return
          getCart(cart.getCartQueryStr()).then(res => {
            setCartItems(cart.transformedCartItems(res.data))
          })
          setCartDrawerOpen(true)
        }}
        count={totalQuantity}
        className='soppingCartIcon'
      >
        <ShoppingCartOutlined />
      </Badge>
      <Drawer
        open={cartDrawerOpen}
        onClose={() => {
          setCartDrawerOpen(false)
        }}
        title='Your Cart'
        contentWrapperStyle={{ width: 500 }}
      >
        <Table
          pagination={false}
          columns={[
            {
              title: 'Card',
              dataIndex: '',
              render: record => <Image src={record.image} />
            },
            {
              title: 'Price',
              dataIndex: 'price',
              render: value => {
                return <span>€{value}</span>
              }
            },
            {
              title: 'Quantity',
              dataIndex: 'quantity',
              render: (value, record) => {
                return (
                  <div>
                    <InputNumber
                      min={0}
                      value={value}
                      onChange={value => {
                        setCartItems(pre =>
                          pre.map(cartItem => {
                            if (record.key === cartItem.key) {
                              cart.changeItemQuantity(record.key, value)
                              cartItem.quantity = value
                              cartItem.total =
                                Math.floor(cartItem.price * value * 100) / 100
                            }
                            return cartItem
                          })
                        )
                      }}
                    />
                  </div>
                )
              }
            },
            {
              title: 'Total',
              dataIndex: 'total',
              render: value => {
                return <span>€{Math.floor(value * 100) / 100}</span>
              }
            },
            {
              title: 'Actions',
              render: record => {
                return (
                  <>
                    <DeleteOutlined
                      onClick={() => {
                        setCartItems(pre =>
                          pre.filter(cartItem => {
                            return record.key !== cartItem.key
                          })
                        )
                        cart.deleteFromCart(record.key)
                      }}
                      style={{ color: 'red', marginLeft: 12 }}
                    />
                  </>
                )
              }
            }
          ]}
          dataSource={cartItems}
          summary={data => {
            let total = data.reduce((pre, current) => {
              return pre + current.total
            }, 0)
            total = Math.floor(total * 100) / 100
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={4}>
                    <Text type='danger'>Total: €{total}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )
          }}
        />
        <Button
          onClick={() => {
            onConfirmOrder(cartItems)
          }}
          type='primary'
        >
          Checkout Your Cart
        </Button>
      </Drawer>
    </div>
  )
}
export default AppHeader
