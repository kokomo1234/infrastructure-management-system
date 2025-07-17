
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { getUserNotifications, markNotificationAsRead, respondToChangeRequest } from "@/lib/standbyService";
import { StandbyNotification } from "@/types/standby";

export function StandbyNotifications() {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);
  
  if (!user) return null;
  
  const notifications = getUserNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5);
  
  const handleMarkAsRead = (notification: StandbyNotification) => {
    markNotificationAsRead(notification.id);
  };
  
  const handleAcceptRequest = (notification: StandbyNotification) => {
    if (notification.relatedRequestId) {
      respondToChangeRequest(notification.relatedRequestId, true);
      markNotificationAsRead(notification.id);
    }
  };
  
  const handleRejectRequest = (notification: StandbyNotification) => {
    if (notification.relatedRequestId) {
      respondToChangeRequest(notification.relatedRequestId, false);
      markNotificationAsRead(notification.id);
    }
  };
  
  if (notifications.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {displayNotifications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          <div className="space-y-4">
            {displayNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border ${notification.isRead ? 'bg-background' : 'bg-muted/30'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <div className="text-xs text-muted-foreground">
                    {format(notification.createdAt, "PP 'à' HH:mm", { locale: fr })}
                  </div>
                </div>
                <p className="text-sm mb-2">{notification.message}</p>
                
                <div className="flex justify-end gap-2 mt-2">
                  {notification.type === 'request' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRejectRequest(notification)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptRequest(notification)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accepter
                      </Button>
                    </>
                  )}
                  
                  {!notification.isRead && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleMarkAsRead(notification)}
                    >
                      Marquer comme lu
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {notifications.length > 5 && (
              <div className="text-center pt-2">
                <Button 
                  variant="link" 
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Afficher moins" : `Voir toutes (${notifications.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
