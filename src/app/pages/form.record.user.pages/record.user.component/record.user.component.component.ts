import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-record-user',
  imports: [MatTabsModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './record.user.component.component.html',
  styleUrl: './record.user.component.component.scss'
})
export class RecordUserComponentComponent {
  foods: any[] = [
    {value: 'usuario 1', viewValue: 'usuario 1'},
    {value: 'usuario 2', viewValue: 'usuario 2'},
    {value: 'usuario 3', viewValue: 'usuario 3'},
  ];

}
