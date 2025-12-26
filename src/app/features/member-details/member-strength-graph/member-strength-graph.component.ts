import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'member-strength-graph',
  imports: [],
  templateUrl: './member-strength-graph.component.html',
  styleUrl: './member-strength-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberStrengthGraphComponet {
  @Input() width: number = 400;
  @Input() height: number = 400;

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
}
