import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyerBidComponent } from './pages/buyer/buyer-bid/buyer-bid.component';
import { BuyerBidListComponent } from './pages/buyer/buyer-bid-list/buyer-bid-list.component';
import { SellerBidListComponent } from './pages/seller/seller-bid-list/seller-bid-list.component';
import { BuyerBrowseComponent } from './pages/buyer/buyer-browse/buyer-browse.component';
import { LandingComponent } from './pages/common/landing/landing.component';
import { InfoComponent } from './shared/components/info/info.component';
import { AuthGuard } from './guards/auth.guard';
import { UserDataResolver } from './resolvers/user-data.resolver';
import { UserSessionDataResolver } from './resolvers/user-session-data.resolver';
import { SellerListComponent } from './pages/admin/seller-list/seller-list.component';
import { BuyerListComponent } from './pages/admin/buyer-list/buyer-list.component';
import { BidListComponent } from './pages/admin/bid-list/bid-list.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    resolve: [UserSessionDataResolver, UserDataResolver]
  },
  {
    path: 'buyer/:id/browse',
    component: BuyerBrowseComponent,
    resolve: [UserSessionDataResolver, UserDataResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'buyer/:id/bid',
    component: BuyerBidComponent,
    resolve: [UserSessionDataResolver, UserDataResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'buyer/:id/bid-list',
    component: BuyerBidListComponent,
    resolve: [UserSessionDataResolver, UserDataResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'seller/:id/bid-list',
    component: SellerBidListComponent,
    resolve: [UserSessionDataResolver, UserDataResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/seller-list',
    component: SellerListComponent,
    resolve: [UserSessionDataResolver, UserDataResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/buyer-list',
    component: BuyerListComponent,
    resolve: [UserSessionDataResolver, UserDataResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/bid-list',
    component: BidListComponent,
    resolve: [UserSessionDataResolver, UserDataResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'info/:page',
    component: InfoComponent
  },
  {
    path: '**',
    component: LandingComponent,
    resolve: [UserSessionDataResolver, UserDataResolver]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
