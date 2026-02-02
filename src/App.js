import React, { useState, useRef } from 'react';
import './App.css';
import Todo from './todo';

function App() {
  const [todos, setTodos] = useState([

  ]);

  const [selectedTodoId, setSelectedTodoId] = useState(2);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTodoName, setNewTodoName] = useState("");
  const [createError, setCreateError] = useState("");
  const createInputRef = useRef(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [todoToUpdate, setTodoToUpdate] = useState(null);
  const [updateTodoName, setUpdateTodoName] = useState("");
  const [updateError, setUpdateError] = useState("");
  const updateInputRef = useRef(null);

  const handleTodoClick = (id) => {
    setSelectedTodoId(id);
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, status: todo.status === 'done' ? 'new' : 'done' };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setNewTodoName("");
    setCreateError("");
    setTimeout(() => { if(createInputRef.current) createInputRef.current.focus(); }, 100);
  };

  const handleCreateTodo = () => {
    if (!newTodoName.trim()) {
      setCreateError("Please enter todo name!!");
      return;
    }
    const newTodo = {
      id: Date.now(),
      name: newTodoName,
      status: "new"
    };
    setTodos([...todos, newTodo]);
    setShowCreateModal(false);
  };

  const handleDeleteClick = (todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      setTodos(todos.filter(t => t.id !== todoToDelete.id));
      if (selectedTodoId === todoToDelete.id) setSelectedTodoId(null);
      setShowDeleteModal(false);
      setTodoToDelete(null);
    }
  };

  const handleEditClick = (todo) => {
    setTodoToUpdate(todo);
    setUpdateTodoName(todo.name);
    setUpdateError("");
    setShowUpdateModal(true);
    setTimeout(() => { if(updateInputRef.current) updateInputRef.current.focus(); }, 100);
  };

  const handleUpdateTodo = () => {
    if (!todoToUpdate) return;

    if (!updateTodoName.trim()) {
      setUpdateError("Please enter todo name!!");
      return;
    }

    if (updateTodoName === todoToUpdate.name) {
      setShowUpdateModal(false);
      return;
    }

    const newTodos = todos.map(t => {
      if (t.id === todoToUpdate.id) {
        return { ...t, name: updateTodoName };
      }
      return t;
    });

    setTodos(newTodos);
    setShowUpdateModal(false);
    setTodoToUpdate(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (filterStatus !== 'all' && todo.status !== filterStatus) return false;
    if (searchKeyword && !todo.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="app-container">
      <div className="todo-box">
        <h1 className="todo-title">TODO</h1>

        <div className="input-row">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Input search key" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button className="btn btn-create" onClick={handleOpenCreateModal}>Create</button>
        </div>

        <div className="filter-row">
          {['all', 'done', 'new'].map(status => (
            <button 
              key={status}
              className={`btn-filter ${filterStatus === status ? 'active' : ''}`} 
              onClick={() => setFilterStatus(status)}
            >
              {status === 'new' ? 'In-progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <Todo 
              key={todo.id}
              todo={todo}
              isSelected={todo.id === selectedTodoId}
              onClick={handleTodoClick}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
            />
          ))}
           {filteredTodos.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>No todos found</p>}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create new todo</h3>
            <input 
              ref={createInputRef}
              type="text" 
              className={`modal-input ${createError ? 'error' : ''}`}
              placeholder="Enter todo..."
              value={newTodoName}
              onChange={(e) => { setNewTodoName(e.target.value); setCreateError(""); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateTodo(); }}
            />
            {createError && <span className="error-msg">{createError}</span>}
            <div className="modal-actions">
              <button className="btn btn-create" onClick={handleCreateTodo}>Create</button>
              <button className="btn btn-close" onClick={() => setShowCreateModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete this todo</h3>
            <p>Are you sure you want to delete this todo?</p>
            <p style={{marginBottom: '20px'}}>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-delete" onClick={handleConfirmDelete}>Delete</button>
              <button className="btn btn-close" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update todo</h3>
            <input 
              ref={updateInputRef}
              type="text" 
              className={`modal-input ${updateError ? 'error' : ''}`}
              value={updateTodoName}
              onChange={(e) => { setUpdateTodoName(e.target.value); setUpdateError(""); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateTodo(); }}
            />
            {updateError && <span className="error-msg">{updateError}</span>}
            <div className="modal-actions">
              <button className="btn btn-create" onClick={handleUpdateTodo}>Save</button>
              <button className="btn btn-close" onClick={() => setShowUpdateModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
