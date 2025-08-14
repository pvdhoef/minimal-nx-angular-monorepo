import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDemolib } from './angular-demolib';

describe('AngularDemolib', () => {
    let component: AngularDemolib;
    let fixture: ComponentFixture<AngularDemolib>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AngularDemolib],
        }).compileComponents();

        fixture = TestBed.createComponent(AngularDemolib);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
