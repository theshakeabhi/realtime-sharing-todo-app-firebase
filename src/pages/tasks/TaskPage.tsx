import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/config";
import {
  Box,
  Typography,
  TextField,
  Paper,
  IconButton,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Task = {
  id: string;
  name: string;
  createdBy: string;
  sharedWith: string[];
};

export default function TaskPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Task state
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [deletingTaskIds, setDeletingTaskIds] = useState<string[]>([]);

  // Load tasks in real-time
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
    });
    return () => unsub();
  }, [currentUser]);

  // Create a new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !taskTitle.trim()) return;
    setIsCreating(true);
    try {
      const ref = await addDoc(collection(db, "tasks"), {
        name: taskTitle,
        createdBy: currentUser.uid,
        sharedWith: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTaskTitle("");
      navigate(`/${ref.id}`);
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setIsCreating(false);
    }
  };

  // Delete a task and all its todos
  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;
    setDeletingTaskIds((prev) => [...prev, taskId]);
    try {
      const todosSnap = await getDocs(collection(db, "tasks", taskId, "todos"));
      const batch = writeBatch(db);
      todosSnap.forEach((td) =>
        batch.delete(doc(db, "tasks", taskId, "todos", td.id))
      );
      batch.delete(doc(db, "tasks", taskId));
      await batch.commit();
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setDeletingTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  if (!currentUser) return null;

  console.log(tasks);

  return (
    <Box sx={{ maxWidth: "100%" }}>
      {/* Task creation */}
      <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#FAFAFA" }}>
        <form onSubmit={handleCreateTask}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="New list name…"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
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
            variant="outlined"
            sx={{
              cursor: "pointer",
              p: 1,
              bgcolor: "background.paper",
            }}
            onClick={() => navigate(`/${t.id}`)}
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
                disabled={deletingTaskIds.includes(t.id)}
              >
                {deletingTaskIds.includes(t.id) ? (
                  <CircularProgress size={16} />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
