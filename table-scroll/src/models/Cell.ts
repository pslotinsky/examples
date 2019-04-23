interface ICellParams {
    id: string;
    name: string;
}

export class Cell {

    public id: string;

    public name: string;

    constructor({ id, name }: ICellParams) {
        this.id = id;
        this.name = name;
    }

}
