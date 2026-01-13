/**
 * TaskList Component
 * Per ARCHITECTURE.md Component Responsibilities - Display tasks, handle toggle/delete
 * Per IMPLEMENTATION_PLAN.md T-015
 */

import React from 'react';
import { Task, Priority } from '../types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const priorityColors: Record<Priority, string> = {
  [Priority.HIGH]: '#dc3545',
  [Priority.MEDIUM]: '#ffc107',
  [Priority.LOW]: '#28a745',
};

const priorityLabels: Record<Priority, string> = {
  [Priority.HIGH]: 'High',
  [Priority.MEDIUM]: 'Medium',
  [Priority.LOW]: 'Low',
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(dateString: string | null, isCompleted: boolean): boolean {
  if (!dateString || isCompleted) return false;
  return new Date(dateString) < new Date();
}

function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps): React.ReactElement {
  const overdue = isOverdue(task.dueDate, task.isCompleted);

  return (
    <div
      className={`task-item ${task.isCompleted ? 'task-item--completed' : ''} ${overdue ? 'task-item--overdue' : ''}`}
      data-testid={`task-item-${task.id}`}
    >
      <div className="task-item__checkbox">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={onToggle}
          aria-label={`Mark "${task.title}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
        />
      </div>

      <div className="task-item__content">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
        <div className="task-item__meta">
          <span
            className="task-item__priority"
            style={{ backgroundColor: priorityColors[task.priority] }}
          >
            {priorityLabels[task.priority]}
          </span>
          {task.dueDate && (
            <span className={`task-item__due-date ${overdue ? 'task-item__due-date--overdue' : ''}`}>
              Due: {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <button
          className="task-item__btn task-item__btn--edit"
          onClick={onEdit}
          aria-label={`Edit "${task.title}"`}
        >
          Edit
        </button>
        <button
          className="task-item__btn task-item__btn--delete"
          onClick={onDelete}
          aria-label={`Delete "${task.title}"`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function TaskList({
  tasks,
  isLoading,
  error,
  onToggle,
  onDelete,
  onEdit,
}: TaskListProps): React.ReactElement {
  if (isLoading && tasks.length === 0) {
    return (
      <div className="task-list task-list--loading" data-testid="task-list-loading">
        <div className="task-list__spinner">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list task-list--error" data-testid="task-list-error">
        <div className="task-list__error-message">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty" data-testid="task-list-empty">
        <div className="task-list__empty-message">
          <p>No tasks found. Create one to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list" data-testid="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
          onEdit={() => onEdit(task)}
        />
      ))}
    </div>
  );
}
