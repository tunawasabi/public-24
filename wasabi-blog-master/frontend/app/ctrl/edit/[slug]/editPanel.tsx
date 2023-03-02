'use client';

import MainView from "app/ctrl/mainView";
import PostDate from "components/post/PostDate";
import ColoredButton from "components/util/button";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler, SubmitErrorHandler, UseFormRegisterReturn } from "react-hook-form";
import Article from "src/lib/types/Article";

type Props = {
    article: Article
}

const EditPanel: React.FC<Props> = ({ article }) => {
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
            article = article;
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

    return <MainView title={article.title == '' ? '新規投稿' : `${article.title}を編集中！`}
        actionbar={
            <div className="flex gap-4 my-2 ml-auto flex-row-reverse items-center">
                <ColoredButton onClick={handleSubmit(onSubmit, onSubmitError)} theme="ocean">
                    投稿
                </ColoredButton>
                <div>
                    <input id="published" type="checkbox" {...register('published')} />
                    <label htmlFor="published">公開する</label>
                </div>
            </div>
        }
    >
        <form>
            <div className="font-mono text-gray-400">ID: {article.id}</div>
            <Link className="textlink" href={`/post/${article.slug}`}>記事ページに行く</Link>
            <MessageAlert />
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
                    className="shadow-sm bg-white dark:bg-neutral-700 rounded-md p-3"
                    {...register('content', {
                        required: true,
                    })}
                />
            </div>
        </form>
    </MainView>
}
export default EditPanel;

const InputField: React.FC<
    Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type'>
    & { register?: UseFormRegisterReturn<any> }
> = ({ register, name, ...rest }) => {
    return <input type="text" className="bg-white shadow-sm dark:bg-neutral-700 p-2 w-full rounded-md" {...register} {...rest} />
}
