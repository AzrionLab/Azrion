export interface OrderEntry {
  price: number
  size: number
}

export interface OrderBook {
  bids: OrderEntry[]
  asks: OrderEntry[]
}

export function computeSpread(book: OrderBook): number {
  if (!book.bids.length || !book.asks.length) return NaN
  return book.asks[0].price - book.bids[0].price
}

export function computeMidPrice(book: OrderBook): number {
  if (!book.bids.length || !book.asks.length) return NaN
  return (book.asks[0].price + book.bids[0].price) / 2
}
