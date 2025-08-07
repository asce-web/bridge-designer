import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';
import { jqxSliderComponent, jqxSliderModule } from 'jqwidgets-ng/jqxslider';
import { jqxCheckBoxComponent, jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';
import { SessionStateService } from '../../../shared/services/session-state.service';
import { FlyThruSettings } from '../rendering/fly-thru-settings.service';

@Component({
  selector: 'fly-thru-settings-dialog',
  imports: [jqxCheckBoxModule, jqxSliderModule, jqxWindowModule, jqxExpanderModule],
  templateUrl: './fly-thru-settings-dialog.component.html',
  styleUrl: './fly-thru-settings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyThruSettingsDialogComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('speedSlider') speedSlider!: jqxSliderComponent;
  @ViewChild('brightnessSlider') brightnessSlider!: jqxSliderComponent;
  @ViewChild('shadowsCheckbox') shadowsCheckbox!: jqxCheckBoxComponent;
  @ViewChild('skyCheckbox') skyCheckbox!: jqxCheckBoxComponent;
  @ViewChild('terrainCheckbox') terrainCheckbox!: jqxCheckBoxComponent;
  @ViewChild('abutmentsCheckbox') abutmentsCheckbox!: jqxCheckBoxComponent;
  @ViewChild('truckCheckbox') truckCheckbox!: jqxCheckBoxComponent;
  @ViewChild('memberColorsCheckbox') memberColorsCheckbox!: jqxCheckBoxComponent;
  @ViewChild('exaggerationCheckbox') exaggerationCheckbox!: jqxCheckBoxComponent;

  checkboxWidth: number = 120;
  checkboxHeight: number = 20;

  constructor(
    private readonly eventBrokerService: EventBrokerService,
    private readonly sessionStateService: SessionStateService,
  ) {}

  open() {
    this.dialog.open();
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.flyThruSettingsRequest.subscribe(() => this.open());
    this.sessionStateService.register(
      'flythrusettings.component',
      () => this.dehydrate(),
      state => this.rehydrate(state),
    );
  }

  private dehydrate(): State {
    return {
      brightness: this.brightnessSlider.getValue(),
      speed: this.speedSlider.getValue(),
      abutments: this.abutmentsCheckbox.checked() === true,
      exaggeration: this.exaggerationCheckbox.checked() === true,
      memberColors: this.memberColorsCheckbox.checked() === true,
      shadows: this.shadowsCheckbox.checked() === true,
      sky: this.skyCheckbox.checked() === true,
      terrain: this.terrainCheckbox.checked() === true,
      truck: this.truckCheckbox.checked() === true,
    };
  }

  private rehydrate(state: State): void {
    this.brightnessSlider.setValue(state.brightness);
    this.speedSlider.setValue(state.speed);
    this.abutmentsCheckbox.checked(state.abutments);
    this.exaggerationCheckbox.checked(state.exaggeration);
    this.memberColorsCheckbox.checked(state.memberColors);
    this.shadowsCheckbox.checked(state.shadows);
    this.skyCheckbox.checked(state.sky);
    this.terrainCheckbox.checked(state.terrain);
    this.truckCheckbox.checked(state.truck);
  }

  handleSpeedSliderChange() {
    this.notifySettingsChange({ speed: this.speedSlider.getValue() });
  }

  handleBrightnessSliderChange() {
    this.notifySettingsChange({ brightness: this.brightnessSlider.getValue() });
  }

  handleShadowsCheckboxChange() {
    this.notifySettingsChange({ noShadows: !this.shadowsCheckbox.checked()! });
  }

  handleSkyCheckboxChange() {
    this.notifySettingsChange({ noSky: !this.skyCheckbox.checked()! });
  }

  handleTerrainCheckboxChange() {
    this.notifySettingsChange({ noTerrain: !this.terrainCheckbox.checked()! });
  }

  handleAbutmentsCheckboxChange() {
    this.notifySettingsChange({ noAbutments: !this.abutmentsCheckbox.checked()! });
  }

  handleTruckCheckboxChange() {
    this.notifySettingsChange({ noTruck: !this.truckCheckbox.checked()! });
  }

  handleMemberColorsCheckbox() {
    this.notifySettingsChange({ noMemberColors: !this.memberColorsCheckbox.checked()! });

  }

  handleExaggerationCheckbox() {
    this.notifySettingsChange({ noExaggeration: !this.exaggerationCheckbox.checked()! });
  }

  private notifySettingsChange(data: FlyThruSettings) {
    this.eventBrokerService.flyThruSettingsChange.next({
      origin: EventOrigin.FLY_THRU_SETTINGS_DIALOG,
      data,
    });
  }
}

type State = {
  brightness: number;
  speed: number;
  abutments: boolean;
  exaggeration: boolean;
  memberColors: boolean;
  shadows: boolean;
  sky: boolean;
  terrain: boolean;
  truck: boolean;
};
