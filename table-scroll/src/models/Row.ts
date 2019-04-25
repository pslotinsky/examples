import { Cell } from './Cell';
import { Column, DataType } from './Column';
import { Group } from './Group';


export class Row {

    public id: string;

    public height: number = 40;

    public cells: Cell[] = [];

    public group: Group;

    public getCells(): Cell[] {
        return this.cells;
    }

    public getCell(index: number): Cell {
        return this.cells[index];
    }

    public generateRandomCells(columns: Column[]): void {
        this.cells = columns.map((column, index) => {
            const id = index.toString();
            const name = (column.type === DataType.Date)
                ? Date.now().toString()
                : Math.round(Math.random() * 100).toString();

            return new Cell({ id, name, column });
        });
    }

    public isLast(): boolean {
        const rows = this.group ? this.group.getRows() : [];
        const { length } = rows;
        return (length > 0) ? (rows[length - 1] === this) : false;
    }

}
