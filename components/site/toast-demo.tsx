"use client";

import { Button } from "@/components/ui/button";
import { Group } from "@/components/ui/group";
import { toast } from "@/components/ui/toast";

export function ToastDemo() {
  return (
    <Group className="flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.add({
            title: "Saved",
            description: "Your changes have been saved.",
            type: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.add({
            title: "Couldn't save",
            description: "Network error. Try again.",
            type: "error",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.add({
            title: "Heads up",
            description: "A new version is available.",
            type: "info",
          })
        }
      >
        Info
      </Button>
    </Group>
  );
}
