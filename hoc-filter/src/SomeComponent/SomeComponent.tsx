import * as React from 'react';

export interface IData {
    numbers: number[];
}

export interface ICallbacks {
    onClick(): void;
}

type IProps = IData & ICallbacks;

export function SomeComponent({ numbers, onClick }: IProps): JSX.Element {
    return <div onClick={onClick}>{numbers}</div>;
}
