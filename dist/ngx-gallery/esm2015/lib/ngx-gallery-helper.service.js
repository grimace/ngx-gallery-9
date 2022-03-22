import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let NgxGalleryHelperService = class NgxGalleryHelperService {
    constructor(renderer) {
        this.renderer = renderer;
        this.swipeHandlers = new Map();
    }
    manageSwipe(status, element, id, nextHandler, prevHandler) {
        const handlers = this.getSwipeHandlers(id);
        // swipeleft and swiperight are available only if hammerjs is included
        try {
            if (status && !handlers) {
                this.swipeHandlers.set(id, [
                    this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
                    this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
                ]);
            }
            else if (!status && handlers) {
                handlers.map((handler) => handler());
                this.removeSwipeHandlers(id);
            }
        }
        catch (e) { }
    }
    validateUrl(url) {
        if (url.replace) {
            return url.replace(new RegExp(' ', 'g'), '%20')
                .replace(new RegExp('\'', 'g'), '%27');
        }
        else {
            return url;
        }
    }
    getBackgroundUrl(image) {
        return 'url(\'' + this.validateUrl(image) + '\')';
    }
    getSwipeHandlers(id) {
        return this.swipeHandlers.get(id);
    }
    removeSwipeHandlers(id) {
        this.swipeHandlers.delete(id);
    }
};
NgxGalleryHelperService = __decorate([
    Injectable()
], NgxGalleryHelperService);
export { NgxGalleryHelperService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2dyZWdvcnltYWNlL3Byb2plY3RzL25neC1nYWxsZXJ5LTkvcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjLyIsInNvdXJjZXMiOlsibGliL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUF5QixNQUFNLGVBQWUsQ0FBQztBQUdsRSxJQUFhLHVCQUF1QixHQUFwQyxNQUFhLHVCQUF1QjtJQUdsQyxZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBRi9CLGtCQUFhLEdBQTRCLElBQUksR0FBRyxFQUFzQixDQUFDO0lBRXJDLENBQUM7SUFFM0MsV0FBVyxDQUFDLE1BQWUsRUFBRSxPQUFtQixFQUFFLEVBQVUsRUFBRSxXQUFxQixFQUFFLFdBQXFCO1FBRXRHLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUzQyxzRUFBc0U7UUFDdEUsSUFBSTtZQUNBLElBQUksTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUM3RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztpQkFDakYsQ0FBQyxDQUFDO2FBQ047aUJBQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLEVBQUU7Z0JBQzVCLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNoQztTQUNKO1FBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtJQUNsQixDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQVc7UUFDbkIsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO1lBQ2IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUM7aUJBQzFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUM7YUFBTTtZQUNILE9BQU8sR0FBRyxDQUFDO1NBQ2Q7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBYTtRQUMxQixPQUFPLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUN0RCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxFQUFVO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDRixDQUFBO0FBM0NZLHVCQUF1QjtJQURuQyxVQUFVLEVBQUU7R0FDQSx1QkFBdUIsQ0EyQ25DO1NBM0NZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2Uge1xuICBwcml2YXRlIHN3aXBlSGFuZGxlcnM6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+ID0gbmV3IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIG1hbmFnZVN3aXBlKHN0YXR1czogYm9vbGVhbiwgZWxlbWVudDogRWxlbWVudFJlZiwgaWQ6IHN0cmluZywgbmV4dEhhbmRsZXI6IEZ1bmN0aW9uLCBwcmV2SGFuZGxlcjogRnVuY3Rpb24pOiB2b2lkIHtcblxuICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmdldFN3aXBlSGFuZGxlcnMoaWQpO1xuXG4gICAgICAvLyBzd2lwZWxlZnQgYW5kIHN3aXBlcmlnaHQgYXJlIGF2YWlsYWJsZSBvbmx5IGlmIGhhbW1lcmpzIGlzIGluY2x1ZGVkXG4gICAgICB0cnkge1xuICAgICAgICAgIGlmIChzdGF0dXMgJiYgIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3dpcGVIYW5kbGVycy5zZXQoaWQsIFtcbiAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3N3aXBlbGVmdCcsICgpID0+IG5leHRIYW5kbGVyKCkpLFxuICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc3dpcGVyaWdodCcsICgpID0+IHByZXZIYW5kbGVyKCkpXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXN0YXR1cyAmJiBoYW5kbGVycykge1xuICAgICAgICAgICAgICBoYW5kbGVycy5tYXAoKGhhbmRsZXIpID0+IGhhbmRsZXIoKSk7XG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlU3dpcGVIYW5kbGVycyhpZCk7XG4gICAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgfVxuXG4gIHZhbGlkYXRlVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIGlmICh1cmwucmVwbGFjZSkge1xuICAgICAgICAgIHJldHVybiB1cmwucmVwbGFjZShuZXcgUmVnRXhwKCcgJywgJ2cnKSwgJyUyMCcpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcJycsICdnJyksICclMjcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgIH1cbiAgfVxuXG4gIGdldEJhY2tncm91bmRVcmwoaW1hZ2U6IHN0cmluZykge1xuICAgICAgcmV0dXJuICd1cmwoXFwnJyArIHRoaXMudmFsaWRhdGVVcmwoaW1hZ2UpICsgJ1xcJyknO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTd2lwZUhhbmRsZXJzKGlkOiBzdHJpbmcpOiBGdW5jdGlvbltdIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLnN3aXBlSGFuZGxlcnMuZ2V0KGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlU3dpcGVIYW5kbGVycyhpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICB0aGlzLnN3aXBlSGFuZGxlcnMuZGVsZXRlKGlkKTtcbiAgfVxufVxuIl19