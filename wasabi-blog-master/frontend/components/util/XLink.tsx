//
// 外部・内部兼用リンク
//
import Link from 'next/link';

interface InLinkComponentProps {
    children: React.ReactNode;
    href: string;
}

export default function XLink({ children, href }: InLinkComponentProps): JSX.Element {

    // 外部リンクの時もしくはページ内リンクの時はNext.jsのLinkを外す
    if (href.startsWith('http') || href.startsWith('#')) {
        return <a href={href} className="textlink">{children}</a>
    }

    return (
        <Link href={href} className="textlink">{children}</Link>
    );
}
