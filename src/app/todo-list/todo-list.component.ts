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

  constructor(private todoService: TodoService) {
    todoService.getTodoListDataObserver().subscribe(tdl => this.data = tdl);
    this.titre = this.data.label;
    this.currentFilter = 'all';
  }

  ngOnInit() {
  }

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
  }

  itemDone(item: TodoItemData, done: boolean) {
    this.todoService.setItemsDone(done, item);
  }

  itemLabel(item: TodoItemData, label: string) {
    this.todoService.setItemsLabel(label, item);
  }

  removeItem(item: TodoItemData) {
    this.todoService.removeItems(item);
  }

  numberLeft(): number {
    return this.data.items.reduce((acc, cur) => acc + (cur.isDone ? 0 : 1), 0);
  }

  removeDone() {
    this.todoService.removeDone();
  }

}
