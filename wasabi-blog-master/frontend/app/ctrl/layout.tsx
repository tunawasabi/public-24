import { getServerSession } from "next-auth"
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    if (!session) {
        notFound();
    }

    return <div className="m-8">
        <div className="w-full h-16 py-4 px-8 border-b-[1px] flex items-center gap-2">
            <h1 className="text-xl">管理画面</h1>
            <Link href="/api/auth/signout">ログアウト</Link>
        </div>
        {children}
    </div>
}
