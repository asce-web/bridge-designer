import { CartoonOptionMask } from '../../../shared/services/cartoon-rendering.service';

export const enum LegendItemMask {
  NONE = 0,
  RIVER_BANK = 0x1,
  EXCAVATION = 0x2,
  RIVER = 0x4,
  DECK = 0x8,
  ABUTMENT = 0x10,
  PIER = 0x20,
  ALL = 0x40 - 1,
}

export const enum ControlMask {
  NONE = 0,
  BACK_BUTTON = 0x1,
  NEXT_BUTTON = 0x2,
  FINISH_BUTTON = 0x4,
  SITE_COST = 0x8,
  ALL = 0x10 - 1,
}

export interface SetupWizardCardView {}

/**
 * Container for per-setup-wizard-card logic. Calls back to an
 * interface to query and mutate the wizard.
 */
export abstract class Card {
  constructor(protected readonly wizardView: SetupWizardCardView) {}

  abstract index: number;

/** Creates a list of cards for the given wizard. */
public static createCards(wizardView: SetupWizardCardView): Card[] {
    return [
      new Card1(wizardView),
      new Card2(wizardView),
      new Card3(wizardView),
      new Card4(wizardView),
      new Card5(wizardView),
      new Card6(wizardView),
      new Card7(wizardView),
    ];
  }

  get nextCardIndex(): number | undefined {
    return this.index + 1;
  }

  get backCardIndex(): number | undefined {
    return this.index - 1;
  }

  get elevationCartoonOptions(): number {
    return CartoonOptionMask.ALL;
  }

  get legendItemMask(): number {
    return LegendItemMask.ALL;
  }

  get enabledControlMask(): number {
    return ControlMask.ALL;
  }
}

class Card1 extends Card {
  override index: number = 0;

  override get backCardIndex(): number | undefined {
    return undefined;
  }
}

class Card2 extends Card {
  override index: number = 1;
}

class Card3 extends Card {
  override index: number = 2;
}

class Card4 extends Card {
  override index: number = 3;
}

class Card5 extends Card {
  override index: number = 4;
}

class Card6 extends Card {
  override index: number = 5;
}

class Card7 extends Card {
  override index: number = 6;

  override get nextCardIndex(): number | undefined {
    return undefined;
  }
}
