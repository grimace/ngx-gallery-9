import { __decorate } from "tslib";
import { Component, Input, EventEmitter, Output } from '@angular/core';
let NgxGalleryBulletsComponent = class NgxGalleryBulletsComponent {
    constructor() {
        this.active = 0;
        this.onChange = new EventEmitter();
    }
    getBullets() {
        return Array(this.count);
    }
    handleChange(event, index) {
        this.onChange.emit(index);
    }
};
__decorate([
    Input()
], NgxGalleryBulletsComponent.prototype, "count", void 0);
__decorate([
    Input()
], NgxGalleryBulletsComponent.prototype, "active", void 0);
__decorate([
    Output()
], NgxGalleryBulletsComponent.prototype, "onChange", void 0);
NgxGalleryBulletsComponent = __decorate([
    Component({
        selector: 'ngx-gallery-bullets',
        template: "<div class=\"ngx-gallery-bullet\" *ngFor=\"let bullet of getBullets(); let i = index;\" (click)=\"handleChange($event, i)\" [ngClass]=\"{ 'ngx-gallery-active': i == active }\"></div>",
        styles: [":host{-webkit-transform:translateX(-50%);bottom:0;display:-webkit-inline-box;display:inline-flex;left:50%;padding:10px;position:absolute;transform:translateX(-50%);z-index:2000}.ngx-gallery-bullet{background:#fff;border-radius:50%;cursor:pointer;height:10px;width:10px}.ngx-gallery-bullet:not(:first-child){margin-left:5px}.ngx-gallery-bullet.ngx-gallery-active,.ngx-gallery-bullet:hover{background:#000}"]
    })
], NgxGalleryBulletsComponent);
export { NgxGalleryBulletsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2dyZWdvcnltYWNlL3Byb2plY3RzL25neC1nYWxsZXJ5LTkvcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjLyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LWJ1bGxldHMvbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkUsSUFBYSwwQkFBMEIsR0FBdkMsTUFBYSwwQkFBMEI7SUFBdkM7UUFFVyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRWxCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBUzFDLENBQUM7SUFQQyxVQUFVO1FBQ04sT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBWSxFQUFFLEtBQWE7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUNGLENBQUE7QUFaVTtJQUFSLEtBQUssRUFBRTt5REFBZTtBQUNkO0lBQVIsS0FBSyxFQUFFOzBEQUFvQjtBQUVsQjtJQUFULE1BQU0sRUFBRTs0REFBK0I7QUFKN0IsMEJBQTBCO0lBTHRDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxxQkFBcUI7UUFDL0Isa01BQW1EOztLQUVwRCxDQUFDO0dBQ1csMEJBQTBCLENBYXRDO1NBYlksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktYnVsbGV0cycsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlCdWxsZXRzQ29tcG9uZW50IHtcbiAgQElucHV0KCkgY291bnQ6IG51bWJlcjtcbiAgQElucHV0KCkgYWN0aXZlOiBudW1iZXIgPSAwO1xuXG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBnZXRCdWxsZXRzKCk6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiBBcnJheSh0aGlzLmNvdW50KTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShldmVudDogRXZlbnQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMub25DaGFuZ2UuZW1pdChpbmRleCk7XG4gIH1cbn1cbiJdfQ==