
import { signIn, signOut, useSession } from "next-auth/react";

export default function Footer() {
    const { status } = useSession();

    return <footer className="flex flex-wrap bg-neutral-200 dark:bg-gray-700 drop-shadow-md font-mono w-full mt-64 md:mt-48">
        <div className="bg-sky-600 px-4">(C) 2023 とれいと, All Rights Resrved.</div>
        <div className="ml-auto bg-gray-400">
            {
                status === 'authenticated'
                    ? <button onClick={() => signOut()}>LogOut</button>
                    : <button onClick={() => signIn('discord')}>ADMIN</button>
            }
        </div>
    </footer>
}
