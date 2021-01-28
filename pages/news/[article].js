import { useRouter } from 'next/router'
import Link from 'next/link'
import PrankHead from '@components/PrankHead'

export function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
  let title = toTitleCase(params.article.split('-').join(' '))
  let api = await getRandomAPI();
  const {name, description} = api;

  return {
    props: {
      title,
      name,
      description
    },
    revalidate: 30,
  }
}

const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function getRandomAPI() {
  const res = await fetch('https://api.publicapis.org/random');
  const json = await res.json();
  return {
      name: json.entries[0].API,
      description: json.entries[0].Description,
  };
}

export default function Article(props) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <main>
        <p>Article loading...</p>
      </main>
    )
  }

  const { title } = props
  return (
    <>
      <PrankHead title={title} />
      <div>
        <Link href="/">
          <a>
            <img src="/trib.png" alt="Tribune logo" />
          </a>
        </Link>
        <div className="subhead">You have been pranked - {new Date().toLocaleDateString()}</div>
        <h2>{title} - NOT</h2>
        <p>Here, have an API instead!</p>
        <p>
          {props.name}
          <br/>
          {props.description}
        </p>
        <br />
        <p>
          Wow, you were pranked so good. I bet you wanna get your friends now, too.{` `}
          <Link href="/">
            <a>Go ahead, do it.</a>
          </Link>
        </p>
        <p className="foot">
          This is a project lovingly made by <a href="https://twitter.com/cassidoo">@cassidoo</a>!
        </p>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;900&display=swap');

        html,
        body {
          padding: 0;
          margin: 0;
          color: #2f2f2f;
          background-color: #f9f7f1;
          text-align: center;
          font-family: 'Playfair Display', serif;
        }

        img {
          max-height: 90px;
          max-width: 90%;
          margin: 20px 0;
        }

        .subhead {
          text-transform: uppercase;
          border: 2px solid #2f2f2f;
          border-right: none;
          border-left: none;
          padding: 12px 0 12px 0;
          margin-bottom: 20px;
          width: 100%;
        }

        .foot {
          margin: 100px 0;
        }
      `}</style>
    </>
  )
}
