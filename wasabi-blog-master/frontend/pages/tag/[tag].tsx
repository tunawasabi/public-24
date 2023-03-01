import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import ArticleCard from '../../components/ArticleCard';
import TwoColumn from '../../components/TwoColumn';
import H1 from '../../components/util/H1';
import XLink from '../../components/util/XLink';
import { fetchArticleWithTag } from '../../src/lib/db';
import Article from '../../src/lib/types/Article';
import Tag from '../../src/lib/types/Tag';
import excludeDraftArticle from '../../src/util/exclude-draft';

const TagPage = (props: Props) => {
    return (<>
        <Head>
            <title>{`「${props.tag.name}」がついている記事 | とれいと魔法書`}</title>
            <meta name="robots" content="noindex" />
        </Head>
        <TwoColumn main={<ArticleList {...props} />} />
    </>);
}
export default TagPage;

const ArticleList: React.FC<Props> = ({ tag, articles }) => {
    return <div className="flex flex-col gap-5 my-10 mx-4">
        <div>
            <H1>タグ「{tag.name}」がついている記事</H1>
            <p>
                <XLink href='/tag'>
                    タグ目録
                </XLink>
                ｜
                件数: {articles.length}
            </p>
        </div>
        <div className="grid grid-cols-12 justify-center gap-2">
            {articles.map((e) => {
                return <div key={e.slug} className="col-span-12 md:col-span-6 ">
                    <ArticleCard {...e} />
                </div>
            })}
        </div>
    </div>
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
    { params }
) => {
    const tag = params?.tag!;
    const articles = excludeDraftArticle(await fetchArticleWithTag(tag));

    try {
        return {
            props: { tag: { id: 0, name: tag }, articles: articles },
            revalidate: 10,
        };
    } catch {
        return {
            notFound: true,
        };
    }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
}

// 型定義
interface Params extends ParsedUrlQuery { tag: string }
type Props = {
    tag: Tag,
    articles: Article[]
}
