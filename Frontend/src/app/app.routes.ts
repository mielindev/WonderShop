import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { OrderComponent } from './pages/order/order.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { authGuard } from './guards/auth.guard';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { authRedirectGuard } from './guards/auth-redirect.guard';
import { AdminProductComponent } from './pages/admin-product/admin-product.component';
import { AdminOrderComponent } from './pages/admin-order/admin-order.component';
import { AdminUserComponent } from './pages/admin-user/admin-user.component';
import { AdminOrderDetailComponent } from './pages/admin-order-detail/admin-order-detail.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'shop',
        component: ShopComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
        canActivate: [authGuard],
      },
      {
        path: 'order-details/:orderId',
        component: OrderDetailComponent,
        canActivate: [authGuard],
      },
      {
        path: 'product-detail/:id',
        component: ProductDetailComponent,
      },
      {
        path: 'user-details',
        component: UserDetailComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [authRedirectGuard],
    children: [
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'products',
        component: AdminProductComponent,
      },
      {
        path: 'orders',
        component: AdminOrderComponent,
      },
      {
        path: 'order-details/:orderId',
        component: AdminOrderDetailComponent,
      },
      {
        path: 'users',
        component: AdminUserComponent,
      },
    ],
  },
];
