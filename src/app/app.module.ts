import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {TodoListComponent} from './todo-list/todo-list.component';
import {TodoItemComponent} from './todo-item/todo-item.component';
import {TodoService, TO_DO_STORAGE} from './todo.service';
import {FormsModule} from '@angular/forms';
import {LOCAL_STORAGE} from 'ngx-webstorage-service';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [TodoService,
    { provide: TO_DO_STORAGE, useExisting: LOCAL_STORAGE }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
