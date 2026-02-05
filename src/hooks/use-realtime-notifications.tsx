import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

export const useRealtimeNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handler = (notification: {
      id: string;
      message: string;
      type: string;
      createdAt: string;
      readAt?: string | null;
    }) => {
      queryClient.setQueryData(
        ["notifications"],
        (existing:
          | { notifications: typeof notification[] }
          | undefined
          | null) => {
          if (!existing) {
            return { notifications: [notification] };
          }
          return {
            notifications: [notification, ...existing.notifications],
          };
        },
      );

      toast({
        title: "New notification",
        description: notification.message,
      });
    };

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [queryClient, toast]);
};

