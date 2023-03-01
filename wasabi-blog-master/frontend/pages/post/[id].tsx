import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import Markdown from '../../components/Markdown';
import ArticleView from '../../components/post/ArticleView';
import SingleView from '../../components/SingleView';
import Tags from '../../components/TagList';
import ColoredButton from '../../components/util/button';
import { fetchArticle } from '../../src/lib/db';
import Article from '../../src/lib/types/Article';

const ArticlePage: NextPage<Article> = (props) => {
    const { status } = useSession();

    return <>
        <Head>
            <title>{`${props.title} | とれいと魔術書`}</title>
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.content.split('\n')[0]} />
        </Head>
        {
            !props.published ? <div>
                下書きです
            </div> : null
        }
        <SingleView>
            <ArticleView
                eyeCatch={props.eye_catch}
                title={props.title}
                createdDate={props.created_date}
                lastUpdatedDate={props.last_updated_date}
            >
                {status === 'authenticated'
                    ? <div className="flex my-2">
                        <Link
                            href={`/ctrl/edit/${props.slug}`}
                            prefetch={false}
                        >
                            <ColoredButton>編集</ColoredButton>
                        </Link>
                    </div>
                    : null}

                <Markdown>{props.content}</Markdown>
                <Tags tags={props.tags} />
            </ArticleView>
        </SingleView>
    </>;
}
export default ArticlePage;

export const getStaticProps: GetStaticProps<Article, Params, Article> = async (
    { params }
) => {
    const id = params?.id;

    if (!id) {
        return {
            notFound: true,
        };
    }

    const rawdata = await fetchArticle(id);

    if (!rawdata || !rawdata.published) {
        return {
            notFound: true,
        };
    }

    return {
        props: { ...rawdata },
        revalidate: 10,
    };
}

//
// Type Definition
//
export const getStaticPaths: GetStaticPaths<Params> = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
}

interface Params extends ParsedUrlQuery { id: string }
