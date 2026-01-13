/**
 * TaskForm Component
 * Per ARCHITECTURE.md Component Responsibilities - Create/edit task form
 * Per IMPLEMENTATION_PLAN.md T-016
 */

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, Priority } from '../types';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface FormState {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
}

function formatDateForInput(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps): React.ReactElement {
  const isEditing = Boolean(task);

  const [formState, setFormState] = useState<FormState>({
    title: '',
    description: '',
    dueDate: '',
    priority: Priority.MEDIUM,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (task) {
      setFormState({
        title: task.title,
        description: task.description || '',
        dueDate: formatDateForInput(task.dueDate),
        priority: task.priority,
      });
    } else {
      setFormState({
        title: '',
        description: '',
        dueDate: '',
        priority: Priority.MEDIUM,
      });
    }
    setErrors({});
  }, [task]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formState.title.length > 255) {
      newErrors.title = 'Title must be 255 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) return;

    const data: CreateTaskInput | UpdateTaskInput = {
      title: formState.title.trim(),
      description: formState.description.trim() || undefined,
      dueDate: formState.dueDate ? new Date(formState.dueDate).toISOString() : undefined,
      priority: formState.priority,
    };

    onSubmit(data);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} data-testid="task-form">
      <h2 className="task-form__title">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>

      <div className="task-form__field">
        <label htmlFor="title" className="task-form__label">
          Title <span className="task-form__required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
          className={`task-form__input ${errors.title ? 'task-form__input--error' : ''}`}
          placeholder="Enter task title"
          maxLength={255}
          disabled={isLoading}
          data-testid="task-form-title"
        />
        {errors.title && (
          <span className="task-form__error" data-testid="task-form-title-error">
            {errors.title}
          </span>
        )}
      </div>

      <div className="task-form__field">
        <label htmlFor="description" className="task-form__label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          className="task-form__textarea"
          placeholder="Enter task description (optional)"
          rows={3}
          disabled={isLoading}
          data-testid="task-form-description"
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field task-form__field--half">
          <label htmlFor="dueDate" className="task-form__label">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formState.dueDate}
            onChange={handleChange}
            className="task-form__input"
            disabled={isLoading}
            data-testid="task-form-due-date"
          />
        </div>

        <div className="task-form__field task-form__field--half">
          <label htmlFor="priority" className="task-form__label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formState.priority}
            onChange={handleChange}
            className="task-form__select"
            disabled={isLoading}
            data-testid="task-form-priority"
          >
            <option value={Priority.LOW}>Low</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.HIGH}>High</option>
          </select>
        </div>
      </div>

      <div className="task-form__actions">
        <button
          type="button"
          className="task-form__btn task-form__btn--cancel"
          onClick={onCancel}
          disabled={isLoading}
          data-testid="task-form-cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="task-form__btn task-form__btn--submit"
          disabled={isLoading}
          data-testid="task-form-submit"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
