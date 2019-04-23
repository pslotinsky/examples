import * as React from 'react';

import { Table as TableModel } from '@models/Table';

import { Table } from '@components/Table';


interface IParams {
    model: TableModel;
    grouping: boolean;
    groupingOn(): void;
    groupingOff(): void;
}

export function TablePage({
    model,
    grouping,
    groupingOn,
    groupingOff
}: IParams): JSX.Element {
    return (
        <div>
            <p>
                <button onClick={groupingOn}>groupingOn</button>
                <button onClick={groupingOff}>groupingOff</button>
            </p>
            <Table model={model} grouping={grouping} />
        </div>
    );
}
