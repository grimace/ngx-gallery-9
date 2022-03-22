import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxGalleryOrder } from '../ngx-gallery-order.model';
let NgxGalleryThumbnailsComponent = class NgxGalleryThumbnailsComponent {
    constructor(sanitization, elementRef, helperService) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.minStopIndex = 0;
        this.onActiveChange = new EventEmitter();
        this.index = 0;
    }
    ngOnChanges(changes) {
        if (changes['selectedIndex']) {
            this.validateIndex();
        }
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'thumbnails', () => this.moveRight(), () => this.moveLeft());
        }
        if (this.images) {
            this.remainingCountValue = this.images.length - (this.rows * this.columns);
        }
    }
    onMouseEnter() {
        this.mouseenter = true;
    }
    onMouseLeave() {
        this.mouseenter = false;
    }
    reset(index) {
        this.selectedIndex = index;
        this.setDefaultPosition();
        this.index = 0;
        this.validateIndex();
    }
    getImages() {
        if (!this.images) {
            return [];
        }
        if (this.remainingCount) {
            return this.images.slice(0, this.rows * this.columns);
        }
        else if (this.lazyLoading && this.order != NgxGalleryOrder.Row) {
            let stopIndex = 0;
            if (this.order === NgxGalleryOrder.Column) {
                stopIndex = (this.index + this.columns + this.moveSize) * this.rows;
            }
            else if (this.order === NgxGalleryOrder.Page) {
                stopIndex = this.index + ((this.columns * this.rows) * 2);
            }
            if (stopIndex <= this.minStopIndex) {
                stopIndex = this.minStopIndex;
            }
            else {
                this.minStopIndex = stopIndex;
            }
            return this.images.slice(0, stopIndex);
        }
        else {
            return this.images;
        }
    }
    handleClick(event, index) {
        if (!this.hasLink(index)) {
            this.selectedIndex = index;
            this.onActiveChange.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }
    hasLink(index) {
        if (this.links && this.links.length && this.links[index])
            return true;
    }
    moveRight() {
        if (this.canMoveRight()) {
            this.index += this.moveSize;
            let maxIndex = this.getMaxIndex() - this.columns;
            if (this.index > maxIndex) {
                this.index = maxIndex;
            }
            this.setThumbnailsPosition();
        }
    }
    moveLeft() {
        if (this.canMoveLeft()) {
            this.index -= this.moveSize;
            if (this.index < 0) {
                this.index = 0;
            }
            this.setThumbnailsPosition();
        }
    }
    canMoveRight() {
        return this.index + this.columns < this.getMaxIndex() ? true : false;
    }
    canMoveLeft() {
        return this.index !== 0 ? true : false;
    }
    getThumbnailLeft(index) {
        let calculatedIndex;
        if (this.order === NgxGalleryOrder.Column) {
            calculatedIndex = Math.floor(index / this.rows);
        }
        else if (this.order === NgxGalleryOrder.Page) {
            calculatedIndex = (index % this.columns) + (Math.floor(index / (this.rows * this.columns)) * this.columns);
        }
        else if (this.order == NgxGalleryOrder.Row && this.remainingCount) {
            calculatedIndex = index % this.columns;
        }
        else {
            calculatedIndex = index % Math.ceil(this.images.length / this.rows);
        }
        return this.getThumbnailPosition(calculatedIndex, this.columns);
    }
    getThumbnailTop(index) {
        let calculatedIndex;
        if (this.order === NgxGalleryOrder.Column) {
            calculatedIndex = index % this.rows;
        }
        else if (this.order === NgxGalleryOrder.Page) {
            calculatedIndex = Math.floor(index / this.columns) - (Math.floor(index / (this.rows * this.columns)) * this.rows);
        }
        else if (this.order == NgxGalleryOrder.Row && this.remainingCount) {
            calculatedIndex = Math.floor(index / this.columns);
        }
        else {
            calculatedIndex = Math.floor(index / Math.ceil(this.images.length / this.rows));
        }
        return this.getThumbnailPosition(calculatedIndex, this.rows);
    }
    getThumbnailWidth() {
        return this.getThumbnailDimension(this.columns);
    }
    getThumbnailHeight() {
        return this.getThumbnailDimension(this.rows);
    }
    setThumbnailsPosition() {
        this.thumbnailsLeft = -((100 / this.columns) * this.index) + '%';
        this.thumbnailsMarginLeft = -((this.margin - (((this.columns - 1)
            * this.margin) / this.columns)) * this.index) + 'px';
    }
    setDefaultPosition() {
        this.thumbnailsLeft = '0px';
        this.thumbnailsMarginLeft = '0px';
    }
    canShowArrows() {
        if (this.remainingCount) {
            return false;
        }
        else if (this.arrows && this.images && this.images.length > this.getVisibleCount()
            && (!this.arrowsAutoHide || this.mouseenter)) {
            return true;
        }
        else {
            return false;
        }
    }
    validateIndex() {
        if (this.images) {
            let newIndex;
            if (this.order === NgxGalleryOrder.Column) {
                newIndex = Math.floor(this.selectedIndex / this.rows);
            }
            else {
                newIndex = this.selectedIndex % Math.ceil(this.images.length / this.rows);
            }
            if (this.remainingCount) {
                newIndex = 0;
            }
            if (newIndex < this.index || newIndex >= this.index + this.columns) {
                const maxIndex = this.getMaxIndex() - this.columns;
                this.index = newIndex > maxIndex ? maxIndex : newIndex;
                this.setThumbnailsPosition();
            }
        }
    }
    getSafeUrl(image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
    getThumbnailPosition(index, count) {
        return this.getSafeStyle('calc(' + ((100 / count) * index) + '% + '
            + ((this.margin - (((count - 1) * this.margin) / count)) * index) + 'px)');
    }
    getThumbnailDimension(count) {
        if (this.margin !== 0) {
            return this.getSafeStyle('calc(' + (100 / count) + '% - '
                + (((count - 1) * this.margin) / count) + 'px)');
        }
        else {
            return this.getSafeStyle('calc(' + (100 / count) + '% + 1px)');
        }
    }
    getMaxIndex() {
        if (this.order == NgxGalleryOrder.Page) {
            let maxIndex = (Math.floor(this.images.length / this.getVisibleCount()) * this.columns);
            if (this.images.length % this.getVisibleCount() > this.columns) {
                maxIndex += this.columns;
            }
            else {
                maxIndex += this.images.length % this.getVisibleCount();
            }
            return maxIndex;
        }
        else {
            return Math.ceil(this.images.length / this.rows);
        }
    }
    getVisibleCount() {
        return this.columns * this.rows;
    }
    getSafeStyle(value) {
        return this.sanitization.bypassSecurityTrustStyle(value);
    }
};
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "images", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "links", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "labels", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "linkTarget", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "columns", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "rows", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "arrows", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "arrowsAutoHide", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "margin", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "selectedIndex", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "clickable", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "swipe", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "size", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "arrowPrevIcon", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "arrowNextIcon", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "moveSize", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "order", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "remainingCount", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "lazyLoading", void 0);
__decorate([
    Input()
], NgxGalleryThumbnailsComponent.prototype, "actions", void 0);
__decorate([
    Output()
], NgxGalleryThumbnailsComponent.prototype, "onActiveChange", void 0);
__decorate([
    HostListener('mouseenter')
], NgxGalleryThumbnailsComponent.prototype, "onMouseEnter", null);
__decorate([
    HostListener('mouseleave')
], NgxGalleryThumbnailsComponent.prototype, "onMouseLeave", null);
NgxGalleryThumbnailsComponent = __decorate([
    Component({
        selector: 'ngx-gallery-thumbnails',
        template: "<div class=\"ngx-gallery-thumbnails-wrapper ngx-gallery-thumbnail-size-{{size}}\">\n    <div class=\"ngx-gallery-thumbnails\" [style.transform]=\"'translateX(' + thumbnailsLeft + ')'\" [style.marginLeft]=\"thumbnailsMarginLeft\">\n        <a [href]=\"hasLink(i) ? links[i] : '#'\" [target]=\"linkTarget\" class=\"ngx-gallery-thumbnail\" *ngFor=\"let image of getImages(); let i = index;\" [style.background-image]=\"getSafeUrl(image)\" (click)=\"handleClick($event, i)\" [style.width]=\"getThumbnailWidth()\" [style.height]=\"getThumbnailHeight()\" [style.left]=\"getThumbnailLeft(i)\" [style.top]=\"getThumbnailTop(i)\" [ngClass]=\"{ 'ngx-gallery-active': i == selectedIndex, 'ngx-gallery-clickable': clickable }\" [attr.aria-label]=\"labels[i]\">\n            <div class=\"ngx-gallery-icons-wrapper\">\n                <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, i)\"></ngx-gallery-action>\n            </div>\n            <div class=\"ngx-gallery-remaining-count-overlay\" *ngIf=\"remainingCount && remainingCountValue && (i == (rows * columns) - 1)\">\n                <span class=\"ngx-gallery-remaining-count\">+{{remainingCountValue}}</span>\n            </div>\n        </a>\n    </div>\n</div>\n<ngx-gallery-arrows *ngIf=\"canShowArrows()\" (onPrevClick)=\"moveLeft()\" (onNextClick)=\"moveRight()\" [prevDisabled]=\"!canMoveLeft()\" [nextDisabled]=\"!canMoveRight()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\n",
        styles: [":host{display:inline-block;position:relative;width:100%}.ngx-gallery-thumbnails-wrapper{height:100%;overflow:hidden;position:absolute;width:100%}.ngx-gallery-thumbnails{-webkit-transform:translateX(0);-webkit-transition:-webkit-transform .5s ease-in-out;height:100%;left:0;position:absolute;transform:translateX(0);transition:-webkit-transform .5s ease-in-out;transition:transform .5s ease-in-out;transition:transform .5s ease-in-out,-webkit-transform .5s ease-in-out;width:100%;will-change:transform}.ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-position:50%;background-repeat:no-repeat;height:100%;position:absolute;text-decoration:none}.ngx-gallery-thumbnail-size-cover .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:cover}.ngx-gallery-thumbnail-size-contain .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:contain}.ngx-gallery-remaining-count-overlay{background-color:rgba(0,0,0,.4);height:100%;left:0;position:absolute;top:0;width:100%}.ngx-gallery-remaining-count{-webkit-transform:translate(-50%,-50%);color:#fff;font-size:30px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}"]
    })
], NgxGalleryThumbnailsComponent);
export { NgxGalleryThumbnailsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2dyZWdvcnltYWNlL3Byb2plY3RzL25neC1nYWxsZXJ5LTkvcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjLyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LXRodW1ibmFpbHMvbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWEsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQTZCLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFPN0QsSUFBYSw2QkFBNkIsR0FBMUMsTUFBYSw2QkFBNkI7SUFrQ3hDLFlBQW9CLFlBQTBCLEVBQVUsVUFBc0IsRUFDbEUsYUFBc0M7UUFEOUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ2xFLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQTVCbEQsaUJBQVksR0FBRyxDQUFDLENBQUM7UUF1QlAsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXRDLFVBQUssR0FBRyxDQUFDLENBQUM7SUFHbUMsQ0FBQztJQUV0RCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUMxRCxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLElB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SyxFQUFFO3FFQUF5QjtBQUN4QjtJQUFSLEtBQUssRUFBRTs2REFBZ0I7QUFDZjtJQUFSLEtBQUssRUFBRTtvRUFBdUI7QUFDdEI7SUFBUixLQUFLLEVBQUU7Z0VBQW9CO0FBQ25CO0lBQVIsS0FBSyxFQUFFOzREQUFnQjtBQUNmO0lBQVIsS0FBSyxFQUFFOzJEQUFjO0FBQ2I7SUFBUixLQUFLLEVBQUU7b0VBQXVCO0FBQ3RCO0lBQVIsS0FBSyxFQUFFO29FQUF1QjtBQUN0QjtJQUFSLEtBQUssRUFBRTsrREFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7NERBQWU7QUFDZDtJQUFSLEtBQUssRUFBRTtxRUFBeUI7QUFDeEI7SUFBUixLQUFLLEVBQUU7a0VBQXNCO0FBQ3JCO0lBQVIsS0FBSyxFQUFFOzhEQUE2QjtBQUUzQjtJQUFULE1BQU0sRUFBRTtxRUFBcUM7QUFzQmxCO0lBQTNCLFlBQVksQ0FBQyxZQUFZLENBQUM7aUVBRTFCO0FBRTJCO0lBQTNCLFlBQVksQ0FBQyxZQUFZLENBQUM7aUVBRTFCO0FBMURVLDZCQUE2QjtJQUx6QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsd0JBQXdCO1FBQ2xDLDRrREFBc0Q7O0tBRXZELENBQUM7R0FDVyw2QkFBNkIsQ0F5UnpDO1NBelJZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25DaGFuZ2VzLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYsIFNpbXBsZUNoYW5nZXMsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsLCBEb21TYW5pdGl6ZXIsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbiB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IE5neEdhbGxlcnlPcmRlciB9IGZyb20gJy4uL25neC1nYWxsZXJ5LW9yZGVyLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktdGh1bWJuYWlscycsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICB0aHVtYm5haWxzTGVmdDogc3RyaW5nO1xuICB0aHVtYm5haWxzTWFyZ2luTGVmdDogc3RyaW5nO1xuICBtb3VzZWVudGVyOiBib29sZWFuO1xuICByZW1haW5pbmdDb3VudFZhbHVlOiBudW1iZXI7XG5cbiAgbWluU3RvcEluZGV4ID0gMDtcblxuICBASW5wdXQoKSBpbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XG4gIEBJbnB1dCgpIGxpbmtzOiBzdHJpbmdbXTtcbiAgQElucHV0KCkgbGFiZWxzOiBzdHJpbmdbXTtcbiAgQElucHV0KCkgbGlua1RhcmdldDogc3RyaW5nO1xuICBASW5wdXQoKSBjb2x1bW5zOiBudW1iZXI7XG4gIEBJbnB1dCgpIHJvd3M6IG51bWJlcjtcbiAgQElucHV0KCkgYXJyb3dzOiBib29sZWFuO1xuICBASW5wdXQoKSBhcnJvd3NBdXRvSGlkZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbWFyZ2luOiBudW1iZXI7XG4gIEBJbnB1dCgpIHNlbGVjdGVkSW5kZXg6IG51bWJlcjtcbiAgQElucHV0KCkgY2xpY2thYmxlOiBib29sZWFuO1xuICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcbiAgQElucHV0KCkgc2l6ZTogc3RyaW5nO1xuICBASW5wdXQoKSBhcnJvd1ByZXZJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGFycm93TmV4dEljb246IHN0cmluZztcbiAgQElucHV0KCkgbW92ZVNpemU6IG51bWJlcjtcbiAgQElucHV0KCkgb3JkZXI6IG51bWJlcjtcbiAgQElucHV0KCkgcmVtYWluaW5nQ291bnQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxhenlMb2FkaW5nOiBib29sZWFuO1xuICBASW5wdXQoKSBhY3Rpb25zOiBOZ3hHYWxsZXJ5QWN0aW9uW107XG5cbiAgQE91dHB1dCgpIG9uQWN0aXZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgaW5kZXggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemF0aW9uOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIHByaXZhdGUgaGVscGVyU2VydmljZTogTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UpIHt9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgaWYgKGNoYW5nZXNbJ3NlbGVjdGVkSW5kZXgnXSkge1xuICAgICAgICAgIHRoaXMudmFsaWRhdGVJbmRleCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snc3dpcGUnXSkge1xuICAgICAgICAgIHRoaXMuaGVscGVyU2VydmljZS5tYW5hZ2VTd2lwZSh0aGlzLnN3aXBlLCB0aGlzLmVsZW1lbnRSZWYsXG4gICAgICAgICAgJ3RodW1ibmFpbHMnLCAoKSA9PiB0aGlzLm1vdmVSaWdodCgpLCAoKSA9PiB0aGlzLm1vdmVMZWZ0KCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pbWFnZXMpIHtcbiAgICAgICAgICB0aGlzLnJlbWFpbmluZ0NvdW50VmFsdWUgPSB0aGlzLmltYWdlcy5sZW5ndGggLSAodGhpcy5yb3dzICogdGhpcy5jb2x1bW5zKTtcbiAgICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICB0aGlzLm1vdXNlZW50ZXIgPSB0cnVlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpIG9uTW91c2VMZWF2ZSgpIHtcbiAgICAgIHRoaXMubW91c2VlbnRlciA9IGZhbHNlO1xuICB9XG5cbiAgcmVzZXQoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLnNldERlZmF1bHRQb3NpdGlvbigpO1xuXG4gICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgIHRoaXMudmFsaWRhdGVJbmRleCgpO1xuICB9XG5cbiAgZ2V0SW1hZ2VzKCk6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW10ge1xuICAgICAgaWYgKCF0aGlzLmltYWdlcykge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVtYWluaW5nQ291bnQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMuc2xpY2UoMCwgdGhpcy5yb3dzICogdGhpcy5jb2x1bW5zKTtcbiAgICAgIH0gXG4gICAgICBlbHNlIGlmICh0aGlzLmxhenlMb2FkaW5nICYmIHRoaXMub3JkZXIgIT0gTmd4R2FsbGVyeU9yZGVyLlJvdykge1xuICAgICAgICAgIGxldCBzdG9wSW5kZXggPSAwO1xuXG4gICAgICAgICAgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5Db2x1bW4pIHtcbiAgICAgICAgICAgICAgc3RvcEluZGV4ID0gKHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMgKyB0aGlzLm1vdmVTaXplKSAqIHRoaXMucm93cztcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLlBhZ2UpIHtcbiAgICAgICAgICAgICAgc3RvcEluZGV4ID0gdGhpcy5pbmRleCArICgodGhpcy5jb2x1bW5zICogdGhpcy5yb3dzKSAqIDIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdG9wSW5kZXggPD0gdGhpcy5taW5TdG9wSW5kZXgpIHtcbiAgICAgICAgICAgICAgc3RvcEluZGV4ID0gdGhpcy5taW5TdG9wSW5kZXg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5taW5TdG9wSW5kZXggPSBzdG9wSW5kZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzLnNsaWNlKDAsIHN0b3BJbmRleCk7XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzO1xuICAgICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICBpZiAoIXRoaXMuaGFzTGluayhpbmRleCkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgICAgICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlLmVtaXQoaW5kZXgpO1xuXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgfVxuXG4gIGhhc0xpbmsoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMubGlua3MgJiYgdGhpcy5saW5rcy5sZW5ndGggJiYgdGhpcy5saW5rc1tpbmRleF0pIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZVJpZ2h0KCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZVJpZ2h0KCkpIHtcbiAgICAgICAgICB0aGlzLmluZGV4ICs9IHRoaXMubW92ZVNpemU7XG4gICAgICAgICAgbGV0IG1heEluZGV4ID0gdGhpcy5nZXRNYXhJbmRleCgpIC0gdGhpcy5jb2x1bW5zO1xuXG4gICAgICAgICAgaWYgKHRoaXMuaW5kZXggPiBtYXhJbmRleCkge1xuICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gbWF4SW5kZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zZXRUaHVtYm5haWxzUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgfVxuXG4gIG1vdmVMZWZ0KCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZUxlZnQoKSkge1xuICAgICAgICAgIHRoaXMuaW5kZXggLT0gdGhpcy5tb3ZlU2l6ZTtcblxuICAgICAgICAgIGlmICh0aGlzLmluZGV4IDwgMCkge1xuICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xuICAgICAgfVxuICB9XG5cbiAgY2FuTW92ZVJpZ2h0KCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMgPCB0aGlzLmdldE1heEluZGV4KCkgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBjYW5Nb3ZlTGVmdCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAwID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG5cbiAgZ2V0VGh1bWJuYWlsTGVmdChpbmRleDogbnVtYmVyKTogU2FmZVN0eWxlIHtcbiAgICAgIGxldCBjYWxjdWxhdGVkSW5kZXg7XG5cbiAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIHRoaXMucm93cyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuUGFnZSkge1xuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IChpbmRleCAlIHRoaXMuY29sdW1ucykgKyAoTWF0aC5mbG9vcihpbmRleCAvICh0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpKSAqIHRoaXMuY29sdW1ucyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09IE5neEdhbGxlcnlPcmRlci5Sb3cgJiYgdGhpcy5yZW1haW5pbmdDb3VudCkge1xuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IGluZGV4ICUgdGhpcy5jb2x1bW5zO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gaW5kZXggJSBNYXRoLmNlaWwodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5yb3dzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsUG9zaXRpb24oY2FsY3VsYXRlZEluZGV4LCB0aGlzLmNvbHVtbnMpO1xuICB9XG5cbiAgZ2V0VGh1bWJuYWlsVG9wKGluZGV4OiBudW1iZXIpOiBTYWZlU3R5bGUge1xuICAgICAgbGV0IGNhbGN1bGF0ZWRJbmRleDtcblxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5Db2x1bW4pIHtcbiAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBpbmRleCAlIHRoaXMucm93cztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5QYWdlKSB7XG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIHRoaXMuY29sdW1ucykgLSAoTWF0aC5mbG9vcihpbmRleCAvICh0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpKSAqIHRoaXMucm93cyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09IE5neEdhbGxlcnlPcmRlci5Sb3cgJiYgdGhpcy5yZW1haW5pbmdDb3VudCkge1xuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyB0aGlzLmNvbHVtbnMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIE1hdGguY2VpbCh0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLnJvd3MpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsUG9zaXRpb24oY2FsY3VsYXRlZEluZGV4LCB0aGlzLnJvd3MpO1xuICB9XG5cbiAgZ2V0VGh1bWJuYWlsV2lkdGgoKTogU2FmZVN0eWxlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbERpbWVuc2lvbih0aGlzLmNvbHVtbnMpO1xuICB9XG5cbiAgZ2V0VGh1bWJuYWlsSGVpZ2h0KCk6IFNhZmVTdHlsZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRUaHVtYm5haWxEaW1lbnNpb24odGhpcy5yb3dzKTtcbiAgfVxuXG4gIHNldFRodW1ibmFpbHNQb3NpdGlvbigpOiB2b2lkIHtcbiAgICAgIHRoaXMudGh1bWJuYWlsc0xlZnQgPSAtICgoMTAwIC8gdGhpcy5jb2x1bW5zKSAqIHRoaXMuaW5kZXgpICsgJyUnXG5cbiAgICAgIHRoaXMudGh1bWJuYWlsc01hcmdpbkxlZnQgPSAtICgodGhpcy5tYXJnaW4gLSAoKCh0aGlzLmNvbHVtbnMgLSAxKVxuICAgICAgKiB0aGlzLm1hcmdpbikgLyB0aGlzLmNvbHVtbnMpKSAqIHRoaXMuaW5kZXgpICsgJ3B4JztcbiAgfVxuXG4gIHNldERlZmF1bHRQb3NpdGlvbigpOiB2b2lkIHtcbiAgICAgIHRoaXMudGh1bWJuYWlsc0xlZnQgPSAnMHB4JztcbiAgICAgIHRoaXMudGh1bWJuYWlsc01hcmdpbkxlZnQgPSAnMHB4JztcbiAgfVxuXG4gIGNhblNob3dBcnJvd3MoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5yZW1haW5pbmdDb3VudCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hcnJvd3MgJiYgdGhpcy5pbWFnZXMgJiYgdGhpcy5pbWFnZXMubGVuZ3RoID4gdGhpcy5nZXRWaXNpYmxlQ291bnQoKVxuICAgICAgICAgICYmICghdGhpcy5hcnJvd3NBdXRvSGlkZSB8fCB0aGlzLm1vdXNlZW50ZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlSW5kZXgoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5pbWFnZXMpIHtcbiAgICAgICAgICBsZXQgbmV3SW5kZXg7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLkNvbHVtbikge1xuICAgICAgICAgICAgICBuZXdJbmRleCA9IE1hdGguZmxvb3IodGhpcy5zZWxlY3RlZEluZGV4IC8gdGhpcy5yb3dzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleCAlIE1hdGguY2VpbCh0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLnJvd3MpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLnJlbWFpbmluZ0NvdW50KSB7XG4gICAgICAgICAgICAgIG5ld0luZGV4ID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV3SW5kZXggPCB0aGlzLmluZGV4IHx8IG5ld0luZGV4ID49IHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgY29uc3QgbWF4SW5kZXggPSB0aGlzLmdldE1heEluZGV4KCkgLSB0aGlzLmNvbHVtbnM7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBuZXdJbmRleCA+IG1heEluZGV4ID8gbWF4SW5kZXggOiBuZXdJbmRleDtcblxuICAgICAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG4gIGdldFNhZmVVcmwoaW1hZ2U6IHN0cmluZyk6IFNhZmVTdHlsZSB7XG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKHRoaXMuaGVscGVyU2VydmljZS5nZXRCYWNrZ3JvdW5kVXJsKGltYWdlKSk7XG4gIH1cblxuICBwcml2YXRlIGdldFRodW1ibmFpbFBvc2l0aW9uKGluZGV4OiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiBTYWZlU3R5bGUge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0U2FmZVN0eWxlKCdjYWxjKCcgKyAoKDEwMCAvIGNvdW50KSAqIGluZGV4KSArICclICsgJ1xuICAgICAgICAgICsgKCh0aGlzLm1hcmdpbiAtICgoKGNvdW50IC0gMSkgKiB0aGlzLm1hcmdpbikgLyBjb3VudCkpICogaW5kZXgpICsgJ3B4KScpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUaHVtYm5haWxEaW1lbnNpb24oY291bnQ6IG51bWJlcik6IFNhZmVTdHlsZSB7XG4gICAgICBpZiAodGhpcy5tYXJnaW4gIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTYWZlU3R5bGUoJ2NhbGMoJyArICgxMDAgLyBjb3VudCkgKyAnJSAtICdcbiAgICAgICAgICAgICAgKyAoKChjb3VudCAtIDEpICogdGhpcy5tYXJnaW4pIC8gY291bnQpICsgJ3B4KScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTYWZlU3R5bGUoJ2NhbGMoJyArICgxMDAgLyBjb3VudCkgKyAnJSArIDFweCknKTtcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWF4SW5kZXgoKTogbnVtYmVyIHtcbiAgICAgIGlmICh0aGlzLm9yZGVyID09IE5neEdhbGxlcnlPcmRlci5QYWdlKSB7XG4gICAgICAgICAgbGV0IG1heEluZGV4ID0gKE1hdGguZmxvb3IodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5nZXRWaXNpYmxlQ291bnQoKSkgKiB0aGlzLmNvbHVtbnMpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuaW1hZ2VzLmxlbmd0aCAlIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCkgPiB0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgbWF4SW5kZXggKz0gdGhpcy5jb2x1bW5zO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgbWF4SW5kZXggKz0gdGhpcy5pbWFnZXMubGVuZ3RoICUgdGhpcy5nZXRWaXNpYmxlQ291bnQoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbWF4SW5kZXg7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMucm93cyk7XG4gICAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFZpc2libGVDb3VudCgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuY29sdW1ucyAqIHRoaXMucm93cztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2FmZVN0eWxlKHZhbHVlOiBzdHJpbmcpOiBTYWZlU3R5bGUge1xuICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemF0aW9uLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZSh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==