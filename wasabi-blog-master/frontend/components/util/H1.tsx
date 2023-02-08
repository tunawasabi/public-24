import type { ReactNode } from "react";

const H1: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (<h1 className="text-2xl md:text-4xl mb-2">
        {children}
    </h1>);
}
export default H1;
