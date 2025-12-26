/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { jqxSliderComponent, jqxSliderModule } from 'jqwidgets-ng/jqxslider';
import { MemberStrengthGraphComponet } from '../member-strength-graph/member-strength-graph.component';
import { SectionDiagramComponent } from '../section-diagram.component/section-diagram.component';

@Component({
  selector: 'member-details-dialog',
  imports: [MemberStrengthGraphComponet, SectionDiagramComponent, jqxButtonModule, jqxDropDownListModule, jqxSliderModule, jqxWindowModule],
  templateUrl: './member-details-dialog.component.html',
  styleUrl: './member-details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailsDialogComponent implements AfterViewInit {
  crossSection: string = 'cross-section';
  crossSectionArea: string = 'area';
  crossSectionMoment: string = 'moment';
  crossSectionSize: string = 'size';
  density: string = 'density';
  material: string = 'material';
  memberCost: string = 'cost';
  memberLength: string = 'length';
  modulus: string = 'modulus';
  unitCost: string = 'unit cost';
  yieldStress: string = 'yield stress'; // format with commas

  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('memberSliderContainer', { read: ViewContainerRef, static: true })
  memberSliderContainer!: ViewContainerRef;

  constructor(private readonly eventBrokerService: EventBrokerService) {
    // jqWidgets provides the wrong "this" (of initContent to the jqxWindow component)!
    this.initDialogContent = this.initDialogContent.bind(this);
  }

  /** Works around heinous bug in jqxSlider: can't be declared in HTML if parent isn't visible. Create dynamically. */
  initDialogContent(): void {
    MemberDetailsDialogComponent.setUpSlider(
      this.memberSliderContainer,
      {
        width: 376,
        height: 70,
        max: 100,
        min: 1,
        mode: 'fixed',
        step: 1,
        showTicks: true,
        tooltip: true,
        value: 1,
      },
      () => {},
    );
  }

  private static setUpSlider(
    containerRef: ViewContainerRef,
    inputs: { [key: string]: any },
    onChange: () => void,
  ): jqxSliderComponent {
    const sliderRef = containerRef.createComponent(jqxSliderComponent);
    for (const [key, value] of Object.entries(inputs)) {
      sliderRef.setInput(key, value);
    }
    sliderRef.instance.onChange.subscribe(onChange);
    sliderRef.changeDetectorRef.detectChanges();
    return sliderRef.instance;
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.memberDetailsRequest.subscribe(() => this.dialog.open());
  }
}
