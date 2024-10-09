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


/**
 * Client side function that builds a card for an article.
 * @param article
 * @returns 
 */
export default function ToCard({article}: {article: Post | Page}) {
  const [count, setCount] = useState(0)
   // Query Params
//   const pi = useSearchParams()?.get("pi") ?? "1"; // Page Index
//   const size = useSearchParams()?.get("size") ?? "5"; // Limit of articles on home page
//   console.log("params: " + pi + " : " + size);


  return (
        <Card>
  <CardHeader>
    <CardTitle>{article.title}</CardTitle>
    <CardDescription>{article.description}</CardDescription>
  </CardHeader>
  {/*  
  <CardContent>
    <p>{article.description}</p>
  </CardContent>
  */}
</Card> 
  )}