import { Cell } from './Cell';
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

    public generateRandomCells(count: number): void {
        for (let i = 0; i < count; i++) {
            const cell = new Cell({
                id: i.toString(),
                name: Math.round(Math.random() * 100).toString()
            });
            this.cells.push(cell);
        }
    }

    public isLast(): boolean {
        const rows = this.group ? this.group.getRows() : [];
        const { length } = rows;
        return (length > 0) ? (rows[length - 1] === this) : false;
    }

}
