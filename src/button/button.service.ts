import { classesToString } from '~/helpers';

class ButtonService {
  public getClasses(variant: string, outline: boolean, intent: string, disabled: boolean, className: string) {
    const base = classesToString([
      'gsui-button',
      [variant, `gsui-button--${variant}`],
      [outline, 'gsui-button--outline'],
      [intent, `is-${intent}`],
      [disabled, 'is-disabled'],
      className || ''
    ]);

    return { base };
  }
}

export const buttonService = new ButtonService();
