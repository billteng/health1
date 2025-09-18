import React from 'react'

type Props = {
  onNew: () => void
  onSearchMode: () => void
  onEditMode: () => void
  onDelete: () => void
  editMode?: boolean
}

export default function Sidebar({ onNew, onSearchMode, onEditMode, onDelete, editMode }: Props) {
  return (
    <aside className="sidebar" aria-label="Main menu">
      <div className="logo">Patient Suite</div>

      <nav aria-label="Primary">
        <ul className="menu" role="menu">
          <li role="none">
            <button
              role="menuitem"
              className="menu-item"
              onClick={onNew}
              title="Create new patient"
              aria-label="Create new patient"
            >
              <span className="menu-icon" aria-hidden>＋</span>
              <span className="menu-label">New Patient</span>
            </button>
          </li>

          <li role="none">
            <button
              role="menuitem"
              className="menu-item"
              onClick={onSearchMode}
              title="Focus search"
              aria-label="Search patients"
            >
              <span className="menu-icon" aria-hidden>🔎</span>
              <span className="menu-label">Search</span>
            </button>
          </li>

          <li role="none">
            <button
              role="menuitem"
              className={`menu-item ${editMode ? 'active' : ''}`}
              onClick={onEditMode}
              aria-pressed={!!editMode}
              title="Toggle edit mode"
            >
              <span className="menu-icon" aria-hidden>✏️</span>
              <span className="menu-label">Edit</span>
              {editMode && <span className="badge" aria-hidden>on</span>}
            </button>
          </li>

          <li role="none">
            <button
              role="menuitem"
              className="menu-item danger"
              onClick={onDelete}
              title="Delete selected patient"
              aria-label="Delete selected patient"
            >
              <span className="menu-icon" aria-hidden>🗑️</span>
              <span className="menu-label">Delete</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="muted" style={{ marginTop: 20 }}>Manage patients — quickly add, search, edit, or remove records.</div>
    </aside>
  )
}
