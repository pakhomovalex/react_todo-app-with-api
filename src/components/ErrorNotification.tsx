import React from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean;
  setHasError: () => void;
  errors: {
    titleError: boolean;
    todosError: boolean;
    addError: boolean;
    deleteError: boolean;
    updateError: boolean;
  };
};

export const ErrorNotification: React.FC<Props> = ({
  hasError,
  setHasError,
  errors,
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
    {errors.todosError && (
      <>
        Unable to load todos
        <br />
      </>
    )}
    {errors.titleError && (
      <>
        Title should not be empty
        <br />
      </>
    )}
    {errors.addError && (
      <>
        Unable to add a todo
        <br />
      </>
    )}
    {errors.deleteError && (
      <>
        Unable to delete a todo
        <br />
      </>
    )}
    {errors.updateError && (
      <>
        Unable to update a todo
        <br />
      </>
    )}
  </div>
);
