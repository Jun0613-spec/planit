"use client";

import React from "react";

import Loader from "@/components/loader";

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader />
    </div>
  );
};

export default LoadingPage;
