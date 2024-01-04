import React, { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main
      className="w-screen flex justify-center items-center"
      style={{ minHeight: "calc(100vh - 72px)" }}
    >
      {children}
    </main>
  );
};

export default MainLayout;
