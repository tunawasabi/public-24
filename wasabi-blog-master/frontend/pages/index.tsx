import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import SingleView from '../components/SingleView';
import { fetchLatestArticles } from '../src/lib/db';
import Article from '../src/lib/types/Article';

type Props = {
  articles: Article[],
}

const Home: NextPage<Props> = (props: Props) => {
  const articles = props.articles;
  return (
    <>
      <main>
        <SingleView>
          <Head>
            <title>とれいと魔術書</title>
          </Head>
          <div className="flex flex-col gap-8">
            <h1 className="text-center text-4xl">
              とれいと魔術書
            </h1>
            <p className="text-center">
              コンピュータとネットの話が詰まった不思議な本
            </p>
            <div className="flex flex-col gap-2 items-stretch">
              <h2>最新の記事</h2>
              {articles.length >= 1 ? <>
                <Link className="textlink text-3xl" href={`post/${articles[0].slug}`}>{articles[0].title}</Link>
                {
                  articles.slice(1).map(e =>
                    <Link className="textlink" href={`post/${e.slug}`} key={e.slug}>{e.title}</Link>
                  )
                }
              </> : <p>
                最新の記事はありません．
              </p>
              }
            </div>
            <div className="flex flex-col gap-2">
              <h2>記事を探す</h2>
              <p>
                <Link className="textlink" href='tag'>タグ目録</Link>から探す
              </p>
              <p>
                <Link className="textlink" href='archive'>月次アーカイブ</Link>から探す
              </p>
            </div>
          </div>
        </SingleView>
      </main>
    </>

  );
}
export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await fetchLatestArticles(5);
  return {
    props: {
      articles: data
    },
    revalidate: 60,
  }
}
