import * as React from 'react';

import './Table.css';

import { Table as TableModel } from '@models/Table';

import { Renderer } from './Renderer';
import { TableBody } from './TableBody';
import { TableHead } from './TableHead';


interface IParams {
    model: TableModel;
    renderer: Renderer;
    grouping: boolean;
    rootRef: React.RefObject<HTMLDivElement>;
}

export function Table({ model, renderer, rootRef }: IParams): JSX.Element {
    return (
        <div className="table" ref={rootRef}>
            <TableHead model={model.getColumns()} />
            <TableBody>
                {rootRef.current &&
                    renderer.render()
                }
            </TableBody>
        </div>
    );
}
