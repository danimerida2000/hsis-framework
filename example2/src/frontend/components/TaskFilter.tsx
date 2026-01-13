/**
 * TaskFilter Component
 * Per ARCHITECTURE.md Component Responsibilities - Filter and sort controls
 * Per IMPLEMENTATION_PLAN.md T-017
 */

import React, { ChangeEvent } from 'react';
import { TaskStatus, TaskSort } from '../types';

interface TaskFilterProps {
  status: TaskStatus;
  sort: TaskSort;
  total: number;
  onStatusChange: (status: TaskStatus) => void;
  onSortChange: (sort: TaskSort) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const sortOptions: { value: TaskSort; label: string }[] = [
  { value: undefined, label: 'Default (Newest First)' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

export function TaskFilter({
  status,
  sort,
  total,
  onStatusChange,
  onSortChange,
}: TaskFilterProps): React.ReactElement {
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onStatusChange(e.target.value as TaskStatus);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    onSortChange(value === '' ? undefined : (value as TaskSort));
  };

  return (
    <div className="task-filter" data-testid="task-filter">
      <div className="task-filter__count">
        <span className="task-filter__total">{total}</span>
        <span className="task-filter__label">
          {total === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="task-filter__controls">
        <div className="task-filter__control">
          <label htmlFor="status-filter" className="task-filter__control-label">
            Status:
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={handleStatusChange}
            className="task-filter__select"
            data-testid="task-filter-status"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="task-filter__control">
          <label htmlFor="sort-filter" className="task-filter__control-label">
            Sort by:
          </label>
          <select
            id="sort-filter"
            value={sort || ''}
            onChange={handleSortChange}
            className="task-filter__select"
            data-testid="task-filter-sort"
          >
            {sortOptions.map(option => (
              <option key={option.value || 'default'} value={option.value || ''}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
