"use client";

import React, { ReactNode } from "react";
import { useMedia } from "react-use";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface ResponsiveModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResponsiveModal = ({
  children,
  open,
  onOpenChange
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none  overflow-y-auto no-scrollbar max-h-[85vh]">
        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto no-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveModal;
