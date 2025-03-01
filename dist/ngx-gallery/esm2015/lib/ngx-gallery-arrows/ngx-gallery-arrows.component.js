import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
let NgxGalleryArrowsComponent = class NgxGalleryArrowsComponent {
    constructor() {
        this.onPrevClick = new EventEmitter();
        this.onNextClick = new EventEmitter();
    }
    handlePrevClick() {
        this.onPrevClick.emit();
    }
    handleNextClick() {
        this.onNextClick.emit();
    }
};
__decorate([
    Input()
], NgxGalleryArrowsComponent.prototype, "prevDisabled", void 0);
__decorate([
    Input()
], NgxGalleryArrowsComponent.prototype, "nextDisabled", void 0);
__decorate([
    Input()
], NgxGalleryArrowsComponent.prototype, "arrowPrevIcon", void 0);
__decorate([
    Input()
], NgxGalleryArrowsComponent.prototype, "arrowNextIcon", void 0);
__decorate([
    Output()
], NgxGalleryArrowsComponent.prototype, "onPrevClick", void 0);
__decorate([
    Output()
], NgxGalleryArrowsComponent.prototype, "onNextClick", void 0);
NgxGalleryArrowsComponent = __decorate([
    Component({
        selector: 'ngx-gallery-arrows',
        template: "<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-left\">\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handlePrevClick()\" [class.ngx-gallery-disabled]=\"prevDisabled\">\n        <i class=\"ngx-gallery-icon-content {{arrowPrevIcon}}\"></i>\n    </div>\n</div>\n<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-right\">\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handleNextClick()\" [class.ngx-gallery-disabled]=\"nextDisabled\">\n        <i class=\"ngx-gallery-icon-content {{arrowNextIcon}}\"></i>\n    </div>\n</div>",
        styles: [".ngx-gallery-arrow-wrapper{display:table;height:100%;position:absolute;table-layout:fixed;width:1px;z-index:2000}.ngx-gallery-arrow-left{left:0}.ngx-gallery-arrow-right{right:0}.ngx-gallery-arrow{-webkit-transform:translateY(-50%);cursor:pointer;top:50%;transform:translateY(-50%)}.ngx-gallery-arrow.ngx-gallery-disabled{cursor:default;opacity:.6}.ngx-gallery-arrow-left .ngx-gallery-arrow{left:10px}.ngx-gallery-arrow-right .ngx-gallery-arrow{right:10px}"]
    })
], NgxGalleryArrowsComponent);
export { NgxGalleryArrowsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYXJyb3dzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZ3JlZ29yeW1hY2UvcHJvamVjdHMvbmd4LWdhbGxlcnktOS9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWdhbGxlcnktYXJyb3dzL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkUsSUFBYSx5QkFBeUIsR0FBdEMsTUFBYSx5QkFBeUI7SUFBdEM7UUFNWSxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBUzdDLENBQUM7SUFQQyxlQUFlO1FBQ1gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQztDQUNGLENBQUE7QUFmVTtJQUFSLEtBQUssRUFBRTsrREFBdUI7QUFDdEI7SUFBUixLQUFLLEVBQUU7K0RBQXVCO0FBQ3RCO0lBQVIsS0FBSyxFQUFFO2dFQUF1QjtBQUN0QjtJQUFSLEtBQUssRUFBRTtnRUFBdUI7QUFFckI7SUFBVCxNQUFNLEVBQUU7OERBQWtDO0FBQ2pDO0lBQVQsTUFBTSxFQUFFOzhEQUFrQztBQVBoQyx5QkFBeUI7SUFMckMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG9CQUFvQjtRQUM5QixxbkJBQWtEOztLQUVuRCxDQUFDO0dBQ1cseUJBQXlCLENBZ0JyQztTQWhCWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1hcnJvd3MnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdhbGxlcnktYXJyb3dzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktYXJyb3dzLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUFycm93c0NvbXBvbmVudHtcbiAgQElucHV0KCkgcHJldkRpc2FibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBuZXh0RGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFycm93UHJldkljb246IHN0cmluZztcbiAgQElucHV0KCkgYXJyb3dOZXh0SWNvbjogc3RyaW5nO1xuXG4gIEBPdXRwdXQoKSBvblByZXZDbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTmV4dENsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGhhbmRsZVByZXZDbGljaygpOiB2b2lkIHtcbiAgICAgIHRoaXMub25QcmV2Q2xpY2suZW1pdCgpO1xuICB9XG5cbiAgaGFuZGxlTmV4dENsaWNrKCk6IHZvaWQge1xuICAgICAgdGhpcy5vbk5leHRDbGljay5lbWl0KCk7XG4gIH1cbn1cbiJdfQ==