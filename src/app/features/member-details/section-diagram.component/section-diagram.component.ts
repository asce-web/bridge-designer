import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'section-diagram',
  imports: [],
  templateUrl: './section-diagram.component.html',
  styleUrl: './section-diagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDiagramComponent {
  @Input() width: number = 100;
  @Input() height: number = 100;
}
