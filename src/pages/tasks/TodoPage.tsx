import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/config";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Todo = {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
};

export default function TodoPage() {
  const { currentUser } = useAuth();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Load task details
  useEffect(() => {
    if (!taskId || !currentUser) return;

    const fetchTaskName = async () => {
      try {
        const taskDoc = await getDoc(doc(db, "tasks", taskId));
        if (taskDoc.exists()) {
          setTaskName(taskDoc.data().name);
        } else {
          // Task doesn't exist, navigate back to tasks page
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        navigate("/");
      }
    };

    fetchTaskName();
  }, [taskId, currentUser, navigate]);

  // Load todos for selected task
  useEffect(() => {
    if (!taskId) {
      setTodos([]);
      return;
    }

    const path = collection(db, "tasks", taskId, "todos");
    const unsub = onSnapshot(path, (snap) => {
      setTodos(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Todo, "id">),
        }))
      );
    });

    return () => unsub();
  }, [taskId]);

  // Add a new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !newTodo.trim()) return;

    try {
      await addDoc(collection(db, "tasks", taskId, "todos"), {
        name: newTodo,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Toggle a todo's status
  const handleToggleTodo = async (todo: Todo) => {
    if (!taskId) return;

    try {
      await updateDoc(doc(db, "tasks", taskId, "todos", todo.id), {
        status: todo.status === "completed" ? "pending" : "completed",
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  // Delete a single todo
  const handleDeleteTodo = async (todoId: string) => {
    if (!taskId) return;

    try {
      await deleteDoc(doc(db, "tasks", taskId, "todos", todoId));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (!currentUser || !taskId) return null;

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <IconButton onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">{taskName}</Typography>
        </Box>

        {/* Add todo form */}
        <form onSubmit={handleAddTodo} style={{ display: "flex", gap: 8 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="New todo…"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Add
          </Button>
        </form>
      </Paper>

      {/* Todo list */}
      <List sx={{ mt: 2 }}>
        {todos.length === 0 && (
          <Typography color="text.secondary" align="center" py={2}>
            No todos yet. Add one above.
          </Typography>
        )}
        {todos.map((todo) => (
          <ListItem key={todo.id} divider>
            <Checkbox
              edge="start"
              checked={todo.status === "completed"}
              onChange={() => handleToggleTodo(todo)}
            />
            <ListItemText
              primary={todo.name}
              sx={{
                textDecoration:
                  todo.status === "completed" ? "line-through" : "none",
              }}
            />
            <div>
              <IconButton
                size="small"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
