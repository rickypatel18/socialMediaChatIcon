import { type NextRequest, NextResponse } from "next/server"

// Update the generateSalesData function to ensure unique IDs
const generateSalesData = () => {
  const products = [
    "Premium Headphones",
    "Wireless Keyboard",
    "Smart Watch",
    "Bluetooth Speaker",
    "Gaming Mouse",
    "USB-C Hub",
    "Laptop Stand",
    "Wireless Charger",
    "External SSD",
    "Webcam",
  ]

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ]

  const userNames = [
    "Alex Johnson",
    "Sam Smith",
    "Jordan Lee",
    "Taylor Brown",
    "Casey Williams",
    "Morgan Davis",
    "Riley Wilson",
    "Jamie Miller",
    "Avery Jones",
    "Quinn Thomas",
  ]

  // Generate 100 sales records with guaranteed unique IDs
  const sales = Array.from({ length: 100 }, (_, i) => {
    // Generate a random date within the last 90 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    return {
      id: i + 1, // This ensures each ID is unique (1-100)
      product: products[Math.floor(Math.random() * products.length)],
      amount: Number.parseFloat((Math.random() * 1000 + 50).toFixed(2)),
      date: date.toISOString().split("T")[0],
      location: locations[Math.floor(Math.random() * locations.length)],
      userName: userNames[Math.floor(Math.random() * userNames.length)],
    }
  })

  return sales
}

// Cache the sales data so it doesn't regenerate on every request
const salesData = generateSalesData()

export async function GET(request: NextRequest) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const url = new URL(request.url)

  // Get filter parameters
  const product = url.searchParams.get("product") || ""
  const minAmount = url.searchParams.get("minAmount") || ""
  const maxAmount = url.searchParams.get("maxAmount") || ""
  const startDate = url.searchParams.get("startDate") || ""
  const endDate = url.searchParams.get("endDate") || ""
  const location = url.searchParams.get("location") || ""
  const userName = url.searchParams.get("userName") || ""

  // Get page from query parameters (default to 1)
  const page = Number.parseInt(url.searchParams.get("page") || "1")
  const pageSize = 10

  // Apply filters
  const filteredSales = salesData.filter((sale) => {
    const matchesProduct = product ? sale.product.toLowerCase().includes(product.toLowerCase()) : true

    const matchesMinAmount = minAmount ? sale.amount >= Number.parseFloat(minAmount) : true

    const matchesMaxAmount = maxAmount ? sale.amount <= Number.parseFloat(maxAmount) : true

    const saleDate = new Date(sale.date)
    const matchesStartDate = startDate ? saleDate >= new Date(startDate) : true

    const matchesEndDate = endDate ? saleDate <= new Date(endDate) : true

    const matchesLocation = location ? sale.location.toLowerCase().includes(location.toLowerCase()) : true

    const matchesUserName = userName ? sale.userName.toLowerCase().includes(userName.toLowerCase()) : true

    return (
      matchesProduct &&
      matchesMinAmount &&
      matchesMaxAmount &&
      matchesStartDate &&
      matchesEndDate &&
      matchesLocation &&
      matchesUserName
    )
  })

  // Calculate start and end indices for pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize

  // Get paginated data
  const paginatedSales = filteredSales.slice(start, end)

  // Return total count in headers
  return NextResponse.json(paginatedSales, {
    headers: {
      "X-Total-Count": filteredSales.length.toString(),
    },
  })
}

