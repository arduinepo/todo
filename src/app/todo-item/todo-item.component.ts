import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() private data: TodoItemData;

  constructor(private todoService: TodoService) {

  }

  ngOnInit() {
  }

  get label(): string {
    return this.data.label;
  }

  get done(): boolean {
    return this.data.isDone;
  }

  setDone(done: boolean) {
    this.data.isDone = done;
  }

  remove() {
    this.todoService.removeItems(this.data);
  }

}
