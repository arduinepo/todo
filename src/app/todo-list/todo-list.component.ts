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

  @ViewChild("newTodoInput", {static: false}) newTodoInput: ElementRef;

  constructor(private todoService: TodoService) {  
    todoService.getTodoListDataObserver().subscribe( tdl => this.data = tdl );  
    this.titre = this.data.label;
  }

  ngOnInit() {
  }

  get label(): string {
    return this.data.label;
  }
  
  get items(): TodoItemData[] {
    return this.data.items;
  }
  
  itemDone(item: TodoItemData, done: boolean) {
    this.todoService.setItemsDone( done, item );
  }
  
  itemLabel(item: TodoItemData, label: string) {
    this.todoService.setItemsLabel( label, item );
  }
  
  appendItem(label: string) {
    this.todoService.appendItems( {
      label,
      isDone: false
    } );
  }
  
  removeItem(item: TodoItemData) {
    this.todoService.removeItems(item);
  }
    
  isAllDone(): boolean {
    // return this.items.reduce( (acc, it) => acc && it.isDone, true);
    return this.items.every( it => it.isDone );
  }
  
  toggleAllDone() {
    const done = !this.isAllDone();
    this.todoService.setItemsDone(done, ...this.items);
  }

}
