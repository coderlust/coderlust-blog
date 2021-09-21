import { createClient } from 'contentful'
import BlogCard from '../components/BlogCard'

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  })

  const res = await client.getEntries({ content_type: 'blog' })

  return {
    props: {
      blogs: res.items,
    },
    revalidate: 1
  }

}

export default function Recipes({ blogs }) {
  return (
    <div className="recipe-list">
      {blogs.map(blog => (
        <BlogCard key={blog.sys.id} blog={blog} />
      ))}

      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
      `}</style>
    </div>
  )
}