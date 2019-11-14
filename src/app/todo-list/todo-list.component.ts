import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  titre: string;
  @Input() private data: TodoListData;
  @ViewChild('newTodoInput', {static: false}) newTodoInput: ElementRef;
  _filter: string;

  constructor(private todoService: TodoService) {
    todoService.getTodoListDataObserver().subscribe(tdl => this.data = tdl);
    this.titre = this.data.label;
    this.filter = 'all';
  }

  ngOnInit() {
  }

  get label(): string {
    return this.data.label;
  }

  get items(): TodoItemData[] {
    switch (this._filter) {
      case('all'):
        return this.data.items;
      case('undone'):
        return this.data.items.filter(i => i.isDone === false);
      case('done'):
        return this.data.items.filter(i => i.isDone === true);
    }
  }

  get filter() {
    return this._filter;
  }

  set filter(filter: string) {
    this._filter = filter;
  }

  itemDone(item: TodoItemData, done: boolean) {
    this.todoService.setItemsDone(done, item);
  }

  itemLabel(item: TodoItemData, label: string) {
    this.todoService.setItemsLabel(label, item);
  }

  appendItem(label: string) {
    this.todoService.appendItems({
      label,
      isDone: false
    });
  }

  removeItem(item: TodoItemData) {
    this.todoService.removeItems(item);
  }

  removeDone() {
    this.todoService.removeDone();
  }

  isAllDone(): boolean {
    return this.items.every(it => it.isDone);
  }

  toggleAllDone() {
    const done = !this.isAllDone();
    this.todoService.setItemsDone(done, ...this.items);
  }

  numberLeft(): number {
    return this.data.items.reduce((acc, cur) => acc + (cur.isDone ? 0 : 1), 0);
  }

}
