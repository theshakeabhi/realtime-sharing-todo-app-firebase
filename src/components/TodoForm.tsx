import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase/config";
import {
  Box,
  Typography,
  TextField,
  Paper,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Task = {
  id: string;
  name: string;
  createdBy: string;
  sharedWith: any[];
};

type Todo = {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
};

export default function TodoForm() {
  const { currentUser } = useAuth();

  // Task state
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Todo state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // 1️⃣ Load tasks in real-time
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "tasks"),
      where("createdBy", "==", currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setTasks(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Task, "id">),
        }))
      );
      // if the selected task was deleted, clear it
      if (selectedTaskId && !snap.docs.find((d) => d.id === selectedTaskId)) {
        setSelectedTaskId(null);
      }
    });
    return () => unsub();
  }, [currentUser, selectedTaskId]);

  // 2️⃣ Load todos for selected task
  useEffect(() => {
    if (!selectedTaskId) {
      setTodos([]);
      return;
    }
    const path = collection(db, "tasks", selectedTaskId, "todos");
    const unsub = onSnapshot(path, (snap) => {
      setTodos(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Todo, "id">),
        }))
      );
    });
    return () => unsub();
  }, [selectedTaskId]);

  // 3️⃣ Create a new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !taskTitle.trim()) return;
    try {
      const ref = await addDoc(collection(db, "tasks"), {
        name: taskTitle,
        createdBy: currentUser.uid,
        sharedWith: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTaskTitle("");
      setSelectedTaskId(ref.id);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // 4️⃣ Delete a task and all its todos
  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;
    try {
      const todosSnap = await getDocs(collection(db, "tasks", taskId, "todos"));
      const batch = writeBatch(db);
      todosSnap.forEach((td) =>
        batch.delete(doc(db, "tasks", taskId, "todos", td.id))
      );
      batch.delete(doc(db, "tasks", taskId));
      await batch.commit();
      if (selectedTaskId === taskId) setSelectedTaskId(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // 5️⃣ Add a new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !newTodo.trim()) return;
    try {
      await addDoc(collection(db, "tasks", selectedTaskId, "todos"), {
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

  // 6️⃣ Toggle a todo’s status
  const handleToggleTodo = async (todo: Todo) => {
    if (!selectedTaskId) return;
    try {
      await updateDoc(doc(db, "tasks", selectedTaskId, "todos", todo.id), {
        status: todo.status === "completed" ? "pending" : "completed",
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  // 7️⃣ Delete a single todo
  const handleDeleteTodo = async (todoId: string) => {
    if (!selectedTaskId) return;
    try {
      await deleteDoc(doc(db, "tasks", selectedTaskId, "todos", todoId));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (!currentUser) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Task creation */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" mb={2}>
          Your To-Do Lists
        </Typography>
        <form onSubmit={handleCreateTask}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="New list name…"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Task list */}
      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        {tasks.length === 0 && (
          <Typography color="text.secondary" align="center">
            No lists yet. Create one above.
          </Typography>
        )}
        {tasks.map((t) => (
          <Card
            key={t.id}
            variant={t.id === selectedTaskId ? "elevation" : "outlined"}
            sx={{
              cursor: "pointer",
              p: 1,
              bgcolor:
                t.id === selectedTaskId
                  ? "action.selected"
                  : "background.paper",
            }}
            onClick={() => setSelectedTaskId(t.id)}
          >
            <CardContent
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h6">{t.name}</Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(t.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Inline todo editor */}
      {selectedTaskId && (
        <Box>
          <Typography variant="h6" mb={1}>
            Todos for “{tasks.find((t) => t.id === selectedTaskId)?.name}”
          </Typography>

          {/* Add todo */}
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

          {/* Todo list */}
          <List sx={{ mt: 2 }}>
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
      )}
    </Box>
  );
}
