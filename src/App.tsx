/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatusOnServer,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export enum Status {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.all);
  const [id, setId] = useState<number>(-1);

  const [hasError, setHasError] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<boolean>(false);
  const [todosError, setTodosError] = useState<boolean>(false);
  const [addError, setAddError] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<boolean>(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isDeleteing, setIsDeleteing] = useState<boolean>(false);
  const [isUpdateing, setIsUpdateing] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setTodosError(true);
        setHasError(true);
      });
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [isSubmiting, isDeleteing]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodosByStatus = todos.filter(todo => {
    if (status === Status.active) {
      return !todo.completed;
    }

    if (status === Status.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = () => {
    if (todos.find(todo => todo.completed)) {
      return false;
    }

    return true;
  };

  function areTodosCompleted() {
    if (todos.find(todo => !todo.completed)) {
      return false;
    }

    return true;
  }

  const handleDelete = () => setIsDeleteing(true);

  const clearCompleted = () => {
    handleDelete();

    todos.forEach(todoOnServer => {
      if (todoOnServer.completed) {
        deleteTodo(todoOnServer.id)
          .then(() =>
            setTodos(
              todos.filter(todoFromArr => todoFromArr.completed === false),
            ),
          )
          .catch(() => {
            setTodos([...todos, todoOnServer]);

            setHasError(true);
            setDeleteError(true);
          })
          .finally(() => setIsDeleteing(false));
      }
    });
  };

  const reset = () => setQuery('');

  const handleSetStatus = (newStatus: Status) => setStatus(newStatus);

  const handleSetError = () => setHasError(false);

  const handleSetDelete = (todoId: number) => {
    setIsDeleteing(true);
    setId(todoId);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmiting(true);
    setHasError(false);
    setTitleError(false);
    setAddError(false);

    const todo = {
      id: todos.length,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    if (!query || /^\s+$/.test(query)) {
      setHasError(true);
      setTitleError(true);
      setIsSubmiting(false);

      return;
    }

    addTodo(todo)
      .then(newTodo => {
        setTempTodo(null);
        reset();

        return setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setHasError(true);
        setTempTodo(null);
        setAddError(true);
      })
      .finally(() => {
        return setIsSubmiting(false);
      });

    todo.id = 0;
    setTempTodo(todo);
  };

  function updateTodoStatus(updatedTodo: Todo) {
    setUpdateError(false);
    setIsUpdateing(true);
    setId(updatedTodo.id);

    const newTodo = { ...updatedTodo };

    newTodo.completed = !newTodo.completed;

    updateTodoStatusOnServer(updatedTodo)
      .then(() => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setHasError(true);
        setUpdateError(true);
      })
      .finally(() => setIsUpdateing(false));
  }

  if (hasError) {
    setTimeout(() => setHasError(false), 3000);
  }

  if (isDeleteing) {
    deleteTodo(id)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => {
        setDeleteError(true);
        setHasError(true);
      })
      .finally(() => setIsDeleteing(false));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: areTodosCompleted(),
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={ref}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isSubmiting}
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          filteredTodos={filteredTodosByStatus}
          tempTodo={tempTodo}
          isDeleteing={isDeleteing}
          isUpdating={isUpdateing}
          handleDelete={handleSetDelete}
          todoForDelete={id}
          updateTodo={updateTodoStatus}
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos()}
            status={status}
            setStatus={handleSetStatus}
            clearCompleted={clearCompleted}
            handleSetDelete={handleDelete}
          />
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        setHasError={handleSetError}
        titleError={titleError}
        todosError={todosError}
        addError={addError}
        deleteError={deleteError}
        updateError={updateError}
      />
    </div>
  );
};
