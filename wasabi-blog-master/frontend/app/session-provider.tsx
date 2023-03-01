'use client';

import { SessionProvider as InnerSessionProvider } from "next-auth/react";

export default function SessionProvider({ children }) {
    return <InnerSessionProvider>{children}</InnerSessionProvider>
}
