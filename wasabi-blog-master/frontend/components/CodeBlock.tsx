// CodeBloc.tsx
// ----
// Syntax Highlighter

import { unified } from 'unified';
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import { createElement, Fragment, useEffect, useState } from 'react';
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark.css';

type Props = {
    children: string,
    language: string,
    name?: string,
}

/**
 * コードブロック
 */
export default function CodeBlock({ children, language, name }: Props): JSX.Element {

    // 言語が存在するかどうか判定して, ハイライト後の値を返す
    const raw = hljs.highlight(children,
        {
            language:
                hljs.getLanguage(language)
                    ? language
                    : 'text'
        }
    ).value;

    const [result, setResult] = useState<JSX.Element>();
    useEffect(() => {
        unified()
            .use(rehypeParse, { fragment: true })
            .use(rehypeReact, { createElement, Fragment })
            .process(raw)
            .then(e => setResult(e.result))
    }, []);

    return <code className="hljs mb-10">
        {result}
    </code>;
}
