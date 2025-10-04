import { Injectable } from '@angular/core';
import { EventBrokerService } from '../../shared/services/event-broker.service';
import Module from 'manifold-3d';
import { Manifold } from 'manifold-3d/manifold-encapsulated-types';

@Injectable({ providedIn: 'root' })
export class Printing3dService {
  private manifold!: typeof Manifold;

  /** Sets up the Manifold library for CSG operations. Multiple calls okay. */
  private async initialize(): Promise<void> {
    if (this.manifold) {
      return;
    }
    // Assets spec puts manifold.wasm at /wasm.
    const wasm = await Module({ locateFile: () => 'wasm/manifold.wasm' });
    wasm.setup();
    this.manifold = wasm.Manifold;
  }

  constructor(eventBrokerService: EventBrokerService) {
    eventBrokerService.print3dRequest.subscribe(() => alert("We're still working on 3d printing. Stay tuned!"));
  }

  public emit3dPrint(): void {
    this.initialize();
  }
}
