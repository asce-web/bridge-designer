import { Injectable } from '@angular/core';
import { EditCommand } from '../../../shared/classes/editing';
import { Deque } from '../../../shared/classes/deque';

@Injectable({providedIn: 'root'})
export class UndoManagerService {
  private static readonly MAX_DONE_COUNT: number = 1000;

  public readonly done: Deque<EditCommand> = new Deque<EditCommand>();
  public readonly undone: EditCommand[] = [];

  public do(editCommand: EditCommand): void {
    editCommand.do();
    this.done.pushRight(editCommand);
    if (this.done.length > UndoManagerService.MAX_DONE_COUNT) {
      this.done.popLeft();
    }
    this.undone.length = 0;
  }

  public undo(count: number = 1): void {
    while (count--) {
      const editCommand = this.done.popRight();
      if (!editCommand) {
        return;
      }
      editCommand.undo();
      this.undone.push(editCommand);
    }
  }

  public redo(count: number = 1): void {
    while (count--) {
      const editCommand = this.undone.pop();
      if (!editCommand) {
        return;
      }
      editCommand.do();
      this.done.pushRight(editCommand);
    }
  }
}
