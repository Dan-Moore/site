'use client'
 
import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Page, Post } from '@/.contentlayer/generated/types';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

/*
 * This file contains react client functions for creating web components.
 
--  Removing body section
          <CardContent className="flex-grow">
            <p>{card.description}</p>
          </CardContent>

  -- And footer
                    <CardFooter>
            <Button variant="outline" className="w-full">View Details</Button>
          </CardFooter>

*/


/**
 * Client side function that builds a cards from contentlayer.
 * @param article
 * @returns 
 */
export default function ToCards({articles}: {articles: Post[] | Page[]}) {
// Old code
  //  const [count, setCount] = useState(0)
//   const pi = useSearchParams()?.get("pi") ?? "1"; // Page Index
//   const size = useSearchParams()?.get("size") ?? "5"; // Limit of articles on home page
//   console.log("params: " + pi + " : " + size);
// ----------------------------
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 9
const totalPages = Math.ceil(articles.length / itemsPerPage)

const indexOfLastItem = currentPage * itemsPerPage
const indexOfFirstItem = indexOfLastItem - itemsPerPage
const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem)

const handlePageChange = (pageNumber: number) => {
  setCurrentPage(pageNumber)
}

  return (
    <div className="container mx-auto p-4">
      {/*  
       small screen - 1 article per column.
       med. screen - 2 articles per column.
       large screen - 5 articles per column.
       */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8 w-90">
      {currentItems.map((card) => (
        <Card key={card._id} className="flex flex-col">
           <a href="#" target="_blank" rel="noopener noreferrer">
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          </a>
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
        );
}