import * as React from 'react';

import { Group } from '@models/Group';

import { TableCell } from '../TableCell';
import { TableRow } from '../TableRow';
import { TableRows } from '../TableRows';


interface IParams {
    model: Group;
}

export function TableGroup({ model }: IParams): JSX.Element {
    return (
        <React.Fragment>
            <TableRows model={model.getRows()} />
            <TableRow>
                <TableCell fill={true}>{model.sum()}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}
