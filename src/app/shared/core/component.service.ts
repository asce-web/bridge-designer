/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Injectable,
  Type,
} from '@angular/core';

/** Dynamic loader of components with specified host element. */
@Injectable({ providedIn: 'root' })
export class ComponentService {
  constructor(private readonly applicationRef: ApplicationRef) {}

  /**
   * Loads the given component at the given host. Call `setInput(...)`
   * on the returned reference as needed.
   */
  public load<T>(component: Type<T>, host: Element): ComponentRef<T> {
    const componentRef = createComponent(component, {
      environmentInjector: this.applicationRef.injector,
      hostElement: host,
    });
    this.applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }
}
