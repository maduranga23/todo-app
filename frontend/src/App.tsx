import { useEffect, useState } from "react";
import type { FormEvent } from "react";

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}


const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tasks?limit=5`);
      if (!res.ok) throw new Error("Failed to load tasks");
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 15000); 
    return () => clearInterval(interval);
  }, []);


  const addTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      setTitle("");
      setDescription("");
      await loadTasks();
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    }
  };

 
  const completeTask = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/complete`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to complete task");
      await loadTasks();
    } catch (err) {
      console.error(err);
      alert("Error marking task done");
    }
  };

  return (
   <div className="min-h-screen bg-white p-8 font-sans">
  <h1 className="text-3xl font-bold text-center mb-8">To-Do List</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
   
    <div className="rounded-2xl bg-white p-6 h-full border border-gray-950/5">
      <h2 className="text-xl font-semibold mb-4">Add Task</h2>
      <form onSubmit={addTask} className="flex flex-col space-y-4">
        <input
          className="border rounded-2xl border-gray-950/5 p-4 focus:ring-0"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border rounded-2xl border-gray-950/5 p-4 focus:ring-0"
          placeholder="Task description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="pointer-events-auto gap-2 inline-flex justify-center rounded-full text-sm/6 font-semibold bg-gray-950 text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 px-4 py-2"
        >
          Add Task
        </button>
      </form>
    </div>

    {}
    <div className="rounded-2xl bg-white p-6 h-full border border-gray-950/5">
      <h2 className="text-xl font-semibold mb-4">Latest Tasks</h2>
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-2xl border-gray-950/5 p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
              </div>
              <button
                className="pointer-events-auto gap-2 inline-flex justify-center rounded-full text-sm/6 font-semibold bg-gray-950 text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 px-4 py-2"
                onClick={() => completeTask(task.id)}
              >
                Done
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default App;
