import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  @Input()
  private data: TodoListData;
  private titre: string;
  private currentFilter: string;
  private dataUndoArray: Array<TodoItemData[]> = [];
  private dataRedoArray: Array<TodoItemData[]> = [];

  constructor(private todoService: TodoService) {
    todoService.getTodoListDataObserver().subscribe(tdl => this.data = tdl);
    this.titre = this.data.label;
    this.currentFilter = 'all';
  }

  ngOnInit() {
  }

  // undo() {
  //   console.log('fdsfds');
  //   if (this.data.items.length !== 0) {
  //     this.dataRedoArray.push(Array.from(this.data.items));
  //     this.todoService.update(Array.from(this.dataUndoArray.pop()));
  //   }
  // }
  //
  // redo() {
  //   if (this.dataRedoArray.length !== 0) {
  //     this.dataUndoArray.push(Array.from(this.data.items));
  //     this.todoService.update(Array.from(this.dataRedoArray.pop()));
  //   }
  // }
  //
  // saveCurrentState() {
  //     this.dataUndoArray.push(Array.from(this.data.items));
  // }

  changeFilter(filter) {
    this.currentFilter = filter;
  }

  get label(): string {
    return this.data ? this.data.label : '';
  }

  get items(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }

  filteredItems() {
    switch (this.currentFilter) {
      case('all'):
        return this.data ? this.data.items : [];
        break;
      case('active'):
        return this.data ? this.data.items.filter(i => i.isDone === false) : [];
        break;
      case('completed'):
        return this.data ? this.data.items.filter(i => i.isDone === true) : [];
        break;
    }
  }

  appendItem(label: string) {
    this.todoService.appendItems(
      {
        label,
        isDone: false
      });
//    this.saveCurrentState();
  }

  itemDone(item: TodoItemData, done: boolean) {
    this.todoService.setItemsDone(done, item);
//    this.saveCurrentState();
  }

  itemLabel(item: TodoItemData, label: string) {
    this.todoService.setItemsLabel(label, item);
 //   this.saveCurrentState();
  }

  removeItem(item: TodoItemData) {
    this.todoService.removeItems(item);
 //   this.saveCurrentState();
  }

  numberLeft(): number {
    return this.data.items.reduce((acc, cur) => acc + (cur.isDone ? 0 : 1), 0);
  }

  removeDone() {
    this.todoService.removeDone();
  //  this.saveCurrentState();
  }

}
