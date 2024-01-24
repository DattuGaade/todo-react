import classes from "./Task.module.css";

const Task = ({ title, description, date, id, handleRemove }) => {
  const removeHandler = () => {
    if (handleRemove) {
      handleRemove(id);
    }
  };
  return (
    <div className={classes.todoContainer}>
      <span className={classes.closeButton} onClick={removeHandler} title="Remove Item">
        X
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {date && <p>{new Date(date).toLocaleString()}</p>}
    </div>
  );
};

export default Task;
