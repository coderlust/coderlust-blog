import Image from 'next/image'
import Link from 'next/link'
import { createClient } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Skeleton from '../../components/Skeleton'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY
})

export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'blog' })

  const paths = res.items.map(item => {
    return {
      params: {
        slug: item.fields.slug,
      }
    }
  })
  
  return {
    paths,
    fallback: true 
  }
}

export const getStaticProps = async ({ params }) => {
  
  const { items } = await client.getEntries(
    { 
      content_type: 'blog',
      'fields.slug': params.slug
    }
  )

  if (items.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      blog: items[0]
    },
    revalidate: 1
  }

}


export default function RecipeDetails({ blog }) {
  if (!blog) return <Skeleton />

  const { 
    title,
    featuredImage,
    pictures,
    tags,
    description
  } = blog.fields

  return (
    <div>
      <div className="banner">
        <Image 
          src={`https:${featuredImage.fields.file.url}`}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2>{ title }</h2>
      </div>
      <div className="method">
        <h3>Details</h3>
        <div>{documentToReactComponents(description)}</div>
      </div>

      <div className="info">
        <h3>tags:</h3>
        {tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="gallery">
        <h3>Gallery:</h3>
        {pictures.map(picture => (
          <Link 
            href={`https:${picture.fields.file.url}`} 
            key={`https:${picture.sys.id}`}
            target="_blank"
          >
            <a>
              <Image
                src={`https:${picture.fields.file.url}`}
                width="200"
                height="200"              
            /></a>
          </Link>
        ))}
      </div>


      <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
        .galley h3 {
          margin: 0;
        }
      `}</style>
    </div>
  )
}