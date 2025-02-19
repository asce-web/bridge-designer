import { Member } from '../../../shared/classes/member.model';

export class EditCommandDescription {
  /**
   * Helper function to build description text for UI purposes when the text
   * is composed of a prefix followed by a list of member numbers.
   * Examples:
   *   Delete member.
   *   Delete member 3.
   *   Delete members 12 and 34.
   *   Delete members 1, 2, 5 and 7.
   *   Delete members 1, 2, 3, 4 ... 47, 48, 49, 50.
   */
  public static formatMemberMessage(members: Member[], single: string, many?: string): string {
    const numbers = members.map(member => member.number);
    numbers.sort((a, b) => a - b);
    if (numbers.length <= 0) {
      return `${single}.`;
    }
    if (numbers.length === 1) {
      return `${single} ${numbers[0]}`;
    }
    const chunks = [many || `${single}s`];
    chunks.push(' ', numbers[0].toString());
    const ixLength = 3;
    if (numbers.length <= 2 * ixLength) {
      for (let i: number = 1; i < numbers.length - 1; ++i) {
        chunks.push(', ', numbers[i].toString());
      }
      chunks.push(' and ', numbers[numbers.length - 1].toString());
    } else {
      for (let i: number = 1; i < ixLength; ++i) {
        chunks.push(', ', numbers[i].toString());
      }
      chunks.push(' … ');
      for (let i: number = numbers.length - ixLength - 1; i < numbers.length; ++i) {
        chunks.push(', ', numbers[i].toString());
      }
    }
    return chunks.join('');
  }
}
