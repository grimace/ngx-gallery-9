import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
let NgxGalleryPreviewComponent = class NgxGalleryPreviewComponent {
    constructor(sanitization, elementRef, helperService, renderer, changeDetectorRef) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.renderer = renderer;
        this.changeDetectorRef = changeDetectorRef;
        this.showSpinner = false;
        this.positionLeft = 0;
        this.positionTop = 0;
        this.zoomValue = 1;
        this.loading = false;
        this.rotateValue = 0;
        this.index = 0;
        this.onOpen = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onActiveChange = new EventEmitter();
        this.isOpen = false;
        this.initialX = 0;
        this.initialY = 0;
        this.initialLeft = 0;
        this.initialTop = 0;
        this.isMove = false;
    }
    ngOnInit() {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
    }
    ngOnChanges(changes) {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'preview', () => this.showNext(), () => this.showPrev());
        }
    }
    ngOnDestroy() {
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }
    onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
    }
    onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
    }
    onKeyDown(e) {
        if (this.isOpen) {
            if (this.keyboardNavigation) {
                if (this.isKeyboardPrev(e)) {
                    this.showPrev();
                }
                else if (this.isKeyboardNext(e)) {
                    this.showNext();
                }
            }
            if (this.closeOnEsc && this.isKeyboardEsc(e)) {
                this.close();
            }
        }
    }
    open(index) {
        this.onOpen.emit();
        this.index = index;
        this.isOpen = true;
        this.show(true);
        if (this.forceFullscreen) {
            this.manageFullscreen();
        }
        this.keyDownListener = this.renderer.listen("window", "keydown", (e) => this.onKeyDown(e));
    }
    close() {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();
        this.stopAutoPlay();
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }
    imageMouseEnter() {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }
    imageMouseLeave() {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }
    startAutoPlay() {
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.timer = setTimeout(() => {
                if (!this.showNext()) {
                    this.index = -1;
                    this.showNext();
                }
            }, this.autoPlayInterval);
        }
    }
    stopAutoPlay() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    showAtIndex(index) {
        this.index = index;
        this.show();
    }
    showNext() {
        if (this.canShowNext()) {
            this.index++;
            if (this.index === this.images.length) {
                this.index = 0;
            }
            this.show();
            return true;
        }
        else {
            return false;
        }
    }
    showPrev() {
        if (this.canShowPrev()) {
            this.index--;
            if (this.index < 0) {
                this.index = this.images.length - 1;
            }
            this.show();
        }
    }
    canShowNext() {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index < this.images.length - 1 ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index > 0 ? true : false;
        }
        else {
            return false;
        }
    }
    manageFullscreen() {
        if (this.fullscreen || this.forceFullscreen) {
            const doc = document;
            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            }
            else {
                this.closeFullscreen();
            }
        }
    }
    getSafeUrl(image) {
        return image.substr(0, 10) === 'data:image' ?
            image : this.sanitization.bypassSecurityTrustUrl(image);
    }
    zoomIn() {
        if (this.canZoomIn()) {
            this.zoomValue += this.zoomStep;
            if (this.zoomValue > this.zoomMax) {
                this.zoomValue = this.zoomMax;
            }
        }
    }
    zoomOut() {
        if (this.canZoomOut()) {
            this.zoomValue -= this.zoomStep;
            if (this.zoomValue < this.zoomMin) {
                this.zoomValue = this.zoomMin;
            }
            if (this.zoomValue <= 1) {
                this.resetPosition();
            }
        }
    }
    rotateLeft() {
        this.rotateValue -= 90;
    }
    rotateRight() {
        this.rotateValue += 90;
    }
    getTransform() {
        return this.sanitization.bypassSecurityTrustStyle('scale(' + this.zoomValue + ') rotate(' + this.rotateValue + 'deg)');
    }
    canZoomIn() {
        return this.zoomValue < this.zoomMax ? true : false;
    }
    canZoomOut() {
        return this.zoomValue > this.zoomMin ? true : false;
    }
    canDragOnZoom() {
        return this.zoom && this.zoomValue > 1;
    }
    mouseDownHandler(e) {
        if (this.canDragOnZoom()) {
            this.initialX = this.getClientX(e);
            this.initialY = this.getClientY(e);
            this.initialLeft = this.positionLeft;
            this.initialTop = this.positionTop;
            this.isMove = true;
            e.preventDefault();
        }
    }
    mouseUpHandler(e) {
        this.isMove = false;
    }
    mouseMoveHandler(e) {
        if (this.isMove) {
            this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
            this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
        }
    }
    getClientX(e) {
        return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    }
    getClientY(e) {
        return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    }
    resetPosition() {
        if (this.zoom) {
            this.positionLeft = 0;
            this.positionTop = 0;
        }
    }
    isKeyboardNext(e) {
        return e.keyCode === 39 ? true : false;
    }
    isKeyboardPrev(e) {
        return e.keyCode === 37 ? true : false;
    }
    isKeyboardEsc(e) {
        return e.keyCode === 27 ? true : false;
    }
    openFullscreen() {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }
    closeFullscreen() {
        if (this.isFullscreen()) {
            const doc = document;
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            }
            else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
            else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            }
            else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
        }
    }
    isFullscreen() {
        const doc = document;
        return doc.fullscreenElement || doc.webkitFullscreenElement
            || doc.mozFullScreenElement || doc.msFullscreenElement;
    }
    show(first = false) {
        this.loading = true;
        this.stopAutoPlay();
        this.onActiveChange.emit(this.index);
        if (first || !this.animation) {
            this._show();
        }
        else {
            setTimeout(() => this._show(), 600);
        }
    }
    _show() {
        this.zoomValue = 1;
        this.rotateValue = 0;
        this.resetPosition();
        this.src = this.getSafeUrl(this.images[this.index]);
        this.srcIndex = this.index;
        this.description = this.descriptions[this.index];
        this.changeDetectorRef.markForCheck();
        setTimeout(() => {
            if (this.isLoaded(this.previewImage.nativeElement)) {
                this.loading = false;
                this.startAutoPlay();
                this.changeDetectorRef.markForCheck();
            }
            else {
                setTimeout(() => {
                    if (this.loading) {
                        this.showSpinner = true;
                        this.changeDetectorRef.markForCheck();
                    }
                });
                this.previewImage.nativeElement.onload = () => {
                    this.loading = false;
                    this.showSpinner = false;
                    this.previewImage.nativeElement.onload = null;
                    this.startAutoPlay();
                    this.changeDetectorRef.markForCheck();
                };
            }
        });
    }
    isLoaded(img) {
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }
        return true;
    }
};
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "images", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "descriptions", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "showDescription", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "arrows", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "arrowsAutoHide", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "swipe", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "fullscreen", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "forceFullscreen", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "closeOnClick", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "closeOnEsc", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "keyboardNavigation", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "arrowPrevIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "arrowNextIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "closeIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "fullscreenIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "spinnerIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "autoPlay", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "autoPlayInterval", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "autoPlayPauseOnHover", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "infinityMove", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "zoom", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "zoomStep", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "zoomMax", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "zoomMin", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "zoomInIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "zoomOutIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "animation", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "actions", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "rotate", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "rotateLeftIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "rotateRightIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "download", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "downloadIcon", void 0);
__decorate([
    Input()
], NgxGalleryPreviewComponent.prototype, "bullets", void 0);
__decorate([
    Output()
], NgxGalleryPreviewComponent.prototype, "onOpen", void 0);
__decorate([
    Output()
], NgxGalleryPreviewComponent.prototype, "onClose", void 0);
__decorate([
    Output()
], NgxGalleryPreviewComponent.prototype, "onActiveChange", void 0);
__decorate([
    ViewChild('previewImage')
], NgxGalleryPreviewComponent.prototype, "previewImage", void 0);
__decorate([
    HostListener('mouseenter')
], NgxGalleryPreviewComponent.prototype, "onMouseEnter", null);
__decorate([
    HostListener('mouseleave')
], NgxGalleryPreviewComponent.prototype, "onMouseLeave", null);
NgxGalleryPreviewComponent = __decorate([
    Component({
        selector: 'ngx-gallery-preview',
        template: "<ngx-gallery-arrows *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\n<div class=\"ngx-gallery-preview-top\">\n    <div class=\"ngx-gallery-preview-icons\">\n        <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, index)\"></ngx-gallery-action>\n        <a *ngIf=\"download && src\" [href]=\"src\" class=\"ngx-gallery-icon\" aria-hidden=\"true\" download>\n            <i class=\"ngx-gallery-icon-content {{ downloadIcon }}\"></i>\n        </a>\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomOutIcon\" [disabled]=\"!canZoomOut()\" (onClick)=\"zoomOut()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomInIcon\" [disabled]=\"!canZoomIn()\" (onClick)=\"zoomIn()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateLeftIcon\" (onClick)=\"rotateLeft()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateRightIcon\" (onClick)=\"rotateRight()\"></ngx-gallery-action>\n        <ngx-gallery-action *ngIf=\"fullscreen\" [icon]=\"'ngx-gallery-fullscreen ' + fullscreenIcon\" (onClick)=\"manageFullscreen()\"></ngx-gallery-action>\n        <ngx-gallery-action [icon]=\"'ngx-gallery-close ' + closeIcon\" (onClick)=\"close()\"></ngx-gallery-action>\n    </div>\n</div>\n<div class=\"ngx-spinner-wrapper ngx-gallery-center\" [class.ngx-gallery-active]=\"showSpinner\">\n    <i class=\"ngx-gallery-icon ngx-gallery-spinner {{spinnerIcon}}\" aria-hidden=\"true\"></i>\n</div>\n<div class=\"ngx-gallery-preview-wrapper\" (click)=\"closeOnClick && close()\" (mouseup)=\"mouseUpHandler($event)\" (mousemove)=\"mouseMoveHandler($event)\" (touchend)=\"mouseUpHandler($event)\" (touchmove)=\"mouseMoveHandler($event)\">\n    <div class=\"ngx-gallery-preview-img-wrapper\">\n        <img *ngIf=\"src\" #previewImage class=\"ngx-gallery-preview-img ngx-gallery-center\" [src]=\"src\" (click)=\"$event.stopPropagation()\" (mouseenter)=\"imageMouseEnter()\" (mouseleave)=\"imageMouseLeave()\" (mousedown)=\"mouseDownHandler($event)\" (touchstart)=\"mouseDownHandler($event)\" [class.ngx-gallery-active]=\"!loading\" [class.animation]=\"animation\" [class.ngx-gallery-grab]=\"canDragOnZoom()\" [style.transform]=\"getTransform()\" [style.left]=\"positionLeft + 'px'\" [style.top]=\"positionTop + 'px'\"/>\n        <ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"index\" (onChange)=\"showAtIndex($event)\"></ngx-gallery-bullets>\n    </div>\n    <div class=\"ngx-gallery-preview-text\" *ngIf=\"showDescription && description\" [innerHTML]=\"description\" (click)=\"$event.stopPropagation()\"></div>\n</div>",
        styles: [":host(.ngx-gallery-active){background:rgba(0,0,0,.7);display:inline-block;height:100%;left:0;position:fixed;top:0;width:100%;z-index:10000}:host{display:none}:host>.ngx-gallery-arrow{font-size:50px}:host>ngx-gallery-bullets{-webkit-box-align:center;align-items:center;height:5%;padding:0}.ngx-gallery-preview-img{-moz-user-select:none;-ms-user-select:none;-webkit-transition:-webkit-transform .5s;-webkit-user-select:none;max-height:90%;max-width:90%;opacity:0;transition:-webkit-transform .5s;transition:transform .5s;transition:transform .5s,-webkit-transform .5s;user-select:none}.ngx-gallery-preview-img.animation{-webkit-transition:opacity .5s linear,-webkit-transform .5s;transition:opacity .5s linear,-webkit-transform .5s;transition:opacity .5s linear,transform .5s;transition:opacity .5s linear,transform .5s,-webkit-transform .5s}.ngx-gallery-preview-img.ngx-gallery-active{opacity:1}.ngx-gallery-preview-img.ngx-gallery-grab{cursor:grab;cursor:-webkit-grab}.ngx-gallery-icon.ngx-gallery-spinner{display:inline-block;font-size:50px;left:0}:host>.ngx-gallery-preview-top{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;position:absolute;user-select:none;width:100%}:host>.ngx-gallery-preview-icons{float:right}:host>.ngx-gallery-preview-icons .ngx-gallery-icon{cursor:pointer;font-size:25px;margin-right:10px;margin-top:10px;position:relative;text-decoration:none}:host>.ngx-gallery-preview-icons .ngx-gallery-icon.ngx-gallery-icon-disabled{cursor:default;opacity:.4}.ngx-spinner-wrapper{display:none;height:50px;width:50px}.ngx-spinner-wrapper.ngx-gallery-active{display:inline-block}.ngx-gallery-center{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.ngx-gallery-preview-text{-webkit-box-flex:0;background:rgba(0,0,0,.7);color:#fff;flex:0 1 auto;font-size:16px;padding:10px;text-align:center;width:100%;z-index:10}.ngx-gallery-preview-wrapper{-webkit-box-direction:normal;-webkit-box-orient:vertical;display:-webkit-box;display:flex;flex-flow:column;height:100%;width:100%}.ngx-gallery-preview-img-wrapper{-webkit-box-flex:1;flex:1 1 auto;position:relative}"]
    })
], NgxGalleryPreviewComponent);
export { NgxGalleryPreviewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2dyZWdvcnltYWNlL3Byb2plY3RzL25neC1nYWxsZXJ5LTkvcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjLyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LXByZXZpZXcvbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFhLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFnRCxZQUFZLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFVNUssSUFBYSwwQkFBMEIsR0FBdkMsTUFBYSwwQkFBMEI7SUFnRXJDLFlBQW9CLFlBQTBCLEVBQVUsVUFBc0IsRUFDbEUsYUFBc0MsRUFBVSxRQUFtQixFQUNuRSxpQkFBb0M7UUFGNUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ2xFLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQTdEaEQsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQXFDQSxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3QixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFJOUMsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUVmLGFBQVEsR0FBRyxD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aUI7QUFDaEI7SUFBUixLQUFLLEVBQUU7a0VBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFO21FQUF5QjtBQUN4QjtJQUFSLEtBQUssRUFBRTs0REFBbUI7QUFDbEI7SUFBUixLQUFLLEVBQUU7Z0VBQXNCO0FBQ3JCO0lBQVIsS0FBSyxFQUFFOzJEQUFpQjtBQUVmO0lBQVQsTUFBTSxFQUFFOzBEQUE2QjtBQUM1QjtJQUFULE1BQU0sRUFBRTsyREFBOEI7QUFDN0I7SUFBVCxNQUFNLEVBQUU7a0VBQTZDO0FBRTNCO0lBQTFCLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0VBQTBCO0FBbUN4QjtJQUEzQixZQUFZLENBQUMsWUFBWSxDQUFDOzhEQUkxQjtBQUUyQjtJQUEzQixZQUFZLENBQUMsWUFBWSxDQUFDOzhEQUkxQjtBQWpHVSwwQkFBMEI7SUFMdEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQiwyM0ZBQW1EOztLQUVwRCxDQUFDO0dBQ1csMEJBQTBCLENBcWJ0QztTQXJiWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFNpbXBsZUNoYW5nZXMsIEhvc3RMaXN0ZW5lciwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTYWZlUmVzb3VyY2VVcmwsIFNhZmVVcmwsIERvbVNhbml0aXplciwgU2FmZVN0eWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QWN0aW9uIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktYWN0aW9uLm1vZGVsJztcbmltcG9ydCB7IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1wcmV2aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1nYWxsZXJ5LXByZXZpZXcuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgc3JjOiBTYWZlVXJsO1xuICBzcmNJbmRleDogbnVtYmVyO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBzaG93U3Bpbm5lciA9IGZhbHNlO1xuICBwb3NpdGlvbkxlZnQgPSAwO1xuICBwb3NpdGlvblRvcCA9IDA7XG4gIHpvb21WYWx1ZSA9IDE7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgcm90YXRlVmFsdWUgPSAwO1xuICBpbmRleCA9IDA7XG5cbiAgQElucHV0KCkgaW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xuICBASW5wdXQoKSBkZXNjcmlwdGlvbnM6IHN0cmluZ1tdO1xuICBASW5wdXQoKSBzaG93RGVzY3JpcHRpb246IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFycm93czogYm9vbGVhbjtcbiAgQElucHV0KCkgYXJyb3dzQXV0b0hpZGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHN3aXBlOiBib29sZWFuO1xuICBASW5wdXQoKSBmdWxsc2NyZWVuOiBib29sZWFuO1xuICBASW5wdXQoKSBmb3JjZUZ1bGxzY3JlZW46IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsb3NlT25DbGljazogYm9vbGVhbjtcbiAgQElucHV0KCkgY2xvc2VPbkVzYzogYm9vbGVhbjtcbiAgQElucHV0KCkga2V5Ym9hcmROYXZpZ2F0aW9uOiBib29sZWFuO1xuICBASW5wdXQoKSBhcnJvd1ByZXZJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGFycm93TmV4dEljb246IHN0cmluZztcbiAgQElucHV0KCkgY2xvc2VJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGZ1bGxzY3JlZW5JY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNwaW5uZXJJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGF1dG9QbGF5OiBib29sZWFuO1xuICBASW5wdXQoKSBhdXRvUGxheUludGVydmFsOiBudW1iZXI7XG4gIEBJbnB1dCgpIGF1dG9QbGF5UGF1c2VPbkhvdmVyOiBib29sZWFuO1xuICBASW5wdXQoKSBpbmZpbml0eU1vdmU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHpvb206IGJvb2xlYW47XG4gIEBJbnB1dCgpIHpvb21TdGVwOiBudW1iZXI7XG4gIEBJbnB1dCgpIHpvb21NYXg6IG51bWJlcjtcbiAgQElucHV0KCkgem9vbU1pbjogbnVtYmVyO1xuICBASW5wdXQoKSB6b29tSW5JY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHpvb21PdXRJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgYWN0aW9uczogTmd4R2FsbGVyeUFjdGlvbltdO1xuICBASW5wdXQoKSByb3RhdGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHJvdGF0ZUxlZnRJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHJvdGF0ZVJpZ2h0SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBkb3dubG9hZDogYm9vbGVhbjtcbiAgQElucHV0KCkgZG93bmxvYWRJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJ1bGxldHM6IHN0cmluZztcblxuICBAT3V0cHV0KCkgb25PcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25DbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uQWN0aXZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgQFZpZXdDaGlsZCgncHJldmlld0ltYWdlJykgcHJldmlld0ltYWdlOiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgaXNPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgdGltZXI7XG4gIHByaXZhdGUgaW5pdGlhbFggPSAwO1xuICBwcml2YXRlIGluaXRpYWxZID0gMDtcbiAgcHJpdmF0ZSBpbml0aWFsTGVmdCA9IDA7XG4gIHByaXZhdGUgaW5pdGlhbFRvcCA9IDA7XG4gIHByaXZhdGUgaXNNb3ZlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBrZXlEb3duTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemF0aW9uOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIHByaXZhdGUgaGVscGVyU2VydmljZTogTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuYXJyb3dzICYmIHRoaXMuYXJyb3dzQXV0b0hpZGUpIHtcbiAgICAgICAgICB0aGlzLmFycm93cyA9IGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgaWYgKGNoYW5nZXNbJ3N3aXBlJ10pIHtcbiAgICAgICAgICB0aGlzLmhlbHBlclNlcnZpY2UubWFuYWdlU3dpcGUodGhpcy5zd2lwZSwgdGhpcy5lbGVtZW50UmVmLFxuICAgICAgICAgICdwcmV2aWV3JywgKCkgPT4gdGhpcy5zaG93TmV4dCgpLCAoKSA9PiB0aGlzLnNob3dQcmV2KCkpO1xuICAgICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICBpZiAodGhpcy5rZXlEb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICB0aGlzLmtleURvd25MaXN0ZW5lcigpO1xuICAgICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpIG9uTW91c2VFbnRlcigpIHtcbiAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmICF0aGlzLmFycm93cykge1xuICAgICAgICAgIHRoaXMuYXJyb3dzID0gdHJ1ZTtcbiAgICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKSBvbk1vdXNlTGVhdmUoKSB7XG4gICAgICBpZiAodGhpcy5hcnJvd3NBdXRvSGlkZSAmJiB0aGlzLmFycm93cykge1xuICAgICAgICAgIHRoaXMuYXJyb3dzID0gZmFsc2U7XG4gICAgICB9XG4gIH1cblxuICBvbktleURvd24oZSkge1xuICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmROYXZpZ2F0aW9uKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmlzS2V5Ym9hcmRQcmV2KGUpKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnNob3dQcmV2KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0tleWJvYXJkTmV4dChlKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmNsb3NlT25Fc2MgJiYgdGhpcy5pc0tleWJvYXJkRXNjKGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICBvcGVuKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMub25PcGVuLmVtaXQoKTtcblxuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgICAgdGhpcy5zaG93KHRydWUpO1xuXG4gICAgICBpZiAodGhpcy5mb3JjZUZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICB0aGlzLm1hbmFnZUZ1bGxzY3JlZW4oKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5rZXlEb3duTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcIndpbmRvd1wiLCBcImtleWRvd25cIiwgKGUpID0+IHRoaXMub25LZXlEb3duKGUpKTtcbiAgfVxuXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuY2xvc2VGdWxsc2NyZWVuKCk7XG4gICAgICB0aGlzLm9uQ2xvc2UuZW1pdCgpO1xuXG4gICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuXG4gICAgICBpZiAodGhpcy5rZXlEb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICB0aGlzLmtleURvd25MaXN0ZW5lcigpO1xuICAgICAgfVxuICB9XG5cbiAgaW1hZ2VNb3VzZUVudGVyKCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgIHRoaXMuc3RvcEF1dG9QbGF5KCk7XG4gICAgICB9XG4gIH1cblxuICBpbWFnZU1vdXNlTGVhdmUoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5hdXRvUGxheSAmJiB0aGlzLmF1dG9QbGF5UGF1c2VPbkhvdmVyKSB7XG4gICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICB9XG4gIH1cblxuICBzdGFydEF1dG9QbGF5KCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuYXV0b1BsYXkpIHtcbiAgICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuXG4gICAgICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hvd05leHQoKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcy5hdXRvUGxheUludGVydmFsKTtcbiAgICAgIH1cbiAgfVxuXG4gIHN0b3BBdXRvUGxheSgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgICAgfVxuICB9XG5cbiAgc2hvd0F0SW5kZXgoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICBzaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmNhblNob3dOZXh0KCkpIHtcbiAgICAgICAgICB0aGlzLmluZGV4Kys7XG5cbiAgICAgICAgICBpZiAodGhpcy5pbmRleCA9PT0gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gIH1cblxuICBzaG93UHJldigpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmNhblNob3dQcmV2KCkpIHtcbiAgICAgICAgICB0aGlzLmluZGV4LS07XG5cbiAgICAgICAgICBpZiAodGhpcy5pbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gIH1cblxuICBjYW5TaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5maW5pdHlNb3ZlIHx8IHRoaXMuaW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gIH1cblxuICBjYW5TaG93UHJldigpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5maW5pdHlNb3ZlIHx8IHRoaXMuaW5kZXggPiAwID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gIH1cblxuICBtYW5hZ2VGdWxsc2NyZWVuKCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuZnVsbHNjcmVlbiB8fCB0aGlzLmZvcmNlRnVsbHNjcmVlbikge1xuICAgICAgICAgIGNvbnN0IGRvYyA9IDxhbnk+ZG9jdW1lbnQ7XG5cbiAgICAgICAgICBpZiAoIWRvYy5mdWxsc2NyZWVuRWxlbWVudCAmJiAhZG9jLm1vekZ1bGxTY3JlZW5FbGVtZW50XG4gICAgICAgICAgICAgICYmICFkb2Mud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgJiYgIWRvYy5tc0Z1bGxzY3JlZW5FbGVtZW50KSB7XG4gICAgICAgICAgICAgIHRoaXMub3BlbkZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmNsb3NlRnVsbHNjcmVlbigpO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG4gIGdldFNhZmVVcmwoaW1hZ2U6IHN0cmluZyk6IFNhZmVVcmwge1xuICAgICAgcmV0dXJuIGltYWdlLnN1YnN0cigwLCAxMCkgPT09ICdkYXRhOmltYWdlJyA/XG4gICAgICAgICAgaW1hZ2UgOiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0VXJsKGltYWdlKTtcbiAgfVxuXG4gIHpvb21JbigpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmNhblpvb21JbigpKSB7XG4gICAgICAgICAgdGhpcy56b29tVmFsdWUgKz0gdGhpcy56b29tU3RlcDtcblxuICAgICAgICAgIGlmICh0aGlzLnpvb21WYWx1ZSA+IHRoaXMuem9vbU1heCkge1xuICAgICAgICAgICAgICB0aGlzLnpvb21WYWx1ZSA9IHRoaXMuem9vbU1heDtcbiAgICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICB6b29tT3V0KCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuY2FuWm9vbU91dCgpKSB7XG4gICAgICAgICAgdGhpcy56b29tVmFsdWUgLT0gdGhpcy56b29tU3RlcDtcblxuICAgICAgICAgIGlmICh0aGlzLnpvb21WYWx1ZSA8IHRoaXMuem9vbU1pbikge1xuICAgICAgICAgICAgICB0aGlzLnpvb21WYWx1ZSA9IHRoaXMuem9vbU1pbjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy56b29tVmFsdWUgPD0gMSkge1xuICAgICAgICAgICAgICB0aGlzLnJlc2V0UG9zaXRpb24oKVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG4gIHJvdGF0ZUxlZnQoKTogdm9pZCB7XG4gICAgICB0aGlzLnJvdGF0ZVZhbHVlIC09IDkwO1xuICB9XG5cbiAgcm90YXRlUmlnaHQoKTogdm9pZCB7XG4gICAgICB0aGlzLnJvdGF0ZVZhbHVlICs9IDkwO1xuICB9XG5cbiAgZ2V0VHJhbnNmb3JtKCk6IFNhZmVTdHlsZSB7XG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKCdzY2FsZSgnICsgdGhpcy56b29tVmFsdWUgKyAnKSByb3RhdGUoJyArIHRoaXMucm90YXRlVmFsdWUgKyAnZGVnKScpO1xuICB9XG5cbiAgY2FuWm9vbUluKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuem9vbVZhbHVlIDwgdGhpcy56b29tTWF4ID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG5cbiAgY2FuWm9vbU91dCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnpvb21WYWx1ZSA+IHRoaXMuem9vbU1pbiA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIGNhbkRyYWdPblpvb20oKSB7XG4gICAgICByZXR1cm4gdGhpcy56b29tICYmIHRoaXMuem9vbVZhbHVlID4gMTtcbiAgfVxuXG4gIG1vdXNlRG93bkhhbmRsZXIoZSk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuY2FuRHJhZ09uWm9vbSgpKSB7XG4gICAgICAgICAgdGhpcy5pbml0aWFsWCA9IHRoaXMuZ2V0Q2xpZW50WChlKTtcbiAgICAgICAgICB0aGlzLmluaXRpYWxZID0gdGhpcy5nZXRDbGllbnRZKGUpO1xuICAgICAgICAgIHRoaXMuaW5pdGlhbExlZnQgPSB0aGlzLnBvc2l0aW9uTGVmdDtcbiAgICAgICAgICB0aGlzLmluaXRpYWxUb3AgPSB0aGlzLnBvc2l0aW9uVG9wO1xuICAgICAgICAgIHRoaXMuaXNNb3ZlID0gdHJ1ZTtcblxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgfVxuXG4gIG1vdXNlVXBIYW5kbGVyKGUpOiB2b2lkIHtcbiAgICAgIHRoaXMuaXNNb3ZlID0gZmFsc2U7XG4gIH1cblxuICBtb3VzZU1vdmVIYW5kbGVyKGUpIHtcbiAgICAgIGlmICh0aGlzLmlzTW92ZSkge1xuICAgICAgICAgIHRoaXMucG9zaXRpb25MZWZ0ID0gdGhpcy5pbml0aWFsTGVmdCArICh0aGlzLmdldENsaWVudFgoZSkgLSB0aGlzLmluaXRpYWxYKTtcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9wID0gdGhpcy5pbml0aWFsVG9wICsgKHRoaXMuZ2V0Q2xpZW50WShlKSAtIHRoaXMuaW5pdGlhbFkpO1xuICAgICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDbGllbnRYKGUpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID8gZS50b3VjaGVzWzBdLmNsaWVudFggOiBlLmNsaWVudFg7XG4gIH1cblxuICBwcml2YXRlIGdldENsaWVudFkoZSk6IG51bWJlciB7XG4gICAgICByZXR1cm4gZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPyBlLnRvdWNoZXNbMF0uY2xpZW50WSA6IGUuY2xpZW50WTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRQb3NpdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnpvb20pIHtcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uTGVmdCA9IDA7XG4gICAgICAgICAgdGhpcy5wb3NpdGlvblRvcCA9IDA7XG4gICAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzS2V5Ym9hcmROZXh0KGUpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5ID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0tleWJvYXJkUHJldihlKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzNyA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNLZXlib2FyZEVzYyhlKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gZS5rZXlDb2RlID09PSAyNyA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgb3BlbkZ1bGxzY3JlZW4oKTogdm9pZCB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gPGFueT5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgIGlmIChlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2xvc2VGdWxsc2NyZWVuKCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgICAgICBjb25zdCBkb2MgPSA8YW55PmRvY3VtZW50O1xuXG4gICAgICAgICAgaWYgKGRvYy5leGl0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICBkb2MuZXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRvYy5tc0V4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgIGRvYy5tc0V4aXRGdWxsc2NyZWVuKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkb2MubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICBkb2MubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLndlYmtpdEV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgIGRvYy53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNGdWxsc2NyZWVuKCkge1xuICAgICAgY29uc3QgZG9jID0gPGFueT5kb2N1bWVudDtcblxuICAgICAgcmV0dXJuIGRvYy5mdWxsc2NyZWVuRWxlbWVudCB8fCBkb2Mud2Via2l0RnVsbHNjcmVlbkVsZW1lbnRcbiAgICAgICAgICB8fCBkb2MubW96RnVsbFNjcmVlbkVsZW1lbnQgfHwgZG9jLm1zRnVsbHNjcmVlbkVsZW1lbnQ7XG4gIH1cblxuXG5cbiAgcHJpdmF0ZSBzaG93KGZpcnN0ID0gZmFsc2UpIHtcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuXG4gICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlLmVtaXQodGhpcy5pbmRleCk7XG5cbiAgICAgIGlmIChmaXJzdCB8fCAhdGhpcy5hbmltYXRpb24pIHtcbiAgICAgICAgICB0aGlzLl9zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fc2hvdygpLCA2MDApO1xuICAgICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2hvdygpIHtcbiAgICAgIHRoaXMuem9vbVZhbHVlID0gMTtcbiAgICAgIHRoaXMucm90YXRlVmFsdWUgPSAwO1xuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG5cbiAgICAgIHRoaXMuc3JjID0gdGhpcy5nZXRTYWZlVXJsKDxzdHJpbmc+dGhpcy5pbWFnZXNbdGhpcy5pbmRleF0pO1xuICAgICAgdGhpcy5zcmNJbmRleCA9IHRoaXMuaW5kZXg7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbnNbdGhpcy5pbmRleF07XG4gICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCh0aGlzLnByZXZpZXdJbWFnZS5uYXRpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93U3Bpbm5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICB0aGlzLnByZXZpZXdJbWFnZS5uYXRpdmVFbGVtZW50Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zaG93U3Bpbm5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3SW1hZ2UubmF0aXZlRWxlbWVudC5vbmxvYWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgaXNMb2FkZWQoaW1nKTogYm9vbGVhbiB7XG4gICAgICBpZiAoIWltZy5jb21wbGV0ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpbWcubmF0dXJhbFdpZHRoICE9PSAndW5kZWZpbmVkJyAmJiBpbWcubmF0dXJhbFdpZHRoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG59Il19