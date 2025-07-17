
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Clock, Wrench, CheckCircle, AlertTriangle, 
  TrendingUp, Users, Calendar 
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersStatsProps {
  workOrders: WorkOrder[];
}

export function WorkOrdersStats({ workOrders }: WorkOrdersStatsProps) {
  const stats = {
    total: workOrders.length,
    pending: workOrders.filter(wo => wo.status === "pending").length,
    inProgress: workOrders.filter(wo => wo.status === "in-progress").length,
    completed: workOrders.filter(wo => wo.status === "completed").length,
    urgent: workOrders.filter(wo => wo.priority === "urgent").length,
    thisWeek: workOrders.filter(wo => {
      const created = new Date(wo.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length
  };

  const statsCards = [
    {
      title: "Total",
      value: stats.total,
      icon: <FileText className="h-4 w-4" />,
      color: "text-blue-600"
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600"
    },
    {
      title: "En cours",
      value: stats.inProgress,
      icon: <Wrench className="h-4 w-4" />,
      color: "text-blue-600"
    },
    {
      title: "Terminés",
      value: stats.completed,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600"
    },
    {
      title: "Urgent",
      value: stats.urgent,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600"
    },
    {
      title: "Cette semaine",
      value: stats.thisWeek,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={stat.color}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
