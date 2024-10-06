import { allPosts } from "@/.contentlayer/generated"
import Link from "next/link"

export default function Home() {
    const found = []
  return (
    <div className="prose dark:prose-invert">
      {allPosts
          .filter((post) => {
              const isSeries = (post.series !== undefined);

              if(!found.includes(post.series) && isSeries){
                  found.push(post.series);
                  return true;
              }

           return !post.draft && isSeries && !found.includes(post.series)
           })
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