import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkDerective from 'remark-directive';
import Tips from './Tips';
import remarkGfm from 'remark-gfm';
import Image from "next/image";
import XLink from './util/XLink';
import FileName from './fileName';
import React from 'react';
import type { Options } from 'react-markdown/lib/ast-to-react';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import { h } from 'hastscript';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default function Markdown({ children }) {
    const markdownMap: Options['components'] = {

        //
        // 見出し
        //
        h2: ({ id, ...props }) => <h2 id={id} {...props} />,
        h3: ({ id, ...props }) => <h3 id={id} {...props} />,

        //
        // 基本要素
        //
        p: ({ children, ...props }) => {
            const c = React.Children.toArray(children);

            //
            // 子要素に画像を含むと, markdownMapのimgが参照され
            // HTMLのルール違反になってしまう. そのため, imgを含むときは段落を
            // divにする
            //
            if ((c[0] as React.ReactElement).props?.node?.tagName == 'img') return <div>{children}</div>

            return <p className="mb-10 last:mb-0">{children}</p>;
        },

        a: ({ className, ...props }) => {
            // 目次のリンク
            if (className?.includes('toc-link')) {
                return <a className="underline decoration-2
                text-neutral-600
                 dark:text-neutral-300 decoration-neutral-300/50 hover:decoration-neutral-300" {...props} />
            }

            // 見出しのリンク
            if (className?.includes('heading-link')) {
                return <a className="hover:underline decoration-2" {...props} />
            }

            return <XLink href={props.href!} {...props} />
        },

        img: (props) => {
            const { src, alt } = props;
            if (!src) return null;

            // srcのエラー対策
            if (src.startsWith('//')
                || !(src.startsWith('/') || src.startsWith('https://'))) return null;

            const c = (<div className="flex flex-col gap-1">
                <div className='relative aspect-video bg-neutral-800 my-5 w-screen left-1/2 -translate-x-1/2 md:w-full md:left-0 md:translate-x-0'>
                    <Image src={src}
                        fill
                        alt={alt ?? ""}
                        className="object-contain"
                    />
                </div>
                <div className='flex'>
                    {
                        props.alt ?
                            <span className="font-mono text-base">
                                {props.alt}
                            </span> : null
                    }
                </div>
            </div>);
            return c;
        },

        //
        // ブロック要素
        //
        blockquote: ({ ...props }) => <blockquote {...props} />,

        code: ({ node, inline, className, children, ...props }) => {
            // インラインコード
            if (inline) {
                return <code>
                    {children}
                </code>
            }

            // コードブロックの言語を取得
            const match = /language-(\w+)/.exec(className || '');

            // ファイル名を取得 (コロン区切り)
            const fileName = /.*:(.+)/.exec(className || '')

            return (
                <CodeBlock
                    language={match ? match[1] : ''}
                    name={fileName ? fileName[1] : ''}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </CodeBlock>
            );
        },
    };

    const directivewMap = {
        // Tipsを表示する
        'alert': ({ level, title, children }) => <Tips level={level} title={title}>{children}</Tips>,

        // コードのファイル名を表示する
        'file': ({ name }) => <FileName name={name} />,
    };

    return <ReactMarkdown
        components={{ ...markdownMap, ...directivewMap }}
        rehypePlugins={[
            rehypeSlug,
            [rehypeAutolinkHeadings, {
                properties: { className: 'heading-link' },
                behavior: 'wrap'
            }],
            [rehypeToc, {
                customizeTOC: (toc) => {
                    return h('div', { className: "text-sm leading-6 my-10 xl:my-0 xl:sticky xl:top-0" },
                        h('div', { className: "xl:absolute xl:-left-72 2xl:-left-96 xl:w-64 2xl:w-72 xl:h-screen overflow-scroll" },
                            h('div', { className: "xl:py-8" }, [
                                (h('div', { className: "py-2 xl:sticky xl:top-0 xl:pt-1 xl:backdrop-blur-2xl font-bold border-t-2 border-slate-700" },
                                    '目次 Table of Contents'
                                )),
                                toc
                            ])
                        )
                    );
                }
            }],
        ]}
        remarkPlugins={[
            remarkGfm,
            remarkDerective,
            remarkDirectiveRehype,
        ]}>
        {children}
    </ReactMarkdown>
}
