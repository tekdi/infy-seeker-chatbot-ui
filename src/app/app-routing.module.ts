import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { HomeComponent } from './Components/home/home.component';
import { authGuard } from './auth.guard';
const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'chatbot', component: ChatbotComponent ,canActivate:[authGuard]}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
