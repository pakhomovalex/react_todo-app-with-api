import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
  editTodo?: boolean;
  setEditTodo: (id: number) => void;
  isTempTodo?: boolean;
  isDeleteing?: boolean;
  isUpdating?: boolean;
  handleDelete: (id: number) => void;
  handleUpdating: () => void;
  todoId?: number;
  updateTodoStatus: (todo: Todo) => void;
  setError: () => void;
  setUpdateError: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editTodo,
  setEditTodo,
  isTempTodo = false,
  isDeleteing = false,
  isUpdating,
  handleDelete,
  handleUpdating,
  todoId,
  updateTodoStatus,
  setError,
  setUpdateError,
}) => {
  const { title, completed, id } = todo;
  let currentTitle = title;

  const [newTitle, setNewTitle] = useState(title);

  const titleFieldForm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFieldForm.current && editTodo) {
      titleFieldForm.current.focus();
    }
  }, [editTodo]);

  function submitUpdate() {
    if (newTitle.trim() === '') {
      handleDelete(id);
    }

    if (newTitle === currentTitle) {
      setEditTodo(0);
    }

    handleUpdating();

    updateTodo(todo, { title: newTitle })
      .then(() => {
        setEditTodo(0);
        currentTitle = newTitle;
      })
      .catch(() => {
        setError();
        setUpdateError();
      })
      .finally(() => {
        handleUpdating();
      });
  }

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submitUpdate();
  };

  const handleOnBlur = () => {
    submitUpdate();
  };

  const escFunction = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(currentTitle);
      setEditTodo(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={() => {
        if (!editTodo) {
          setEditTodo(id);
        }
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => updateTodoStatus(todo)}
        />
      </label>

      {editTodo && todoId === id ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleFieldForm}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleOnBlur}
            onKeyUp={escFunction}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {newTitle.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isTempTodo ||
            (isDeleteing && todoId === id) ||
            (isUpdating && todoId === id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
