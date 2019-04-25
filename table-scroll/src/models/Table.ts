import { Column, DataType } from './Column';
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

    public randomize(rowsCount: number): void {
        let row: Row;
        let group: Group;
        let groupRows: Row[] = [];

        for (const column of this.columns) {
            column.type = this.randomType();
            column.width = this.randomWidth();
        }

        for (let i = 1; i <= rowsCount; i++) {
            row = new Row();
            row.generateRandomCells(this.columns);
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
            name,
        }));
    }

    private randomType(): DataType {
        const types = [DataType.Number, DataType.String, DataType.Date, DataType.Money];
        const index = Math.round((types.length - 1) * Math.random());
        return types[index];
    }

    private randomWidth(): number {
        return Math.round(3 * Math.random() + 2) * 50;
    }

}
