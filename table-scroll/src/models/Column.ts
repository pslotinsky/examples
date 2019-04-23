interface IColumnParams {
    id: string;
    name: string;
}

export class Column {

    public id: string;

    public name: string;

    public width: number = 150;

    constructor({ id, name }: IColumnParams) {
        this.id = id;
        this.name = name;
    }

}
