import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../hooks/useAuth";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface Todo {
  id: string;
  name: string;
  status: "pending" | "completed";
  priority: string;
}

interface Task {
  id: string;
  name: string;
  createdBy: string;
}

export default function TodoListPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [todoName, setTodoName] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<Task | null>(null);

  // Fetch task details
  useEffect(() => {
    if (!taskId || !currentUser) return;

    const fetchTask = async () => {
      try {
        const taskDoc = await getDoc(doc(db, "tasks", taskId));
        if (taskDoc.exists()) {
          setTask({ id: taskDoc.id, ...taskDoc.data() } as Task);
        } else {
          console.error("Task not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [taskId, currentUser, navigate]);

  // Add a new todo to selected task
  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskId || !currentUser || !todoName.trim()) return;

    try {
      await addDoc(collection(db, `tasks/${taskId}/todos`), {
        name: todoName,
        status: "pending",
        priority: "medium",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setTodoName("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Real-time sync of todos for selected task
  useEffect(() => {
    if (!taskId) return;

    const q = collection(db, `tasks/${taskId}/todos`);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todoData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      setTodos(todoData);
    });

    return () => unsubscribe();
  }, [taskId]);

  if (!currentUser) return null;

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {task?.name || "Task Items"}
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Back to Tasks
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleAddTodo}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              value={todoName}
              onChange={(e) => setTodoName(e.target.value)}
              placeholder="Add new item"
              variant="outlined"
              size="small"
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </form>
      </Paper>

      <Typography variant="h6" component="h2" gutterBottom>
        Items
      </Typography>

      <Paper>
        <List>
          {todos.length === 0 ? (
            <ListItem>
              <ListItemText primary="No items added yet" />
            </ListItem>
          ) : (
            todos.map((todo) => (
              <ListItem
                key={todo.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <IconButton edge="start" sx={{ mr: 2 }}>
                  {todo.status === "completed" ? (
                    <CheckCircleIcon color="primary" />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </IconButton>
                <ListItemText primary={todo.name} />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}
