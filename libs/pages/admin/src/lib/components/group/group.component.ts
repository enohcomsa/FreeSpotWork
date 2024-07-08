import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { DynamicChipListComponent } from '@free-spot/ui';
import { Group } from '@free-spot/models';

@Component({
  selector: 'free-spot-group',
  standalone: true,
  imports: [CommonModule, DynamicChipListComponent, MatTabsModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent {
  groupNameSig = input.required<string>();

  groupData: Group = {
    name: 'gr1',
    studentList: [
      'enoh',
      'dsada',
      'dsggggg',
      'bbbbbbbb',
      'ffffffff',
      'zzzzzzz',
      'enoh',
      'dsada',
      'dsggggg',
      'bbbbbbbb',
      'ffffffff',
      'zzzzzzz',
      'enoh',
      'dsada',
      'dsggggg',
      'bbbbbbbb',
      'ffffffff',
      'zzzzzzz',
    ],
    timeTable: [],
  };
}
