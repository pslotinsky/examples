import { XScroller } from './XScroller';


export class XScrollerGrouped extends XScroller {

    public updateOffset(): void {
        this.scrollTo(this.rootRef.current!, this.offset);
    }

}
