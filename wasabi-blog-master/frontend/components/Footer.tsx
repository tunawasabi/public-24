'use client';
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Footer() {
    const { status } = useSession();

    return <footer className="flex flex-wrap bg-neutral-200 dark:bg-gray-700 drop-shadow-md font-mono w-full mt-48">
        <div className="bg-sky-600 px-4">(C) 2023 とれいと, All Rights Resrved.</div>
        <div className="ml-auto bg-gray-400">
            {
                status === 'authenticated'
                    ? <Link href="/ctrl#" scroll={true}>管理画面</Link>
                    : <button onClick={() => signIn('discord')}>ADMIN</button>
            }
        </div>
    </footer>
}
