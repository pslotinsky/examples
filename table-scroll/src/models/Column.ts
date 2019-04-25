interface IColumnParams {
    id: string;
    name: string;
}

export enum DataType {
    Number = 'number',
    String = 'string',
    Date = 'date',
    Money = 'money',
}

export class Column {

    public id: string;

    public name: string;

    public type: DataType;

    public width: number = 150;

    constructor({ id, name }: IColumnParams) {
        this.id = id;
        this.name = name;
    }

}
