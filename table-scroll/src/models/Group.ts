import { Row } from './Row';


export class Group {

    public id: number;

    private rows: Row[];

    constructor(id: number, rows: Row[]) {
        this.id = id;
        this.rows = rows;

        rows.forEach(item => item.group = this);
    }

    public getRows(): Row[] {
        return this.rows;
    }

    public sum(): number {
        return this.rows
            .map(item => item.getCell(0))
            .map(item => Number(item.name))
            .reduce((acc, cur) => acc + cur);
    }

}
