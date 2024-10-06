import { allPages } from "@/.contentlayer/generated"
import Link from "next/link"

export default function Pages() {
    const found_topics = [];
  return (
    <div className="prose dark:prose-invert">
      {allPages
          .filter((post) => !post.draft && post.title != 'About')
          .map((page) => (
        <article key={page._id}>
          <Link href={page.slug}>
            <h2>{page.title}</h2>
          </Link>
          {page.description && <p>{page.description}</p>}
        </article>
      ))}
    </div>
  )
}