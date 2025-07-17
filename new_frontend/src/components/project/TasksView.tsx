import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { List, Kanban, Calendar, BarChart3, Clock, Users, Filter, Plus } from "lucide-react";
import { TaskList } from "./TaskList";
import { TaskKanban } from "./TaskKanban";
import { TaskCalendar } from "./TaskCalendar";
import { TaskGantt } from "./TaskGantt";
import { TaskTimeline } from "./TaskTimeline";
import { TaskWorkload } from "./TaskWorkload";
import { TaskFilter } from "./TaskFilter";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { Task, ViewFilter } from "@/types/project";

// Enhanced mock data with new fields
const mockAllTasks: Task[] = [
  {
    id: "1",
    title: "Inspection des équipements UPS",
    description: "Vérification complète des systèmes UPS",
    projectId: "1",
    assignedTo: "user1",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-02-15",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
    estimatedHours: 8,
    actualHours: 5,
    tags: ["maintenance", "urgent"],
    dependencies: ["2"]
  },
  {
    id: "2",
    title: "Remplacement des batteries",
    description: "Changement des batteries défectueuses",
    projectId: "1",
    assignedTo: "user2",
    priority: "medium",
    status: "todo",
    dueDate: "2024-02-20",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
    estimatedHours: 4,
    tags: ["hardware"]
  },
  {
    id: "3",
    title: "Test du système DC",
    description: "Tests complets après migration",
    projectId: "2",
    assignedTo: "user1",
    priority: "low",
    status: "completed",
    dueDate: "2024-02-10",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
    estimatedHours: 6,
    actualHours: 7,
    tags: ["testing"]
  },
  {
    id: "4",
    title: "Documentation technique",
    description: "Mise à jour de la documentation",
    projectId: "3",
    assignedTo: "user3",
    priority: "medium",
    status: "todo",
    dueDate: "2024-02-25",
    createdAt: "2024-01-30",
    updatedAt: "2024-01-30",
    estimatedHours: 3,
    tags: ["documentation"]
  }
];

interface TasksViewProps {
  projectId?: string;
}

export function TasksView({ projectId }: TasksViewProps) {
  const [activeView, setActiveView] = useState<string>("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ViewFilter>({});
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const filteredTasks = projectId 
    ? mockAllTasks.filter(task => task.projectId === projectId)
    : mockAllTasks;

  const viewTabs = [
    { value: "list", label: "Liste", icon: List },
    { value: "kanban", label: "Kanban", icon: Kanban },
    { value: "calendar", label: "Calendrier", icon: Calendar },
    { value: "gantt", label: "Gantt", icon: BarChart3 },
    { value: "timeline", label: "Timeline", icon: Clock },
    { value: "workload", label: "Charge", icon: Users }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
        <Button onClick={() => setCreateTaskOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {showFilters && (
        <TaskFilter filters={filters} onFiltersChange={setFilters} />
      )}

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {viewTabs.map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="list">
          <TaskList tasks={filteredTasks} showProject={!projectId} />
        </TabsContent>

        <TabsContent value="kanban">
          <TaskKanban tasks={filteredTasks} />
        </TabsContent>

        <TabsContent value="calendar">
          <TaskCalendar tasks={filteredTasks} />
        </TabsContent>

        <TabsContent value="gantt">
          <TaskGantt tasks={filteredTasks} />
        </TabsContent>

        <TabsContent value="timeline">
          <TaskTimeline tasks={filteredTasks} />
        </TabsContent>

        <TabsContent value="workload">
          <TaskWorkload tasks={filteredTasks} />
        </TabsContent>
      </Tabs>

      <CreateTaskDialog 
        open={createTaskOpen} 
        onOpenChange={setCreateTaskOpen}
        projectId={projectId}
      />
    </div>
  );
}
