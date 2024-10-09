import { allPosts } from "@/.contentlayer/generated"
import Link from "next/link"
import {getFirstEntryOfSeries} from "@/components/contentlayer-util"

export default function Home() {
    var found: any[]
  return (
    <div className="prose dark:prose-invert">
      {getFirstEntryOfSeries()
          .map((post) => (
        <article key={post._id}>
          <Link href={post.slug}>
            <h2>{post.title}</h2>
          </Link>
          {post.description && <p>{post.description}</p>}
        </article>
      ))}
    </div>
  )
}