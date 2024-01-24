import { useCallback, useEffect, useRef, useState } from "react";

import Task from "./Task";
import classes from "./App.module.css";

function App() {
  const formRef = useRef();
  const [todos, setTodos] = useState([]);

  const getTodos = useCallback(async () => {
    try {
      const result = await fetch(`${process.env.REACT_APP_API_URL}todos`);
      const resultData = await result.json();
      if (resultData.success) {
        setTodos(
          resultData.data.map((item) => ({
            ...item,
            id: item._id,
          }))
        );
      }
    } catch (error) {
      console.log("Error getting todos: ", error);
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (!formData.get("title")) {
      alert("Title is required");
      return;
    }

    try {
      const result = await fetch(`${process.env.REACT_APP_API_URL}todos`, {
        method: "POST",
        body: JSON.stringify({
          id: todos.length ? todos[todos.length - 1].id + 1 : 1,
          title: formData.get("title"),
          description: formData.get("description"),
          date: formData.get("date"),
        }),
        headers: new Headers({ "content-type": "application/json" }),
      });
      const resultData = await result.json();
      if (resultData.success) {
        formRef.current.reset();
        getTodos();
      }
    } catch (error) {
      console.log("Error adding todo: ", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}todos/${id}`,
        {
          method: "DELETE",
        }
      );
      const resultData = await result.json();
      if (resultData.success) {
        getTodos();
      }
    } catch (error) {
      console.log("Error deleting todo: ", error);
    }
  };

  return (
    <div className={classes.App}>
      <h1>ToDo List</h1>
      <form ref={formRef} className={classes.form} onSubmit={submitHandler}>
        <div className={classes.inputContainer}>
          <label htmlFor="title">Title</label>
          <input name="title" placeholder="Enter title..." />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="description">Description</label>
          <textarea name="description" placeholder="Enter description..." />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="date">Scheduled Date</label>
          <input name="date" type="datetime-local" />
        </div>

        <button className={classes.submitButton}>Add Task</button>
      </form>
      <div className={classes.listContainer}>
        {todos?.map((todoItem) => (
          <Task key={todoItem.id} {...todoItem} handleRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
}

export default App;
