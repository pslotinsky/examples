import { Table } from '@models/Table';


interface IParams {
    model: Table;
    rootRef: React.RefObject<HTMLDivElement>;
    onPageChanged: PageChangedHandler;
}

export interface IPage {
    index: number;
    start: number;
    break: number;
    end: number;
    offset: number;
    size: number;
}

export type PageChangedHandler = () => void;

export class Scroller {

    public page: IPage;

    protected pages: IPage[] = [];

    protected model: Table;

    protected rootRef: React.RefObject<HTMLDivElement>;

    protected index: number = 0;

    protected offset: number = 0;

    protected pageOffset: number = 0;

    protected size: number;

    protected onPageChanged: PageChangedHandler;

    constructor({ model, rootRef, onPageChanged }: IParams) {
        this.model = model;
        this.rootRef = rootRef;
        this.onPageChanged = onPageChanged;
        this.size = this.calculateSize();
    }

    public inc(): void {
        if (this.offset < this.size - this.calculateClientSize()) {
            const delta = this.calculateDelta(this.index);
            this.offset += delta;
            this.index++;

            this.scrollTo(this.rootRef.current!, this.offset);

            if (this.index > this.page.break) {
                this.page = this.pages[this.page.index + 1];
                this.onPageChanged();
            }
        }
    }

    public dec(): void {
        if (this.offset > 0) {
            this.index--;
            const delta = this.calculateDelta(this.index);
            this.offset -= delta;

            this.scrollTo(this.rootRef.current!, this.offset);

            if (this.index < this.page.start) {
                this.page = this.pages[this.page.index - 1];
                this.onPageChanged();
            }
        }
    }

    public update(): void {
        this.scrollTo(this.rootRef.current!, this.offset);

        this.pages = this.createPages();
        this.page = this.calculatePage();
    }

    public render(children: React.ReactNode): JSX.Element {
        throw new Error('"render" method is undefined');
    }

    protected scrollTo(root: HTMLDivElement, offset: number): void {
        throw new Error('"internalScrollTo" method is undefined');
    }

    protected calculateDelta(index: number): number {
        throw new Error('"calculateDelta" method is undefined');
    }

    protected calculateDeltas(): number[] {
        throw new Error('"getDeltas" method is undefined');
    }

    protected calculateClientSize(): number {
        throw new Error('"calculateClientSize" method is undefined');
    }

    protected getPageSize(): number {
        throw new Error('"getPageSize" method is undefined');
    }

    protected calculateSize(): number {
        const deltas = this.calculateDeltas();
        return deltas.reduce((acc, cur) => acc + cur);
    }

    protected createPages(): IPage[] {
        const pages = [];
        const clientSize = this.calculateClientSize();
        const breakSize = this.getPageSize() - clientSize;
        const deltas = this.calculateDeltas();
        const length = deltas.length;
        let size = 0;
        let page: Partial<IPage> = {
            index: 0,
            offset: 0,
            start: 0
        };
        let previousPage: IPage;

        for (let i = 0; i < length; i++) {
            size += deltas[i];
            if (size >= breakSize) {
                previousPage = page as IPage;
                pages.push(previousPage);

                page = {
                    index: previousPage.index + 1,
                    offset: deltas.slice(0, i + 1).reduce((acc, cur) => acc + cur),
                    start: i + 1,
                };

                size = 0;

                previousPage.break = i;

                for (; i < length && size < clientSize; i++) {
                    size += deltas[i];
                }

                previousPage.end = i;
            }
        }

        page.break = length;
        page.end = length;

        pages.push(page as IPage);

        return pages;
    }

    protected calculatePage(): IPage {
        let i = 0;
        const n = this.pages.length;

        while (i < n && this.pages[i].offset! <= this.offset) {
            i++;
        }

        return this.pages[i - 1];
    }

}
