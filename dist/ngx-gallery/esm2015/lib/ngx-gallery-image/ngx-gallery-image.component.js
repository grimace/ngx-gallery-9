import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxGalleryAnimation } from '../ngx-gallery-animation.model';
let NgxGalleryImageComponent = class NgxGalleryImageComponent {
    constructor(sanitization, elementRef, helperService) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.timeout = 1000;
        this.onClick = new EventEmitter();
        this.onActiveChange = new EventEmitter();
        this.canChangeImage = true;
    }
    ngOnInit() {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }
    ngOnChanges(changes) {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }
    onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }
    onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }
    reset(index) {
        this.selectedIndex = index;
    }
    getImages() {
        if (!this.images) {
            return [];
        }
        if (this.lazyLoading) {
            let indexes = [this.selectedIndex];
            let prevIndex = this.selectedIndex - 1;
            if (prevIndex === -1 && this.infinityMove) {
                indexes.push(this.images.length - 1);
            }
            else if (prevIndex >= 0) {
                indexes.push(prevIndex);
            }
            let nextIndex = this.selectedIndex + 1;
            if (nextIndex == this.images.length && this.infinityMove) {
                indexes.push(0);
            }
            else if (nextIndex < this.images.length) {
                indexes.push(nextIndex);
            }
            return this.images.filter((img, i) => indexes.indexOf(i) != -1);
        }
        else {
            return this.images;
        }
    }
    startAutoPlay() {
        this.stopAutoPlay();
        this.timer = setInterval(() => {
            if (!this.showNext()) {
                this.selectedIndex = -1;
                this.showNext();
            }
        }, this.autoPlayInterval);
    }
    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    handleClick(event, index) {
        if (this.clickable) {
            this.onClick.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }
    show(index) {
        this.selectedIndex = index;
        this.onActiveChange.emit(this.selectedIndex);
        this.setChangeTimeout();
    }
    showNext() {
        if (this.canShowNext() && this.canChangeImage) {
            this.selectedIndex++;
            if (this.selectedIndex === this.images.length) {
                this.selectedIndex = 0;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
            return true;
        }
        else {
            return false;
        }
    }
    showPrev() {
        if (this.canShowPrev() && this.canChangeImage) {
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.images.length - 1;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
        }
    }
    setChangeTimeout() {
        this.canChangeImage = false;
        let timeout = this.timeout;
        if (this.animation === NgxGalleryAnimation.Slide
            || this.animation === NgxGalleryAnimation.Fade) {
            timeout = 500;
        }
        setTimeout(() => {
            this.canChangeImage = true;
        }, timeout);
    }
    canShowNext() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex < this.images.length - 1
                ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex > 0 ? true : false;
        }
        else {
            return false;
        }
    }
    getSafeUrl(image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
};
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "images", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "clickable", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "selectedIndex", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrows", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrowsAutoHide", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "swipe", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "animation", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "size", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrowPrevIcon", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "arrowNextIcon", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "autoPlay", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "autoPlayInterval", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "autoPlayPauseOnHover", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "infinityMove", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "lazyLoading", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "actions", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "descriptions", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "showDescription", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "bullets", void 0);
__decorate([
    Input()
], NgxGalleryImageComponent.prototype, "timeout", void 0);
__decorate([
    Output()
], NgxGalleryImageComponent.prototype, "onClick", void 0);
__decorate([
    Output()
], NgxGalleryImageComponent.prototype, "onActiveChange", void 0);
__decorate([
    HostListener('mouseenter')
], NgxGalleryImageComponent.prototype, "onMouseEnter", null);
__decorate([
    HostListener('mouseleave')
], NgxGalleryImageComponent.prototype, "onMouseLeave", null);
NgxGalleryImageComponent = __decorate([
    Component({
        selector: 'ngx-gallery-image',
        template: "<div class=\"ngx-gallery-image-wrapper ngx-gallery-animation-{{animation}} ngx-gallery-image-size-{{size}}\">\n    <div class=\"ngx-gallery-image\" \n        *ngFor=\"let image of getImages(); let i = index;\" \n        [ngClass]=\"{ 'ngx-gallery-active': selectedIndex == image.index, 'ngx-gallery-inactive-left': selectedIndex > image.index, 'ngx-gallery-inactive-right': selectedIndex < image.index, 'ngx-gallery-clickable': clickable }\" \n        [style.background-image]=\"getSafeUrl(image.src)\" \n        (click)=\"handleClick($event, image.index)\" >\n        <div class=\"ngx-gallery-icons-wrapper\">\n            <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, image.index)\"></ngx-gallery-action>\n        </div>\n        <div class=\"ngx-gallery-image-text\" *ngIf=\"showDescription && descriptions[image.index]\" [innerHTML]=\"descriptions[image.index]\" (click)=\"$event.stopPropagation()\"></div>\n    </div>\n</div>\n<ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"selectedIndex\" (onChange)=\"show($event)\"></ngx-gallery-bullets>\n<ngx-gallery-arrows class=\"ngx-gallery-image-size-{{size}}\" *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\n",
        styles: [":host{display:inline-block;position:relative;width:100%}.ngx-gallery-image-wrapper{left:0;overflow:hidden}.ngx-gallery-image,.ngx-gallery-image-wrapper{height:100%;position:absolute;top:0;width:100%}.ngx-gallery-image{background-position:50%;background-repeat:no-repeat}.ngx-gallery-image.ngx-gallery-active{z-index:1000}.ngx-gallery-image-size-cover .ngx-gallery-image{background-size:cover}.ngx-gallery-image-size-contain .ngx-gallery-image{background-size:contain}.ngx-gallery-animation-fade .ngx-gallery-image{-webkit-transition:.5s ease-in-out;left:0;opacity:0;transition:.5s ease-in-out}.ngx-gallery-animation-fade .ngx-gallery-image.ngx-gallery-active{opacity:1}.ngx-gallery-animation-slide .ngx-gallery-image{-webkit-transition:.5s ease-in-out;transition:.5s ease-in-out}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-active{left:0}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-left{left:-100%}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-right{left:100%}.ngx-gallery-animation-rotate .ngx-gallery-image{-webkit-transform:scale(3.5) rotate(90deg);-webkit-transition:1s ease;left:0;opacity:0;transform:scale(3.5) rotate(90deg);transition:1s ease}.ngx-gallery-animation-rotate .ngx-gallery-image.ngx-gallery-active{-webkit-transform:scale(1) rotate(0deg);opacity:1;transform:scale(1) rotate(0deg)}.ngx-gallery-animation-zoom .ngx-gallery-image{-webkit-transform:scale(2.5);-webkit-transition:1s ease;left:0;opacity:0;transform:scale(2.5);transition:1s ease}.ngx-gallery-animation-zoom .ngx-gallery-image.ngx-gallery-active{-webkit-transform:scale(1);opacity:1;transform:scale(1)}.ngx-gallery-image-text{background:rgba(0,0,0,.7);bottom:0;color:#fff;font-size:16px;padding:10px;position:absolute;text-align:center;width:100%;z-index:10}"]
    })
], NgxGalleryImageComponent);
export { NgxGalleryImageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9ncmVnb3J5bWFjZS9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS05L3Byb2plY3RzL25neC1nYWxsZXJ5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ2FsbGVyeS1pbWFnZS9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQXFCLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUE2QixZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLbkksT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFPckUsSUFBYSx3QkFBd0IsR0FBckMsTUFBYSx3QkFBd0I7SUE2Qm5DLFlBQW9CLFlBQTBCLEVBQ2xDLFVBQXNCLEVBQVUsYUFBc0M7UUFEOUQsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDbEMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQVZ6RSxZQUFPLEdBQUcsSUFBSSxDQUFDO1FBRWQsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0IsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTlDLG1CQUFjLEdBQUcsSUFBSSxDQUFDO0lBSytELENBQUM7SUFFdEYsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNsQixJQUFJLENBQUMs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QUFtQjtRQUM3Qix5K0NBQWlEOztLQUVsRCxDQUFDO0dBQ1csd0JBQXdCLENBcU1wQztTQXJNWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgT25DaGFuZ2VzLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYsIFNpbXBsZUNoYW5nZXMsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSB9IGZyb20gJy4uL25neC1nYWxsZXJ5LW9yZGVyZWQtaW1hZ2UubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbiB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QW5pbWF0aW9uIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktYW5pbWF0aW9uLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktaW1hZ2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgaW1hZ2VzOiBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlW107XG4gIEBJbnB1dCgpIGNsaWNrYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgc2VsZWN0ZWRJbmRleDogbnVtYmVyO1xuICBASW5wdXQoKSBhcnJvd3M6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFycm93c0F1dG9IaWRlOiBib29sZWFuO1xuICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcbiAgQElucHV0KCkgYW5pbWF0aW9uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNpemU6IHN0cmluZztcbiAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBhcnJvd05leHRJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGF1dG9QbGF5OiBib29sZWFuO1xuICBASW5wdXQoKSBhdXRvUGxheUludGVydmFsOiBudW1iZXI7XG4gIEBJbnB1dCgpIGF1dG9QbGF5UGF1c2VPbkhvdmVyOiBib29sZWFuO1xuICBASW5wdXQoKSBpbmZpbml0eU1vdmU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxhenlMb2FkaW5nOiBib29sZWFuO1xuICBASW5wdXQoKSBhY3Rpb25zOiBOZ3hHYWxsZXJ5QWN0aW9uW107XG4gIEBJbnB1dCgpIGRlc2NyaXB0aW9uczogc3RyaW5nW107XG4gIEBJbnB1dCgpIHNob3dEZXNjcmlwdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgYnVsbGV0czogYm9vbGVhbjtcbiAgQElucHV0KCkgdGltZW91dCA9IDEwMDA7XG5cbiAgQE91dHB1dCgpIG9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkFjdGl2ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjYW5DaGFuZ2VJbWFnZSA9IHRydWU7XG5cbiAgcHJpdmF0ZSB0aW1lcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXphdGlvbjogRG9tU2FuaXRpemVyLFxuICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIGhlbHBlclNlcnZpY2U6IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuYXJyb3dzICYmIHRoaXMuYXJyb3dzQXV0b0hpZGUpIHtcbiAgICAgICAgICB0aGlzLmFycm93cyA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5hdXRvUGxheSkge1xuICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUGxheSgpO1xuICAgICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgaWYgKGNoYW5nZXNbJ3N3aXBlJ10pIHtcbiAgICAgICAgICB0aGlzLmhlbHBlclNlcnZpY2UubWFuYWdlU3dpcGUodGhpcy5zd2lwZSwgdGhpcy5lbGVtZW50UmVmLCAnaW1hZ2UnLCAoKSA9PiB0aGlzLnNob3dOZXh0KCksICgpID0+IHRoaXMuc2hvd1ByZXYoKSk7XG4gICAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJykgb25Nb3VzZUVudGVyKCkge1xuICAgICAgaWYgKHRoaXMuYXJyb3dzQXV0b0hpZGUgJiYgIXRoaXMuYXJyb3dzKSB7XG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5hdXRvUGxheSAmJiB0aGlzLmF1dG9QbGF5UGF1c2VPbkhvdmVyKSB7XG4gICAgICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcbiAgICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKSBvbk1vdXNlTGVhdmUoKSB7XG4gICAgICBpZiAodGhpcy5hcnJvd3NBdXRvSGlkZSAmJiB0aGlzLmFycm93cykge1xuICAgICAgICAgIHRoaXMuYXJyb3dzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmF1dG9QbGF5ICYmIHRoaXMuYXV0b1BsYXlQYXVzZU9uSG92ZXIpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0QXV0b1BsYXkoKTtcbiAgICAgIH1cbiAgfVxuXG4gIHJlc2V0KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuICB9XG5cbiAgZ2V0SW1hZ2VzKCk6IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2VbXSB7XG4gICAgICBpZiAoIXRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYXp5TG9hZGluZykge1xuICAgICAgICAgIGxldCBpbmRleGVzID0gW3RoaXMuc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgbGV0IHByZXZJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleCAtIDE7XG5cbiAgICAgICAgICBpZiAocHJldkluZGV4ID09PSAtMSAmJiB0aGlzLmluZmluaXR5TW92ZSkge1xuICAgICAgICAgICAgICBpbmRleGVzLnB1c2godGhpcy5pbWFnZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHByZXZJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIGluZGV4ZXMucHVzaChwcmV2SW5kZXgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBuZXh0SW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXggKyAxO1xuXG4gICAgICAgICAgaWYgKG5leHRJbmRleCA9PSB0aGlzLmltYWdlcy5sZW5ndGggJiYgdGhpcy5pbmZpbml0eU1vdmUpIHtcbiAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKDApO1xuICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGluZGV4ZXMucHVzaChuZXh0SW5kZXgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlcy5maWx0ZXIoKGltZywgaSkgPT4gaW5kZXhlcy5pbmRleE9mKGkpICE9IC0xKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzO1xuICAgICAgfVxuICB9XG5cbiAgc3RhcnRBdXRvUGxheSgpOiB2b2lkIHtcbiAgICAgIHRoaXMuc3RvcEF1dG9QbGF5KCk7XG5cbiAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnNob3dOZXh0KCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCB0aGlzLmF1dG9QbGF5SW50ZXJ2YWwpO1xuICB9XG5cbiAgc3RvcEF1dG9QbGF5KCkge1xuICAgICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jbGlja2FibGUpIHtcbiAgICAgICAgICB0aGlzLm9uQ2xpY2suZW1pdChpbmRleCk7XG5cbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICB9XG5cbiAgc2hvdyhpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMub25BY3RpdmVDaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGVkSW5kZXgpO1xuICAgICAgdGhpcy5zZXRDaGFuZ2VUaW1lb3V0KCk7XG4gIH1cblxuICBzaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmNhblNob3dOZXh0KCkgJiYgdGhpcy5jYW5DaGFuZ2VJbWFnZSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCsrO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgdGhpcy5zZXRDaGFuZ2VUaW1lb3V0KCk7XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9XG5cbiAgc2hvd1ByZXYoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5jYW5TaG93UHJldigpICYmIHRoaXMuY2FuQ2hhbmdlSW1hZ2UpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcblxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgdGhpcy5zZXRDaGFuZ2VUaW1lb3V0KCk7XG4gICAgICB9XG4gIH1cblxuICBzZXRDaGFuZ2VUaW1lb3V0KCkge1xuICAgICAgdGhpcy5jYW5DaGFuZ2VJbWFnZSA9IGZhbHNlO1xuICAgICAgbGV0IHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQ7XG5cbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbiA9PT0gTmd4R2FsbGVyeUFuaW1hdGlvbi5TbGlkZVxuICAgICAgICAgIHx8IHRoaXMuYW5pbWF0aW9uID09PSBOZ3hHYWxsZXJ5QW5pbWF0aW9uLkZhZGUpIHtcbiAgICAgICAgICAgICAgdGltZW91dCA9IDUwMDtcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jYW5DaGFuZ2VJbWFnZSA9IHRydWU7XG4gICAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIGNhblNob3dOZXh0KCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5maW5pdHlNb3ZlIHx8IHRoaXMuc2VsZWN0ZWRJbmRleCA8IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgfVxuXG4gIGNhblNob3dQcmV2KCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5maW5pdHlNb3ZlIHx8IHRoaXMuc2VsZWN0ZWRJbmRleCA+IDAgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgfVxuXG4gIGdldFNhZmVVcmwoaW1hZ2U6IHN0cmluZyk6IFNhZmVTdHlsZSB7XG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKHRoaXMuaGVscGVyU2VydmljZS5nZXRCYWNrZ3JvdW5kVXJsKGltYWdlKSk7XG4gIH1cbn1cbiJdfQ==