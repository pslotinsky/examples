import { Column } from './Column';
import { Group } from './Group';
import { Row } from './Row';


interface ITableParams {
    columnNames: string[];
}

export class Table {

    private columns: Column[] = [];

    private rows: Row[] = [];

    private groups: Group[] = [];

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
        return this.groups;
    }

    public generateRandomRows(count: number): void {
        let row: Row;
        let group: Group;
        let groupRows: Row[] = [];

        for (let i = 1; i <= count; i++) {
            row = new Row();
            row.generateRandomCells(this.columns.length);
            row.id = i.toString();

            this.rows.push(row);
            groupRows.push(row);

            if (i % 5 === 0) {
                group = new Group(this.groups.length, groupRows);
                this.groups.push(group);

                groupRows.forEach(item => item.group = group);
                groupRows = [];
            }
        }
    }

    private createColumns(names: string[]): Column[] {
        return names.map((name, index) => new Column({
            id: index.toString(),
            name
        }));
    }

}
