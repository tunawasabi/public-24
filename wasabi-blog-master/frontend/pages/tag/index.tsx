import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ArticleView from "../../components/post/ArticleView";
import SingleView from "../../components/SingleView";
import TwoColumn from "../../components/TwoColumn";
import { fetchAllTag } from "../../src/lib/db";

const Page: NextPage<Props> = ({ tags }) => {
    return (
        <SingleView>
            <ArticleView
                title={'タグ目録'}
            >
                <Head>
                    <meta name="robots" content="noindex" />
                    <title>タグ目録｜とれいと魔術書</title>
                </Head>

                <AllTags tags={tags} />
            </ArticleView>
        </SingleView>
    )
}
export default Page;

function AllTags({ tags }: Props): JSX.Element {
    return (
        <div className="flex flex-wrap gap-y-1 gap-3">
            {
                tags.map((e) =>
                    <Link href={`/tag/${e}`} key={e} className="textlink">
                        {e}
                    </Link>
                )
            }
        </div>
    );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const tags = await fetchAllTag();

    return {
        props: {
            tags
        },
        revalidate: 300
    };
};

type Props = {
    tags: string[],
}
