import { Editable, EditableUtility } from './editing';

class TestEditable implements Editable {
  constructor(public index: number, public value: string) {}

  swapContents(other: TestEditable): void {
    [this.index, other.index] = [other.index, this.index];
    [this.value, other.value] = [other.value, this.value];
  }
}

describe('EditableUtility', () => {
  describe('merge', () => {
    it('should merge empty source list into target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
      ];
      const source: TestEditable[] = [];
      const selected = new Set<number>([1]);

      EditableUtility.merge(target, source, selected);

      expect(target).toEqual([
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
      ]);
      expect(selected).toEqual(new Set<number>([1]));
    });

    it('should merge source list into empty target', () => {
      const target: TestEditable[] = [];
      const source: TestEditable[] = [
        new TestEditable(0, 'x'),
        new TestEditable(1, 'y'),
      ];
      const selected = new Set<number>([]);

      EditableUtility.merge(target, source, selected);

      expect(target).toEqual([
        new TestEditable(0, 'x'),
        new TestEditable(1, 'y'),
      ]);
      expect(selected).toEqual(new Set<number>([]));
    });

    it('should merge source list into middle of target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
      ];
      const source: TestEditable[] = [
        new TestEditable(1, 'x'),
        new TestEditable(2, 'y'),
      ];
      const selected = new Set<number>([0, 2]);

      EditableUtility.merge(target, source, selected);

      expect(target).toEqual([
        new TestEditable(0, 'a'),
        new TestEditable(1, 'x'),
        new TestEditable(2, 'y'),
        new TestEditable(3, 'b'),
        new TestEditable(4, 'c'),
      ]);
      expect(selected).toEqual(new Set<number>([0, 4]));
    });

    it('should merge source list at the end of target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
      ];
      const source: TestEditable[] = [
        new TestEditable(2, 'x'),
        new TestEditable(3, 'y'),
      ];
      const selected = new Set<number>([1]);

      EditableUtility.merge(target, source, selected);

      expect(target).toEqual([
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'x'),
        new TestEditable(3, 'y'),
      ]);
      expect(selected).toEqual(new Set<number>([1]));
    });

    it('should merge a source interwoven throughout target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
      ];
      const source: TestEditable[] = [
        new TestEditable(0, 'x'),
        new TestEditable(2, 'y'),
        new TestEditable(4, 'z'),
      ];
      const selected = new Set<number>([0, 1]);

      EditableUtility.merge(target, source, selected);

      expect(target).toEqual([
        new TestEditable(0, 'x'),
        new TestEditable(1, 'a'),
        new TestEditable(2, 'y'),
        new TestEditable(3, 'b'),
        new TestEditable(4, 'z'),
      ]);
      expect(selected).toEqual(new Set<number>([1, 3]));
    });
  });

  describe('remove', () => {
    it('should remove nothing when subsequence is empty', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
      ];
      const subsequence: TestEditable[] = [];
      const selected = new Set<number>([1]);

      EditableUtility.remove(target, subsequence, selected);

      expect(target).toEqual([
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
      ]);
      expect(selected).toEqual(new Set<number>([1]));
    });

    it('should remove items from beginning of target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
      ];
      const subsequence: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
      ];
      const selected = new Set<number>([0, 1, 2]);

      EditableUtility.remove(target, subsequence, selected);

      expect(target).toEqual([new TestEditable(0, 'c')]);
      expect(selected).toEqual(new Set<number>([0]));
    });

    it('should remove items from middle of target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
        new TestEditable(3, 'd'),
      ];
      const subsequence: TestEditable[] = [
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
      ];
      const selected = new Set<number>([3]);

      EditableUtility.remove(target, subsequence, selected);

      expect(target).toEqual([
        new TestEditable(0, 'a'),
        new TestEditable(1, 'd'),
      ]);
      expect(selected).toEqual(new Set<number>([1]));
    });

    it('should remove items from end of target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
      ];
      const subsequence: TestEditable[] = [
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
      ];
      const selected = new Set<number>([0, 1, 2]);

      EditableUtility.remove(target, subsequence, selected);

      expect(target).toEqual([new TestEditable(0, 'a')]);
      expect(selected).toEqual(new Set<number>([0]));
    });

    it('should remove items interwoven throughout the target', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
        new TestEditable(3, 'd'),
        new TestEditable(4, 'e'),
      ];
      const subsequence: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(2, 'c'),
        new TestEditable(4, 'e'),
      ];
      const selected = new Set<number>([0, 1, 4]);

      EditableUtility.remove(target, subsequence, selected);

      expect(target).toEqual([
        new TestEditable(0, 'b'),
        new TestEditable(1, 'd'),
      ]);
      expect(selected).toEqual(new Set<number>([0]));
    });
  });

  describe('exchange', () => {
    it('should do a single item exchange', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
      ];
      const source: TestEditable = new TestEditable(1, 'x');

      EditableUtility.exchange(target, source);

      expect(target).toEqual([
        new TestEditable(0, 'a'),
        new TestEditable(1, 'x'),
        new TestEditable(2, 'c'),
      ]);
    });

    it('should do a multiple item exchange', () => {
      const target: TestEditable[] = [
        new TestEditable(0, 'a'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'c'),
      ];
      const source: TestEditable[] = [
        new TestEditable(0, 'x'),
        new TestEditable(2, 'y'),
      ];

      EditableUtility.exchangeAll(target, source);

      expect(target).toEqual([
        new TestEditable(0, 'x'),
        new TestEditable(1, 'b'),
        new TestEditable(2, 'y'),
      ]);
    });
  });
});
