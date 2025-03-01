import { __decorate } from "tslib";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
let NgxGalleryActionComponent = class NgxGalleryActionComponent {
    constructor() {
        this.disabled = false;
        this.titleText = '';
        this.onClick = new EventEmitter();
    }
    handleClick(event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }
        event.stopPropagation();
        event.preventDefault();
    }
};
__decorate([
    Input()
], NgxGalleryActionComponent.prototype, "icon", void 0);
__decorate([
    Input()
], NgxGalleryActionComponent.prototype, "disabled", void 0);
__decorate([
    Input()
], NgxGalleryActionComponent.prototype, "titleText", void 0);
__decorate([
    Output()
], NgxGalleryActionComponent.prototype, "onClick", void 0);
NgxGalleryActionComponent = __decorate([
    Component({
        selector: 'ngx-gallery-action',
        template: "<div class=\"ngx-gallery-icon\" [class.ngx-gallery-icon-disabled]=\"disabled\"\naria-hidden=\"true\"\ntitle=\"{{ titleText }}\"\n(click)=\"handleClick($event)\">\n    <i class=\"ngx-gallery-icon-content {{ icon }}\"></i>\n</div>",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [""]
    })
], NgxGalleryActionComponent);
export { NgxGalleryActionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZ3JlZ29yeW1hY2UvcHJvamVjdHMvbmd4LWdhbGxlcnktOS9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWdhbGxlcnktYWN0aW9uL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFRaEcsSUFBYSx5QkFBeUIsR0FBdEMsTUFBYSx5QkFBeUI7SUFBdEM7UUFFVyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFFZCxZQUFPLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7SUFVOUQsQ0FBQztJQVJDLFdBQVcsQ0FBQyxLQUFZO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVCO1FBRUQsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO0NBQ0YsQ0FBQTtBQWRVO0lBQVIsS0FBSyxFQUFFO3VEQUFjO0FBQ2I7SUFBUixLQUFLLEVBQUU7MkRBQWtCO0FBQ2pCO0lBQVIsS0FBSyxFQUFFOzREQUFnQjtBQUVkO0lBQVQsTUFBTSxFQUFFOzBEQUFtRDtBQUxqRCx5QkFBeUI7SUFOckMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG9CQUFvQjtRQUM5QixnUEFBa0Q7UUFFbEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O0tBQ2hELENBQUM7R0FDVyx5QkFBeUIsQ0FlckM7U0FmWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktYWN0aW9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5QWN0aW9uQ29tcG9uZW50IHtcbiAgQElucHV0KCkgaWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoKSB0aXRsZVRleHQgPSAnJztcblxuICBAT3V0cHV0KCkgb25DbGljazogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBoYW5kbGVDbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgIHRoaXMub25DbGljay5lbWl0KGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59XG4iXX0=