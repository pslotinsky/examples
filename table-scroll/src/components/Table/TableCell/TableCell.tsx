import * as React from 'react';

import './TableCell.css'

import { Cell } from '@models/Cell';

import { CellContentFactory } from './CellContentFactory';


interface IParams {
    children?: React.ReactNode;
    model?: Cell;
    fill?: boolean;
    width?: number;
}

const factory = new CellContentFactory();

export function TableCell({ children, model, fill, width }: IParams): JSX.Element {
    const className = fill ? 'table__cell table__cell_fill' : 'table__cell'
    const content = children || model && factory.create(model);

    return <div className={className} style={{ width }}>{content}</div>;
}
