import {getPublishPages} from "@/components/contentlayer-util"
import Link from "next/link"

export default function Pages() {
  return (
    <div className="prose dark:prose-invert">
      {getPublishPages()
          .map((page) => (
        <article key={page._id}>
          {/* Trimming '/pages' from the slug path if present. */}
          <Link href={page.slug.startsWith("/pages/") ? page.slug.replace("/pages", ""): page.slug}>
            <h2>{page.title}</h2>
          </Link>
          {page.description && <p>{page.description}</p>}
        </article>
      ))}
    </div>
  )
}