"use client"

/**
 * Demo page created by v0.dev, https://v0.dev/chat.
 * Make a grid of shadcn cards with pagination. Use tailwind
 * https://v0.dev/chat/GeeVrIIpZP5
 * v0 Chat Message:
 * ---------------------------------------------------------
 
 I'll create a grid of shadcn cards with pagination using Tailwind CSS. This component will display a grid of cards and allow users to navigate through different pages.

Here's the React component that creates a grid of shadcn cards with pagination:

```typescriptreact project="Card Grid with Pagination" file="card-grid-pagination.tsx"
...
```

This component creates a responsive grid of cards with pagination. Here's a breakdown of what the code does:

1. We import the necessary components from shadcn/ui and React hooks.
2. We create a sample dataset (`cardData`) with 50 items to populate our cards.
3. We use the `useState` hook to manage the current page state.
4. We calculate the total number of pages based on the number of items and items per page.
5. We slice the `cardData` array to get only the items for the current page.
6. We create a grid layout using Tailwind CSS classes (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`). This creates a responsive grid that shows 1 column on small screens, 2 on medium screens, and 3 on large screens.
7. We map over the current items and create a `Card` component for each item.
8. We implement the pagination using the shadcn/ui `Pagination` component.
9. We add click handlers to the pagination buttons to update the current page.


This component provides a clean, responsive layout with easy navigation between pages of cards. The cards are styled using shadcn/ui components, and the layout is responsive thanks to Tailwind CSS classes.
 */

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Sample data for the cards
const cardData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Card ${i + 1}`,
  description: `This is the description for Card ${i + 1}`,
  content: `This is the main content of Card ${i + 1}. It contains more detailed information about the topic.`
}))

export default function AiDemoComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const totalPages = Math.ceil(cardData.length / itemsPerPage)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = cardData.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {currentItems.map((card) => (
          <Card key={card.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{card.content}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink 
                href="#" 
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}