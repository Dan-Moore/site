import {getPublishPosts, getPublishPages, getPublishSeries} from "@/components/contentlayer-util";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import ToCard from "@/components/web-components";


export default function Home() {


  return (
    <div className="prose dark:prose-invert">{ 

      getPublishPosts().map((post) => (
        <ToCard article={post} />
      ))
    }{
      getPublishPages().map((post) => (
        <ToCard article={post} />
      ))
    }{
      getPublishSeries().map((post) => (
        <ToCard article={post} />
      )) 
    }</div>)
}