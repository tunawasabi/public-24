import ColoredButton from "components/util/button";
import { getServerSession } from "next-auth"
import Link from "next/link";
import { notFound } from "next/navigation";

const navLink = {
    'ダッシュボード': '/',
    '記事': '/article',
}

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    if (!session) {
        notFound();
    }

    return <div className="m-8">
        <div className="w-full py-4 border-b-[1px] border-gray-400 flex items-center gap-2 select-none">
            <h1 className="text-xl mr-auto">管理画面</h1>
            <Link href="/api/auth/signout"><ColoredButton theme="danger">
                ログアウト
            </ColoredButton></Link>
        </div>
        <div className="grid grid-cols-12 p-8 gap-8">
            <div className="col-span-3">
                <div className="flex flex-col gap-1">
                    {
                        Object.entries(navLink).map(([key, value]) => {
                            return <Link href={`ctrl/${value}`}
                                key={key}
                                className="block w-full rounded-md transition hover:bg-blue-500 p-4 text-xl font-black font-sans">
                                {key}
                            </Link>
                        })
                    }
                </div>
            </div>
            <div className="col-span-9">
                {children}
            </div>
        </div>
    </div>
}
