import { Column } from './Column';
import { Group } from './Group';
import { Row } from './Row';


interface ITableParams {
    columnNames: string[];
}

export class Table {

    private columns: Column[] = [];

    private rows: Row[] = [];

    constructor({ columnNames }: ITableParams) {
        this.columns = this.createColumns(columnNames);
    }

    public getColumns(): Column[] {
        return this.columns;
    }

    public getColumn(index: number): Column {
        return this.columns[index];
    }

    public getRows(): Row[] {
        return this.rows;
    }

    public getRow(index: number): Row {
        return this.rows[index];
    }

    public getGroups(): Group[] {
        const groups = [];

        for (let i = 0; i < this.rows.length; i += 5) {
            groups.push(this.rows.slice(i, i + 5));
        }

        return groups.map((item, index) => new Group(index, item));
    }

    public generateRandomRows(count: number): void {
        for (let i = 0; i < count; i++) {
            const row = new Row();
            row.generateRandomCells(this.columns.length);
            row.id = i.toString();
            this.rows.push(row);
        }
    }

    private createColumns(names: string[]): Column[] {
        return names.map((name, index) => new Column({
            id: index.toString(),
            name
        }));
    }

}
