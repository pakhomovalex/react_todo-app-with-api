import React from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean;
  setHasError: () => void;
  titleError: boolean;
  todosError: boolean;
  addError: boolean;
  deleteError: boolean;
  updateError: boolean;
};

export const ErrorNotification: React.FC<Props> = ({
  hasError,
  setHasError,
  titleError,
  todosError,
  addError,
  deleteError,
  updateError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={setHasError}
    />
    {todosError && (
      <>
        Unable to load todos
        <br />
      </>
    )}
    {titleError && (
      <>
        Title should not be empty
        <br />
      </>
    )}
    {addError && (
      <>
        Unable to add a todo
        <br />
      </>
    )}
    {deleteError && (
      <>
        Unable to delete a todo
        <br />
      </>
    )}
    {updateError && (
      <>
        Unable to update a todo
        <br />
      </>
    )}
  </div>
);
