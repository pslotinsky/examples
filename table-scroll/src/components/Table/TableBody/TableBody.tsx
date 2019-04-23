import * as React from 'react';

import './TableBody.css'


interface IParams {
    children: React.ReactNode;
}

export function TableBody({ children }: IParams): JSX.Element {
    return (
        <div className="table__body">
            {children}
        </div>
    );
}
