import React, { ReactNode } from "react";

import Sidebar from "./_components/sidebar/sidebar";
import Navbar from "./_components/navbar";

import Modals from "@/components/modals";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Modals />
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden  lg:block lg:w-[264px] h-full overflow-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col"> {children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
