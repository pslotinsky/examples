import * as React from 'react';

import './TableRow.css'

import { Row } from '@models/Row';

import { TableCell } from '../TableCell';


interface IParams {
    children?: React.ReactNode;
    model?: Row;
}

export function TableRow({ children, model }: IParams): JSX.Element {
    return (
        <div className="table__row">
            {model
                ? model.getCells().map(item => <TableCell key={item.id}>{item.name}</TableCell>)
                : children
            }
        </div>
    );
}
