import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges, HostListener } from '@angular/core';
import { NgxGalleryOrderedImage } from '../ngx-gallery-ordered-image.model';
import { NgxGalleryAction } from '../ngx-gallery-action.model';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgxGalleryHelperService } from '../ngx-gallery-helper.service';
import { NgxGalleryAnimation } from '../ngx-gallery-animation.model';

@Component({
  selector: 'ngx-gallery-image',
  templateUrl: './ngx-gallery-image.component.html',
  styleUrls: ['./ngx-gallery-image.component.scss']
})
export class NgxGalleryImageComponent implements OnInit, OnChanges {
  @Input() images: NgxGalleryOrderedImage[];
  @Input() clickable: boolean;
  @Input() selectedIndex: number;
  @Input() arrows: boolean;
  @Input() arrowsAutoHide: boolean;
  @Input() swipe: boolean;
  @Input() animation: string;
  @Input() size: string;
  @Input() arrowPrevIcon: string;
  @Input() arrowNextIcon: string;
  @Input() autoPlay: boolean;
  @Input() autoPlayInterval: number;
  @Input() autoPlayPauseOnHover: boolean;
  @Input() infinityMove: boolean;
  @Input() lazyLoading: boolean;
  @Input() actions: NgxGalleryAction[];
  @Input() descriptions: string[];
  @Input() showDescription: boolean;
  @Input() bullets: boolean;
  @Input() timeout = 1000;

  @Output() onClick = new EventEmitter();
  @Output() onActiveChange = new EventEmitter();

  canChangeImage = true;

  private timer;

  constructor(private sanitization: DomSanitizer,
      private elementRef: ElementRef, private helperService: NgxGalleryHelperService) {}

  ngOnInit(): void {
      if (this.arrows && this.arrowsAutoHide) {
          this.arrows = false;
      }

      if (this.autoPlay) {
          this.startAutoPlay();
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['swipe']) {
          this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
      }
  }

  @HostListener('mouseenter') onMouseEnter() {
      if (this.arrowsAutoHide && !this.arrows) {
          this.arrows = true;
      }

      if (this.autoPlay && this.autoPlayPauseOnHover) {
          this.stopAutoPlay();
      }
  }

  @HostListener('mouseleave') onMouseLeave() {
      if (this.arrowsAutoHide && this.arrows) {
          this.arrows = false;
      }

      if (this.autoPlay && this.autoPlayPauseOnHover) {
          this.startAutoPlay();
      }
  }

  reset(index: number): void {
      this.selectedIndex = index;
  }

  getImages(): NgxGalleryOrderedImage[] {
      if (!this.images) {
          return [];
      }

      if (this.lazyLoading) {
          let indexes = [this.selectedIndex];
          let prevIndex = this.selectedIndex - 1;

          if (prevIndex === -1 && this.infinityMove) {
              indexes.push(this.images.length - 1)
          } else if (prevIndex >= 0) {
              indexes.push(prevIndex);
          }

          let nextIndex = this.selectedIndex + 1;

          if (nextIndex == this.images.length && this.infinityMove) {
              indexes.push(0);
          } else if (nextIndex < this.images.length) {
              indexes.push(nextIndex);
          }

          return this.images.filter((img, i) => indexes.indexOf(i) != -1);
      } else {
          return this.images;
      }
  }

  startAutoPlay(): void {
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

  handleClick(event: Event, index: number): void {
      if (this.clickable) {
          this.onClick.emit(index);

          event.stopPropagation();
          event.preventDefault();
      }
  }

  show(index: number) {
      this.selectedIndex = index;
      this.onActiveChange.emit(this.selectedIndex);
      this.setChangeTimeout();
  }

  showNext(): boolean {
      if (this.canShowNext() && this.canChangeImage) {
          this.selectedIndex++;

          if (this.selectedIndex === this.images.length) {
              this.selectedIndex = 0;
          }

          this.onActiveChange.emit(this.selectedIndex);
          this.setChangeTimeout();

          return true;
      } else {
          return false;
      }
  }

  showPrev(): void {
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

  canShowNext(): boolean {
      if (this.images) {
          return this.infinityMove || this.selectedIndex < this.images.length - 1
              ? true : false;
      } else {
          return false;
      }
  }

  canShowPrev(): boolean {
      if (this.images) {
          return this.infinityMove || this.selectedIndex > 0 ? true : false;
      } else {
          return false;
      }
  }

  getSafeUrl(image: string): SafeStyle {
      return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
  }
}
