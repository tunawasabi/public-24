import { ReactNode } from "react";

const SingleView: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <div className="mx-auto py-8 px-8 md:max-w-3xl">
        {children}
    </div>
}
export default SingleView;
