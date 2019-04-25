import { Column, DataType } from './Column';

interface ICellParams {
    id: string;
    name: string;
    column: Column;
}

export class Cell {

    public id: string;

    public name: string;

    public column: Column;

    constructor({ id, name, column }: ICellParams) {
        this.id = id;
        this.name = name;
        this.column = column;
    }

    public get type(): DataType {
        return this.column.type;
    }

    public get width(): number {
        return this.column.width;
    }

}
