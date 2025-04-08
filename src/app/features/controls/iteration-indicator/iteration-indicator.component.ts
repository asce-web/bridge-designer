import { Component } from '@angular/core';
import { BridgeService } from '../../../shared/services/bridge.service';

@Component({
    selector: 'iteration-indicator',
    imports: [],
    templateUrl: './iteration-indicator.component.html',
    styleUrl: './iteration-indicator.component.css'
})
export class IterationIndicatorComponent {
  constructor(
    readonly bridgeService: BridgeService,
  ) {}
}
