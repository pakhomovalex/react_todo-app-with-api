import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isDeleteing: boolean;
  isUpdating: boolean;
  handleDelete: (id: number) => void;
  todoForDelete: number;
  updateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  isDeleteing,
  isUpdating,
  handleDelete,
  todoForDelete: todoId,
  updateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        isDeleteing={isDeleteing}
        isUpdating={isUpdating}
        handleDelete={handleDelete}
        todoId={todoId}
        updateTodo={updateTodo}
      />
    ))}
    {tempTodo !== null && (
      <TodoItem
        todo={tempTodo}
        isTempTodo
        handleDelete={handleDelete}
        updateTodo={updateTodo}
      />
    )}
  </section>
);
