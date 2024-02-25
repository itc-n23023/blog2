let controller

export const getProductsByCategory = (page, supertype, name) => {
  if (controller) {
    controller.abort()
  }

  controller = new AbortController()
  const signal = controller.signal

  return fetch(
    `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=40&q=supertype:${supertype} name:${name} (regulationMark:E OR regulationMark:F OR regulationMark:G)`,
    { signal }
  )
    .then(res => res.json())
    .catch(e => {})
}

export const getCart = cartQueryStr => {
  return fetch(`https://api.pokemontcg.io/v2/cards?q=${cartQueryStr}`).then(
    res => res.json()
  )
}
