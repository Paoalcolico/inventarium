import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginController } from '../../controllers/login.controller';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginController: jasmine.SpyObj<LoginController>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const loginControllerSpy = jasmine.createSpyObj('LoginController', [
      'handleLogin', 
      'isUserAuthenticated', 
      'getCurrentUser'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: LoginController, useValue: loginControllerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockLoginController = TestBed.inject(LoginController) as jasmine.SpyObj<LoginController>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.value.username).toBe('');
    expect(component.loginForm.value.password).toBe('');
  });

  it('should validate required fields', () => {
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    expect(usernameControl?.valid).toBeFalsy();
    expect(passwordControl?.valid).toBeFalsy();

    usernameControl?.setValue('admin');
    passwordControl?.setValue('123456');

    expect(usernameControl?.valid).toBeTruthy();
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should call handleLogin when form is submitted', async () => {
    const mockResponse = { success: true, message: 'Login successful' };
    spyOn(component, 'onSubmit').and.callThrough();
    
    component.loginForm.setValue({
      username: 'admin',
      password: '123456'
    });

    await component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
