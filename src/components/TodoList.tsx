import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  editTodo: boolean;
  setEditTodo: (id: number) => void;
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isDeleteing: boolean;
  isUpdating: boolean;
  handleDelete: (id: number) => void;
  handleUpdating: () => void;
  todoId: number;
  updateTodo: (todo: Todo) => void;
  setError: () => void;
  setUpdateError: () => void;
};

export const TodoList: React.FC<Props> = ({
  editTodo,
  setEditTodo,
  filteredTodos,
  tempTodo,
  isDeleteing,
  isUpdating,
  handleDelete,
  handleUpdating,
  todoId: todoId,
  updateTodo,
  setError,
  setUpdateError,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        todo={todo}
        editTodo={editTodo}
        setEditTodo={setEditTodo}
        key={todo.id}
        isDeleteing={isDeleteing}
        isUpdating={isUpdating}
        handleDelete={handleDelete}
        handleUpdating={handleUpdating}
        todoId={todoId}
        updateTodoStatus={updateTodo}
        setError={setError}
        setUpdateError={setUpdateError}
      />
    ))}
    {tempTodo !== null && (
      <TodoItem
        todo={tempTodo}
        isTempTodo
        handleDelete={handleDelete}
        handleUpdating={handleUpdating}
        updateTodoStatus={updateTodo}
        setEditTodo={setEditTodo}
        setError={setError}
        setUpdateError={setUpdateError}
      />
    )}
  </section>
);
