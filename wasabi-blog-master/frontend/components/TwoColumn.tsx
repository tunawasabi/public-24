import React from 'react';

type Props = {
    main: React.ReactNode, side?: React.ReactNode,
}

const TwoColumn: React.FC<Props> = ({ main, side }) => {
    return <div className="grid grid-cols-12 gap-3 mx-auto max-w-6xl pb-8">
        <div className="col-span-12 md:col-span-8">
            <main>
                {main}
            </main>
        </div>
        <div className="col-span-12 md:col-span-4">
            {side}
        </div>
    </div>;
}

export default TwoColumn;
