import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MenubarModule, RouterOutlet, ButtonModule, AvatarModule, OverlayPanelModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  constructor(private router: Router) { }

  logOff() {    
    localStorage.removeItem('token');    
    this.router.navigateByUrl('/login');
  }

  items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      {
        label: 'Support',
        icon: 'pi pi-headphones'

      },
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['/home']);
        }
      },
      {
        label: 'Account',
        icon: 'pi pi-user',
        items: [
          {
            label: 'My Profile',
            icon: 'pi pi-address-book',
            command: () => {
              this.router.navigate(['/profile']);
            }
          },
          {
            label: 'Log Out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logOff();
            }
          }
        ]
      }
    ]
  }
}
