import { __decorate } from "tslib";
import { Component, EventEmitter, Output, ViewChild, HostBinding, HostListener, Input } from '@angular/core';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryOptions } from './ngx-gallery-options';
import { NgxGalleryOrderedImage } from './ngx-gallery-ordered-image.model';
import { NgxGalleryPreviewComponent } from './ngx-gallery-preview/ngx-gallery-preview.component';
import { NgxGalleryImageComponent } from './ngx-gallery-image/ngx-gallery-image.component';
import { NgxGalleryThumbnailsComponent } from './ngx-gallery-thumbnails/ngx-gallery-thumbnails.component';
import { NgxGalleryLayout } from './ngx-gallery-layout.model';
let NgxGalleryComponent = class NgxGalleryComponent {
    constructor(myElement) {
        this.myElement = myElement;
        this.imagesReady = new EventEmitter();
        this.change = new EventEmitter();
        this.previewOpen = new EventEmitter();
        this.previewClose = new EventEmitter();
        this.previewChange = new EventEmitter();
        this.oldImagesLength = 0;
        this.selectedIndex = 0;
        this.breakpoint = undefined;
        this.prevBreakpoint = undefined;
    }
    ngOnInit() {
        this.options = this.options.map((opt) => new NgxGalleryOptions(opt));
        this.sortOptions();
        this.setBreakpoint();
        this.setOptions();
        this.checkFullWidth();
        if (this.currentOptions) {
            this.selectedIndex = this.currentOptions.startIndex;
        }
    }
    ngDoCheck() {
        if (this.images !== undefined && (this.images.length !== this.oldImagesLength)
            || (this.images !== this.oldImages)) {
            this.oldImagesLength = this.images.length;
            this.oldImages = this.images;
            this.setOptions();
            this.setImages();
            if (this.images && this.images.length) {
                this.imagesReady.emit();
            }
            if (this.image) {
                this.image.reset(this.currentOptions.startIndex);
            }
            if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails
                && this.images.length <= 1) {
                this.currentOptions.thumbnails = false;
                this.currentOptions.imageArrows = false;
            }
            this.resetThumbnails();
        }
    }
    ngAfterViewInit() {
        this.checkFullWidth();
    }
    onResize() {
        this.setBreakpoint();
        if (this.prevBreakpoint !== this.breakpoint) {
            this.setOptions();
            this.resetThumbnails();
        }
        if (this.currentOptions && this.currentOptions.fullWidth) {
            if (this.fullWidthTimeout) {
                clearTimeout(this.fullWidthTimeout);
            }
            this.fullWidthTimeout = setTimeout(() => {
                this.checkFullWidth();
            }, 200);
        }
    }
    getImageHeight() {
        return (this.currentOptions && this.currentOptions.thumbnails) ?
            this.currentOptions.imagePercent + '%' : '100%';
    }
    getThumbnailsHeight() {
        if (this.currentOptions && this.currentOptions.image) {
            return 'calc(' + this.currentOptions.thumbnailsPercent + '% - '
                + this.currentOptions.thumbnailsMargin + 'px)';
        }
        else {
            return '100%';
        }
    }
    getThumbnailsMarginTop() {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsBottom) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    }
    getThumbnailsMarginBottom() {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsTop) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    }
    openPreview(index) {
        if (this.currentOptions.previewCustom) {
            this.currentOptions.previewCustom(index);
        }
        else {
            this.previewEnabled = true;
            this.preview.open(index);
        }
    }
    onPreviewOpen() {
        this.previewOpen.emit();
        if (this.image && this.image.autoPlay) {
            this.image.stopAutoPlay();
        }
    }
    onPreviewClose() {
        this.previewEnabled = false;
        this.previewClose.emit();
        if (this.image && this.image.autoPlay) {
            this.image.startAutoPlay();
        }
    }
    selectFromImage(index) {
        this.select(index);
    }
    selectFromThumbnails(index) {
        this.select(index);
        if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
            && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
            this.openPreview(this.selectedIndex);
        }
    }
    show(index) {
        this.select(index);
    }
    showNext() {
        this.image.showNext();
    }
    showPrev() {
        this.image.showPrev();
    }
    canShowNext() {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
                ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
        }
        else {
            return false;
        }
    }
    previewSelect(index) {
        this.previewChange.emit({ index, image: this.images[index] });
    }
    moveThumbnailsRight() {
        this.thubmnails.moveRight();
    }
    moveThumbnailsLeft() {
        this.thubmnails.moveLeft();
    }
    canMoveThumbnailsRight() {
        return this.thubmnails.canMoveRight();
    }
    canMoveThumbnailsLeft() {
        return this.thubmnails.canMoveLeft();
    }
    resetThumbnails() {
        if (this.thubmnails) {
            this.thubmnails.reset(this.currentOptions.startIndex);
        }
    }
    select(index) {
        this.selectedIndex = index;
        this.change.emit({
            index,
            image: this.images[index]
        });
    }
    checkFullWidth() {
        if (this.currentOptions && this.currentOptions.fullWidth) {
            this.width = document.body.clientWidth + 'px';
            this.left = (-(document.body.clientWidth -
                this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
        }
    }
    setImages() {
        this.smallImages = this.images.map((img) => img.small);
        this.mediumImages = this.images.map((img, i) => new NgxGalleryOrderedImage({
            src: img.medium,
            index: i
        }));
        this.bigImages = this.images.map((img) => img.big);
        this.descriptions = this.images.map((img) => img.description);
        this.links = this.images.map((img) => img.url);
        this.labels = this.images.map((img) => img.label);
    }
    setBreakpoint() {
        this.prevBreakpoint = this.breakpoint;
        let breakpoints;
        if (typeof window !== 'undefined') {
            breakpoints = this.options.filter((opt) => opt.breakpoint >= window.innerWidth)
                .map((opt) => opt.breakpoint);
        }
        if (breakpoints && breakpoints.length) {
            this.breakpoint = breakpoints.pop();
        }
        else {
            this.breakpoint = undefined;
        }
    }
    sortOptions() {
        this.options = [
            ...this.options.filter((a) => a.breakpoint === undefined),
            ...this.options
                .filter((a) => a.breakpoint !== undefined)
                .sort((a, b) => b.breakpoint - a.breakpoint)
        ];
    }
    setOptions() {
        this.currentOptions = new NgxGalleryOptions({});
        this.options
            .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
            .map((opt) => this.combineOptions(this.currentOptions, opt));
        this.width = this.currentOptions.width;
        this.height = this.currentOptions.height;
    }
    combineOptions(first, second) {
        Object.keys(second).map((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
    }
};
__decorate([
    Input()
], NgxGalleryComponent.prototype, "options", void 0);
__decorate([
    Input()
], NgxGalleryComponent.prototype, "images", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "imagesReady", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "change", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "previewOpen", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "previewClose", void 0);
__decorate([
    Output()
], NgxGalleryComponent.prototype, "previewChange", void 0);
__decorate([
    ViewChild(NgxGalleryPreviewComponent)
], NgxGalleryComponent.prototype, "preview", void 0);
__decorate([
    ViewChild(NgxGalleryImageComponent)
], NgxGalleryComponent.prototype, "image", void 0);
__decorate([
    ViewChild(NgxGalleryThumbnailsComponent)
], NgxGalleryComponent.prototype, "thubmnails", void 0);
__decorate([
    HostBinding('style.width')
], NgxGalleryComponent.prototype, "width", void 0);
__decorate([
    HostBinding('style.height')
], NgxGalleryComponent.prototype, "height", void 0);
__decorate([
    HostBinding('style.left')
], NgxGalleryComponent.prototype, "left", void 0);
__decorate([
    HostListener('window:resize')
], NgxGalleryComponent.prototype, "onResize", null);
NgxGalleryComponent = __decorate([
    Component({
        selector: 'ngx-gallery',
        template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" [style.height]="getImageHeight()" [images]="mediumImages" [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex" [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove"  [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

      <ngx-gallery-thumbnails *ngIf="currentOptions?.thumbnails" [style.marginTop]="getThumbnailsMarginTop()" [style.marginBottom]="getThumbnailsMarginBottom()" [style.height]="getThumbnailsHeight()" [images]="smallImages" [links]="currentOptions?.thumbnailsAsLinks ? links : []" [labels]="labels" [linkTarget]="currentOptions?.linkTarget" [selectedIndex]="selectedIndex" [columns]="currentOptions?.thumbnailsColumns" [rows]="currentOptions?.thumbnailsRows" [margin]="currentOptions?.thumbnailMargin" [arrows]="currentOptions?.thumbnailsArrows" [arrowsAutoHide]="currentOptions?.thumbnailsArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [clickable]="currentOptions?.image || currentOptions?.preview" [swipe]="currentOptions?.thumbnailsSwipe" [size]="currentOptions?.thumbnailSize" [moveSize]="currentOptions?.thumbnailsMoveSize" [order]="currentOptions?.thumbnailsOrder" [remainingCount]="currentOptions?.thumbnailsRemainingCount" [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.thumbnailActions"  (onActiveChange)="selectFromThumbnails($event)"></ngx-gallery-thumbnails>

      <ngx-gallery-preview [images]="bigImages" [descriptions]="descriptions" [showDescription]="currentOptions?.previewDescription" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [closeIcon]="currentOptions?.closeIcon" [fullscreenIcon]="currentOptions?.fullscreenIcon" [spinnerIcon]="currentOptions?.spinnerIcon" [arrows]="currentOptions?.previewArrows" [arrowsAutoHide]="currentOptions?.previewArrowsAutoHide" [swipe]="currentOptions?.previewSwipe" [fullscreen]="currentOptions?.previewFullscreen" [forceFullscreen]="currentOptions?.previewForceFullscreen" [closeOnClick]="currentOptions?.previewCloseOnClick" [closeOnEsc]="currentOptions?.previewCloseOnEsc" [keyboardNavigation]="currentOptions?.previewKeyboardNavigation" [animation]="currentOptions?.previewAnimation" [autoPlay]="currentOptions?.previewAutoPlay" [autoPlayInterval]="currentOptions?.previewAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.previewAutoPlayPauseOnHover" [infinityMove]="currentOptions?.previewInfinityMove" [zoom]="currentOptions?.previewZoom" [zoomStep]="currentOptions?.previewZoomStep" [zoomMax]="currentOptions?.previewZoomMax" [zoomMin]="currentOptions?.previewZoomMin" [zoomInIcon]="currentOptions?.zoomInIcon" [zoomOutIcon]="currentOptions?.zoomOutIcon" [actions]="currentOptions?.actions" [rotate]="currentOptions?.previewRotate" [rotateLeftIcon]="currentOptions?.rotateLeftIcon" [rotateRightIcon]="currentOptions?.rotateRightIcon" [download]="currentOptions?.previewDownload" [downloadIcon]="currentOptions?.downloadIcon" [bullets]="currentOptions?.previewBullets" (onClose)="onPreviewClose()" (onOpen)="onPreviewOpen()" (onActiveChange)="previewSelect($event)" [class.ngx-gallery-active]="previewEnabled"></ngx-gallery-preview>
    </div>
  `,
        providers: [NgxGalleryHelperService],
        styles: [":host{display:inline-block}:host>*{box-sizing:border-box;float:left}:host>.ngx-gallery-icon{color:#fff;display:inline-block;font-size:25px;position:absolute;z-index:2000}:host>.ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host>.ngx-gallery-clickable{cursor:pointer}:host>.ngx-gallery-icons-wrapper .ngx-gallery-icon{cursor:pointer;font-size:20px;margin-right:5px;margin-top:5px;position:relative}:host>.ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{-webkit-box-direction:normal;-webkit-box-orient:vertical;display:-webkit-box;display:flex;flex-direction:column;height:100%;width:100%}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{-webkit-box-ordinal-group:3;order:2}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image,:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{-webkit-box-ordinal-group:2;order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{-webkit-box-ordinal-group:3;order:2}"]
    })
], NgxGalleryComponent);
export { NgxGalleryComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9ncmVnb3J5bWFjZS9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS05L3Byb2plY3RzL25neC1nYWxsZXJ5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWtDLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpKLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRzFELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBZ0I5RCxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtJQXFDOUIsWUFBb0IsU0FBcUI7UUFBckIsY0FBUyxHQUFULFNBQVMsQ0FBWTtRQWpDL0IsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBOEMsQ0FBQztRQUN4RSxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQThDLENBQUM7UUFVekYsb0JBQWUsR0FBRyxD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Q0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7Q0FDRixDQUFBO0FBblNVO0lBQVIsS0FBSyxFQUFFO29EQUE4QjtBQUM3QjtJQUFSLEtBQUssRUFBRTttREFBMkI7QUFFekI7SUFBVCxNQUFNLEVBQUU7d0RBQWtDO0FBQ2pDO0lBQVQsTUFBTSxFQUFFO21EQUF5RTtBQUN4RTtJQUFULE1BQU0sRUFBRTt3REFBa0M7QUFDakM7SUFBVCxNQUFNLEVBQUU7eURBQW1DO0FBQ2xDO0lBQVQsTUFBTSxFQUFFOzBEQUFnRjtBQXFCbEQ7SUFBdEMsU0FBUyxDQUFDLDBCQUEwQixDQUFDO29EQUFxQztBQUN0QztJQUFwQyxTQUFTLENBQUMsd0JBQXdCLENBQUM7a0RBQWlDO0FBQzNCO0lBQXpDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQzt1REFBMkM7QUFFeEQ7SUFBM0IsV0FBVyxDQUFDLGFBQWEsQ0FBQztrREFBZTtBQUNiO0lBQTVCLFdBQVcsQ0FBQyxjQUFjLENBQUM7bURBQWdCO0FBQ2pCO0lBQTFCLFdBQVcsQ0FBQyxZQUFZLENBQUM7aURBQWM7QUE2Q1Q7SUFBOUIsWUFBWSxDQUFDLGVBQWUsQ0FBQzttREFrQjdCO0FBbEdVLG1CQUFtQjtJQWQvQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsYUFBYTtRQUN2QixRQUFRLEVBQUU7Ozs7Ozs7O0dBUVQ7UUFFRCxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQzs7S0FDckMsQ0FBQztHQUNXLG1CQUFtQixDQW9TL0I7U0FwU1ksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQsIEV2ZW50RW1pdHRlciwgT3V0cHV0LCBWaWV3Q2hpbGQsIEhvc3RCaW5kaW5nLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTYWZlUmVzb3VyY2VVcmwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5T3B0aW9ucyB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3B0aW9ucyc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2VTaXplIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS1zaXplLm1vZGVsJztcbmltcG9ydCB7IE5neEdhbGxlcnlJbWFnZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2UubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3JkZXJlZC1pbWFnZS5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5UHJldmlld0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktcHJldmlldy9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2VDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlL25neC1nYWxsZXJ5LWltYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5TGF5b3V0IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1sYXlvdXQubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWxheW91dCB7e2N1cnJlbnRPcHRpb25zPy5sYXlvdXR9fVwiPlxuICAgICAgPG5neC1nYWxsZXJ5LWltYWdlICpuZ0lmPVwiY3VycmVudE9wdGlvbnM/LmltYWdlXCIgW3N0eWxlLmhlaWdodF09XCJnZXRJbWFnZUhlaWdodCgpXCIgW2ltYWdlc109XCJtZWRpdW1JbWFnZXNcIiBbY2xpY2thYmxlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3XCIgW3NlbGVjdGVkSW5kZXhdPVwic2VsZWN0ZWRJbmRleFwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXJyb3dzXCIgW2Fycm93c0F1dG9IaWRlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFycm93c0F1dG9IaWRlXCIgW2Fycm93UHJldkljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93UHJldkljb25cIiBbYXJyb3dOZXh0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dOZXh0SWNvblwiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VTd2lwZVwiIFthbmltYXRpb25dPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQW5pbWF0aW9uXCIgW3NpemVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlU2l6ZVwiIFthdXRvUGxheV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBdXRvUGxheVwiIFthdXRvUGxheUludGVydmFsXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5SW50ZXJ2YWxcIiBbYXV0b1BsYXlQYXVzZU9uSG92ZXJdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXV0b1BsYXlQYXVzZU9uSG92ZXJcIiBbaW5maW5pdHlNb3ZlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUluZmluaXR5TW92ZVwiICBbbGF6eUxvYWRpbmddPVwiY3VycmVudE9wdGlvbnM/LmxhenlMb2FkaW5nXCIgW2FjdGlvbnNdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQWN0aW9uc1wiIFtkZXNjcmlwdGlvbnNdPVwiZGVzY3JpcHRpb25zXCIgW3Nob3dEZXNjcmlwdGlvbl09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VEZXNjcmlwdGlvblwiIFtidWxsZXRzXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUJ1bGxldHNcIiAob25DbGljayk9XCJvcGVuUHJldmlldygkZXZlbnQpXCIgKG9uQWN0aXZlQ2hhbmdlKT1cInNlbGVjdEZyb21JbWFnZSgkZXZlbnQpXCI+PC9uZ3gtZ2FsbGVyeS1pbWFnZT5cblxuICAgICAgPG5neC1nYWxsZXJ5LXRodW1ibmFpbHMgKm5nSWY9XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1wiIFtzdHlsZS5tYXJnaW5Ub3BdPVwiZ2V0VGh1bWJuYWlsc01hcmdpblRvcCgpXCIgW3N0eWxlLm1hcmdpbkJvdHRvbV09XCJnZXRUaHVtYm5haWxzTWFyZ2luQm90dG9tKClcIiBbc3R5bGUuaGVpZ2h0XT1cImdldFRodW1ibmFpbHNIZWlnaHQoKVwiIFtpbWFnZXNdPVwic21hbGxJbWFnZXNcIiBbbGlua3NdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBc0xpbmtzID8gbGlua3MgOiBbXVwiIFtsYWJlbHNdPVwibGFiZWxzXCIgW2xpbmtUYXJnZXRdPVwiY3VycmVudE9wdGlvbnM/LmxpbmtUYXJnZXRcIiBbc2VsZWN0ZWRJbmRleF09XCJzZWxlY3RlZEluZGV4XCIgW2NvbHVtbnNdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNDb2x1bW5zXCIgW3Jvd3NdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNSb3dzXCIgW21hcmdpbl09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsTWFyZ2luXCIgW2Fycm93c109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0Fycm93c1wiIFthcnJvd3NBdXRvSGlkZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0Fycm93c0F1dG9IaWRlXCIgW2Fycm93UHJldkljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93UHJldkljb25cIiBbYXJyb3dOZXh0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dOZXh0SWNvblwiIFtjbGlja2FibGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlIHx8IGN1cnJlbnRPcHRpb25zPy5wcmV2aWV3XCIgW3N3aXBlXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzU3dpcGVcIiBbc2l6ZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsU2l6ZVwiIFttb3ZlU2l6ZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc01vdmVTaXplXCIgW29yZGVyXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzT3JkZXJcIiBbcmVtYWluaW5nQ291bnRdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNSZW1haW5pbmdDb3VudFwiIFtsYXp5TG9hZGluZ109XCJjdXJyZW50T3B0aW9ucz8ubGF6eUxvYWRpbmdcIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsQWN0aW9uc1wiICAob25BY3RpdmVDaGFuZ2UpPVwic2VsZWN0RnJvbVRodW1ibmFpbHMoJGV2ZW50KVwiPjwvbmd4LWdhbGxlcnktdGh1bWJuYWlscz5cblxuICAgICAgPG5neC1nYWxsZXJ5LXByZXZpZXcgW2ltYWdlc109XCJiaWdJbWFnZXNcIiBbZGVzY3JpcHRpb25zXT1cImRlc2NyaXB0aW9uc1wiIFtzaG93RGVzY3JpcHRpb25dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdEZXNjcmlwdGlvblwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbY2xvc2VJY29uXT1cImN1cnJlbnRPcHRpb25zPy5jbG9zZUljb25cIiBbZnVsbHNjcmVlbkljb25dPVwiY3VycmVudE9wdGlvbnM/LmZ1bGxzY3JlZW5JY29uXCIgW3NwaW5uZXJJY29uXT1cImN1cnJlbnRPcHRpb25zPy5zcGlubmVySWNvblwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NBdXRvSGlkZVwiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1N3aXBlXCIgW2Z1bGxzY3JlZW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdGdWxsc2NyZWVuXCIgW2ZvcmNlRnVsbHNjcmVlbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0ZvcmNlRnVsbHNjcmVlblwiIFtjbG9zZU9uQ2xpY2tdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdDbG9zZU9uQ2xpY2tcIiBbY2xvc2VPbkVzY109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Nsb3NlT25Fc2NcIiBba2V5Ym9hcmROYXZpZ2F0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3S2V5Ym9hcmROYXZpZ2F0aW9uXCIgW2FuaW1hdGlvbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0FuaW1hdGlvblwiIFthdXRvUGxheV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0F1dG9QbGF5XCIgW2F1dG9QbGF5SW50ZXJ2YWxdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBdXRvUGxheUludGVydmFsXCIgW2F1dG9QbGF5UGF1c2VPbkhvdmVyXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXV0b1BsYXlQYXVzZU9uSG92ZXJcIiBbaW5maW5pdHlNb3ZlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3SW5maW5pdHlNb3ZlXCIgW3pvb21dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tXCIgW3pvb21TdGVwXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbVN0ZXBcIiBbem9vbU1heF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NYXhcIiBbem9vbU1pbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NaW5cIiBbem9vbUluSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbUluSWNvblwiIFt6b29tT3V0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbU91dEljb25cIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8uYWN0aW9uc1wiIFtyb3RhdGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdSb3RhdGVcIiBbcm90YXRlTGVmdEljb25dPVwiY3VycmVudE9wdGlvbnM/LnJvdGF0ZUxlZnRJY29uXCIgW3JvdGF0ZVJpZ2h0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8ucm90YXRlUmlnaHRJY29uXCIgW2Rvd25sb2FkXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RG93bmxvYWRcIiBbZG93bmxvYWRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5kb3dubG9hZEljb25cIiBbYnVsbGV0c109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0J1bGxldHNcIiAob25DbG9zZSk9XCJvblByZXZpZXdDbG9zZSgpXCIgKG9uT3Blbik9XCJvblByZXZpZXdPcGVuKClcIiAob25BY3RpdmVDaGFuZ2UpPVwicHJldmlld1NlbGVjdCgkZXZlbnQpXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWFjdGl2ZV09XCJwcmV2aWV3RW5hYmxlZFwiPjwvbmd4LWdhbGxlcnktcHJldmlldz5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnkuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbTmd4R2FsbGVyeUhlbHBlclNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBvcHRpb25zOiBOZ3hHYWxsZXJ5T3B0aW9uc1tdO1xuICBASW5wdXQoKSBpbWFnZXM6IE5neEdhbGxlcnlJbWFnZVtdO1xuXG4gIEBPdXRwdXQoKSBpbWFnZXNSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBpbmRleDogbnVtYmVyOyBpbWFnZTogTmd4R2FsbGVyeUltYWdlOyB9PigpO1xuICBAT3V0cHV0KCkgcHJldmlld09wZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwcmV2aWV3Q2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwcmV2aWV3Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx7IGluZGV4OiBudW1iZXI7IGltYWdlOiBOZ3hHYWxsZXJ5SW1hZ2U7IH0+KCk7XG5cbiAgc21hbGxJbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XG4gIG1lZGl1bUltYWdlczogTmd4R2FsbGVyeU9yZGVyZWRJbWFnZVtdO1xuICBiaWdJbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XG4gIGRlc2NyaXB0aW9uczogc3RyaW5nW107XG4gIGxpbmtzOiBzdHJpbmdbXTtcbiAgbGFiZWxzOiBzdHJpbmdbXTtcblxuICBvbGRJbWFnZXM6IE5neEdhbGxlcnlJbWFnZVtdO1xuICBvbGRJbWFnZXNMZW5ndGggPSAwO1xuXG4gIHNlbGVjdGVkSW5kZXggPSAwO1xuICBwcmV2aWV3RW5hYmxlZDogYm9vbGVhbjtcblxuICBjdXJyZW50T3B0aW9uczogTmd4R2FsbGVyeU9wdGlvbnM7XG5cbiAgcHJpdmF0ZSBicmVha3BvaW50OiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIHByaXZhdGUgcHJldkJyZWFrcG9pbnQ6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBmdWxsV2lkdGhUaW1lb3V0OiBhbnk7XG5cbiAgQFZpZXdDaGlsZChOZ3hHYWxsZXJ5UHJldmlld0NvbXBvbmVudCkgcHJldmlldzogTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50KSBpbWFnZTogTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50KSB0aHVibW5haWxzOiBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudDtcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLndpZHRoJykgd2lkdGg6IHN0cmluZztcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKSBoZWlnaHQ6IHN0cmluZztcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5sZWZ0JykgbGVmdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbXlFbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zLm1hcCgob3B0KSA9PiBuZXcgTmd4R2FsbGVyeU9wdGlvbnMob3B0KSk7XG4gICAgICB0aGlzLnNvcnRPcHRpb25zKCk7XG4gICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICAgICAgdGhpcy5jaGVja0Z1bGxXaWR0aCgpO1xuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSA8bnVtYmVyPnRoaXMuY3VycmVudE9wdGlvbnMuc3RhcnRJbmRleDtcbiAgICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmltYWdlcyAhPT0gdW5kZWZpbmVkICYmICh0aGlzLmltYWdlcy5sZW5ndGggIT09IHRoaXMub2xkSW1hZ2VzTGVuZ3RoKVxuICAgICAgICAgIHx8ICh0aGlzLmltYWdlcyAhPT0gdGhpcy5vbGRJbWFnZXMpKSB7XG4gICAgICAgICAgdGhpcy5vbGRJbWFnZXNMZW5ndGggPSB0aGlzLmltYWdlcy5sZW5ndGg7XG4gICAgICAgICAgdGhpcy5vbGRJbWFnZXMgPSB0aGlzLmltYWdlcztcbiAgICAgICAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICAgICAgICB0aGlzLnNldEltYWdlcygpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLmltYWdlc1JlYWR5LmVtaXQoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5pbWFnZSkge1xuICAgICAgICAgICAgICB0aGlzLmltYWdlLnJlc2V0KDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzQXV0b0hpZGUgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzXG4gICAgICAgICAgICAgICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlscyA9IGZhbHNlO1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlQXJyb3dzID0gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5yZXNldFRodW1ibmFpbHMoKTtcbiAgICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKSBvblJlc2l6ZSgpIHtcbiAgICAgIHRoaXMuc2V0QnJlYWtwb2ludCgpO1xuXG4gICAgICBpZiAodGhpcy5wcmV2QnJlYWtwb2ludCAhPT0gdGhpcy5icmVha3BvaW50KSB7XG4gICAgICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgICAgICAgdGhpcy5yZXNldFRodW1ibmFpbHMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5mdWxsV2lkdGgpIHtcblxuICAgICAgICAgIGlmICh0aGlzLmZ1bGxXaWR0aFRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZnVsbFdpZHRoVGltZW91dCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5mdWxsV2lkdGhUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcbiAgICAgICAgICB9LCAyMDApO1xuICAgICAgfVxuICB9XG5cbiAgZ2V0SW1hZ2VIZWlnaHQoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHMpID9cbiAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlUGVyY2VudCArICclJyA6ICcxMDAlJztcbiAgfVxuXG4gIGdldFRodW1ibmFpbHNIZWlnaHQoKTogc3RyaW5nIHtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2UpIHtcbiAgICAgICAgICByZXR1cm4gJ2NhbGMoJyArIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1BlcmNlbnQgKyAnJSAtICdcbiAgICAgICAgICArIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc01hcmdpbiArICdweCknO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJzEwMCUnO1xuICAgICAgfVxuICB9XG5cbiAgZ2V0VGh1bWJuYWlsc01hcmdpblRvcCgpOiBzdHJpbmcge1xuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5sYXlvdXQgPT09IE5neEdhbGxlcnlMYXlvdXQuVGh1bWJuYWlsc0JvdHRvbSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJzBweCc7XG4gICAgICB9XG4gIH1cblxuICBnZXRUaHVtYm5haWxzTWFyZ2luQm90dG9tKCk6IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmxheW91dCA9PT0gTmd4R2FsbGVyeUxheW91dC5UaHVtYm5haWxzVG9wKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc01hcmdpbiArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAnMHB4JztcbiAgICAgIH1cbiAgfVxuXG4gIG9wZW5QcmV2aWV3KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zLnByZXZpZXdDdXN0b20pIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLnByZXZpZXdDdXN0b20oaW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByZXZpZXdFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnByZXZpZXcub3BlbihpbmRleCk7XG4gICAgICB9XG4gIH1cblxuICBvblByZXZpZXdPcGVuKCk6IHZvaWQge1xuICAgICAgdGhpcy5wcmV2aWV3T3Blbi5lbWl0KCk7XG5cbiAgICAgIGlmICh0aGlzLmltYWdlICYmIHRoaXMuaW1hZ2UuYXV0b1BsYXkpIHtcbiAgICAgICAgICB0aGlzLmltYWdlLnN0b3BBdXRvUGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgb25QcmV2aWV3Q2xvc2UoKTogdm9pZCB7XG4gICAgICB0aGlzLnByZXZpZXdFbmFibGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnByZXZpZXdDbG9zZS5lbWl0KCk7XG5cbiAgICAgIGlmICh0aGlzLmltYWdlICYmIHRoaXMuaW1hZ2UuYXV0b1BsYXkpIHtcbiAgICAgICAgICB0aGlzLmltYWdlLnN0YXJ0QXV0b1BsYXkoKTtcbiAgICAgIH1cbiAgfVxuXG4gIHNlbGVjdEZyb21JbWFnZShpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLnNlbGVjdChpbmRleCk7XG4gIH1cblxuICBzZWxlY3RGcm9tVGh1bWJuYWlscyhpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLnNlbGVjdChpbmRleCk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlscyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLnByZXZpZXdcbiAgICAgICAgICAmJiAoIXRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2UgfHwgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzUmVtYWluaW5nQ291bnQpKSB7XG4gICAgICAgICAgdGhpcy5vcGVuUHJldmlldyh0aGlzLnNlbGVjdGVkSW5kZXgpO1xuICAgICAgfVxuICB9XG5cbiAgc2hvdyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLnNlbGVjdChpbmRleCk7XG4gIH1cblxuICBzaG93TmV4dCgpOiB2b2lkIHtcbiAgICAgIHRoaXMuaW1hZ2Uuc2hvd05leHQoKTtcbiAgfVxuXG4gIHNob3dQcmV2KCk6IHZvaWQge1xuICAgICAgdGhpcy5pbWFnZS5zaG93UHJldigpO1xuICB9XG5cbiAgY2FuU2hvd05leHQoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5pbWFnZXMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucykge1xuICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgY2FuU2hvd1ByZXYoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5pbWFnZXMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucykge1xuICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPiAwKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgcHJldmlld1NlbGVjdChpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLnByZXZpZXdDaGFuZ2UuZW1pdCh7aW5kZXgsIGltYWdlOiB0aGlzLmltYWdlc1tpbmRleF19KTtcbiAgfVxuXG4gIG1vdmVUaHVtYm5haWxzUmlnaHQoKSB7XG4gICAgICB0aGlzLnRodWJtbmFpbHMubW92ZVJpZ2h0KCk7XG4gIH1cblxuICBtb3ZlVGh1bWJuYWlsc0xlZnQoKSB7XG4gICAgICB0aGlzLnRodWJtbmFpbHMubW92ZUxlZnQoKTtcbiAgfVxuXG4gIGNhbk1vdmVUaHVtYm5haWxzUmlnaHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHVibW5haWxzLmNhbk1vdmVSaWdodCgpO1xuICB9XG5cbiAgY2FuTW92ZVRodW1ibmFpbHNMZWZ0KCkge1xuICAgICAgcmV0dXJuIHRoaXMudGh1Ym1uYWlscy5jYW5Nb3ZlTGVmdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNldFRodW1ibmFpbHMoKSB7XG4gICAgICBpZiAodGhpcy50aHVibW5haWxzKSB7XG4gICAgICAgICAgdGhpcy50aHVibW5haWxzLnJlc2V0KDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4KTtcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2VsZWN0KGluZGV4OiBudW1iZXIpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuXG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBpbWFnZTogdGhpcy5pbWFnZXNbaW5kZXhdXG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tGdWxsV2lkdGgoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmZ1bGxXaWR0aCkge1xuICAgICAgICAgIHRoaXMud2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgICB0aGlzLmxlZnQgPSAoLShkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC1cbiAgICAgICAgICAgICAgdGhpcy5teUVsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLmlubmVyV2lkdGgpIC8gMikgKyAncHgnO1xuICAgICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRJbWFnZXMoKTogdm9pZCB7XG4gICAgICB0aGlzLnNtYWxsSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLnNtYWxsKTtcbiAgICAgIHRoaXMubWVkaXVtSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcsIGkpID0+IG5ldyBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlKHtcbiAgICAgICAgICBzcmM6IGltZy5tZWRpdW0sXG4gICAgICAgICAgaW5kZXg6IGlcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMuYmlnSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLmJpZyk7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9ucyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5kZXNjcmlwdGlvbik7XG4gICAgICB0aGlzLmxpbmtzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLnVybCk7XG4gICAgICB0aGlzLmxhYmVscyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5sYWJlbCk7XG4gIH1cblxuICBwcml2YXRlIHNldEJyZWFrcG9pbnQoKTogdm9pZCB7XG4gICAgICB0aGlzLnByZXZCcmVha3BvaW50ID0gdGhpcy5icmVha3BvaW50O1xuICAgICAgbGV0IGJyZWFrcG9pbnRzO1xuXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBicmVha3BvaW50cyA9IHRoaXMub3B0aW9ucy5maWx0ZXIoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQgPj0gd2luZG93LmlubmVyV2lkdGgpXG4gICAgICAgICAgICAgIC5tYXAoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYnJlYWtwb2ludHMgJiYgYnJlYWtwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5icmVha3BvaW50ID0gYnJlYWtwb2ludHMucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc29ydE9wdGlvbnMoKTogdm9pZCB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBbXG4gICAgICAgICAgLi4udGhpcy5vcHRpb25zLmZpbHRlcigoYSkgPT4gYS5icmVha3BvaW50ID09PSB1bmRlZmluZWQpLFxuICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICAgICAgICAuZmlsdGVyKChhKSA9PiBhLmJyZWFrcG9pbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIuYnJlYWtwb2ludCAtIGEuYnJlYWtwb2ludClcbiAgICAgIF07XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMoKTogdm9pZCB7XG4gICAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gbmV3IE5neEdhbGxlcnlPcHRpb25zKHt9KTtcblxuICAgICAgdGhpcy5vcHRpb25zXG4gICAgICAgICAgLmZpbHRlcigob3B0KSA9PiBvcHQuYnJlYWtwb2ludCA9PT0gdW5kZWZpbmVkIHx8IG9wdC5icmVha3BvaW50ID49IHRoaXMuYnJlYWtwb2ludClcbiAgICAgICAgICAubWFwKChvcHQpID0+IHRoaXMuY29tYmluZU9wdGlvbnModGhpcy5jdXJyZW50T3B0aW9ucywgb3B0KSk7XG5cbiAgICAgIHRoaXMud2lkdGggPSA8c3RyaW5nPnRoaXMuY3VycmVudE9wdGlvbnMud2lkdGg7XG4gICAgICB0aGlzLmhlaWdodCA9IDxzdHJpbmc+dGhpcy5jdXJyZW50T3B0aW9ucy5oZWlnaHQ7XG4gIH1cblxuICBwcml2YXRlIGNvbWJpbmVPcHRpb25zKGZpcnN0OiBOZ3hHYWxsZXJ5T3B0aW9ucywgc2Vjb25kOiBOZ3hHYWxsZXJ5T3B0aW9ucykge1xuICAgICAgT2JqZWN0LmtleXMoc2Vjb25kKS5tYXAoKHZhbCkgPT4gZmlyc3RbdmFsXSA9IHNlY29uZFt2YWxdICE9PSB1bmRlZmluZWQgPyBzZWNvbmRbdmFsXSA6IGZpcnN0W3ZhbF0pO1xuICB9XG59XG4iXX0=