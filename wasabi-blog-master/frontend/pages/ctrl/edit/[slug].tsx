import TwoColumn from "../../../components/TwoColumn";
import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { fetchArticle } from "../../../src/lib/db";
import Article from "../../../src/lib/types/Article";
import PostDate from "../../../components/post/PostDate";
import { useState } from "react";
import { SubmitHandler, SubmitErrorHandler, useForm, UseFormRegisterReturn } from 'react-hook-form';
import Head from "next/head";
import { createHash } from 'crypto';
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Link from "next/link";

const InputField: React.FC<
    Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type'>
    & { register?: UseFormRegisterReturn<any> }
> = ({ register, name, ...rest }) => {
    return <input type="text" className="bg-neutral-700 p-2 w-full rounded-md" {...register} {...rest} />
}

export const EditPage: NextPage<Article> = (article) => {
    let origin = article;

    const [error, setError] = useState(false);
    const { register, watch, handleSubmit } = useForm<Article>({
        defaultValues: article
    });
    const [message, setMessage] = useState('');

    // フォームの入力が有効な時
    const onSubmit: SubmitHandler<Article> = async (article, e) => {
        e?.preventDefault(); // フォームの再送信を防ぐ
        setError(false);
        setMessage('progress');

        // 鍵の暗号化
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ article: article }),
        })

        const result = await response.json();

        if (response.status == 200) {
            setMessage('200 : 投稿しました．');

            // 元の変数を更新
            origin = article;
        } else {
            setMessage(`${response.status}: ${result.data}`)
        }
    }

    // フォームの入力が無効な時
    const onSubmitError: SubmitErrorHandler<Article> = error => {
        setError(true);
        setMessage('フォームに必要な値が入力されていません．')
    }

    // メッセージ表示コンポーネント
    const MessageAlert = () => {
        if (!message) return null
        else if (message == 'progress') return <>待ってね</>
        else if (!message.startsWith('200')) return <>{message}</>
        return <>{message}</>
    }

    return (
        <div className="px-4 py-8">
            <TwoColumn
                // サイドバー
                side={
                    <div className="flex flex-col gap-2">
                        <Head>
                            <title>投稿・編集</title>
                            <meta name="robots" content="noindex" />
                        </Head>
                        <div className="bg-neutral-800 p-3 rounded-md">
                            <div className="gap-2">
                                <div className="flex gap-4 my-2">
                                    <button
                                        onClick={
                                            handleSubmit(onSubmit, onSubmitError)
                                        }
                                        className="rounded-md py-1 px-4 bg-cyan-700 transition hover:opacity-50"
                                    >投稿</button>
                                    <div>
                                        <input type="checkbox" {...register('published')} />
                                        <label htmlFor="published">公開する</label>
                                    </div>
                                </div>
                                <Link className="textlink" href={`/post/${article.slug}`}>記事ページに行く</Link>
                                <MessageAlert />
                            </div>
                        </div>
                        <div className="bg-neutral-800 p-3 rounded-md">
                            <h2>参考</h2>
                            <h3>Markdown-derective</h3>
                            <p>
                                {':::{項目=値}'}
                            </p>
                        </div>
                    </div>
                }
                main={
                    <form>
                        <h1 className="text-4xl">{article.title == '' ? '新規投稿' : `「${watch('title')}」を編集中！`}</h1>
                        <div>記事ID: {article.id}</div>
                        <div className="flex flex-col gap-2">
                            <h3>メタ情報</h3>
                            <PostDate created={article.created_date} lastUpdated={article.last_updated_date} />
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label htmlFor="title">タイトル</label>
                                    <InputField id="title" register={register('title', {
                                        required: true,
                                    })} required />
                                </div>
                                <div>
                                    <label htmlFor="slug">slug - 記事識別文字列</label>
                                    <InputField
                                        id="slug"
                                        pattern="/[a-z0-9-]/g"
                                        placeholder="new-draft-article"
                                        className="bg-neutral-700 p-2 w-full rounded-md"
                                        register={register('slug', {
                                            required: true,
                                            pattern: /^(?!.*[^a-z0-9-]).*$/g, // 英数字ハイフン以外は許可しない
                                        })} />
                                </div>
                                <div>
                                    <label htmlFor="tags">タグ・キーワード</label>
                                    <InputField
                                        id="tags"
                                        placeholder="カンマ(,)区切りで入力"
                                        register={register('tags', {
                                            setValueAs: (v: string) =>
                                                v.toString().split(',')
                                                    .filter(e => e.trim() != ''), // 無効な名前のタグを除外
                                        })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="eye-catch">アイキャッチ画像のURL</label>
                                    <InputField
                                        id="eye-catch"
                                        register={register('eye_catch')}
                                    />
                                </div>
                            </div>

                            <h3>
                                記事本文
                            </h3>
                            <textarea
                                rows={20}
                                className="bg-neutral-800 rounded-md p-3"
                                {...register('content', {
                                    required: true,
                                })}
                            />
                        </div>
                    </form>
                } />
        </div>
    );
}
export default EditPage;

export const getServerSideProps: GetServerSideProps<Article, Params, Article> = async (
    { req, res, params }
) => {
    const session = await getServerSession(req, res, authOptions)
    const slug = params?.slug;

    // 認証
    if (session?.user.id != '807572778148298792') {
        return {
            notFound: true,
        };
    }

    // 記事の新規作成
    if (slug == 'new') {
        return {
            props: {
                id: '',
                title: '',
                slug: '',
                content: '',
                published: true,
                tags: [],
                created_date: (new Date()).toISOString(),
            },
        }
    }

    // スラッグが指定されている場合, 記事を探す
    const rawdata = await fetchArticle(slug!);

    if (!rawdata) return {
        notFound: true,
    };

    return {
        props: { ...rawdata }
    };

}

interface Params extends ParsedUrlQuery { slug: string }
