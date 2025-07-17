
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Check, Trash2 } from "lucide-react";
import { Notification } from "@/types/project";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "user1",
    type: "task_assigned",
    title: "Nouvelle tâche assignée",
    message: "Vous avez été assigné à la tâche 'Inspection des équipements UPS'",
    isRead: false,
    createdAt: "2024-02-14T10:30:00Z",
    relatedId: "1"
  },
  {
    id: "2",
    userId: "user1",
    type: "comment_added",
    title: "Nouveau commentaire",
    message: "John a ajouté un commentaire sur votre tâche",
    isRead: false,
    createdAt: "2024-02-14T09:15:00Z",
    relatedId: "2"
  },
  {
    id: "3",
    userId: "user1",
    type: "deadline_approaching",
    title: "Échéance proche",
    message: "La tâche 'Documentation technique' arrive à échéance demain",
    isRead: true,
    createdAt: "2024-02-13T16:00:00Z",
    relatedId: "4"
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_assigned': return '👤';
      case 'comment_added': return '💬';
      case 'deadline_approaching': return '⏰';
      case 'task_completed': return '✅';
      default: return '📌';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${Math.floor(diffInHours)} heure${Math.floor(diffInHours) > 1 ? 's' : ''}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Tout marquer lu
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="space-y-3 mt-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors ${
                  !notification.isRead ? 'border-primary/50 bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
