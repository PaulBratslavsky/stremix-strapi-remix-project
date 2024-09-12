import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

interface ResizableLayoutProps {
  children: React.ReactNode;
  width?: number[];
}

export function ResizableLayout({
  children,
  width = [25, 75],
}: Readonly<ResizableLayoutProps>) {
  const [contentLeft, contentRight] = React.Children.toArray(children);
  const [leftWidth, rightWidth] = width;

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={leftWidth} className="h-[calc(100vh-5rem)]">
        {contentLeft}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={rightWidth} className="h-[calc(100vh-5rem)]">
        {contentRight}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
