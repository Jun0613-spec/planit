import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import TitleSection from "./title-section";

import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

const Hero = () => {
  return (
    <section className="overflow-hidden space-y-6 mt-40 gap-4 px-5 sm:px-6 sm:flex sm:flex-col md:justify-center md:items-center">
      <TitleSection
        pill="🚀 Streampne Your Projects & Tasks"
        title="Effortless Project Management & Seamless Team Collaboration"
      />

      <Button variant="primary" className="rounded-md text-lg sm:text-xl">
        <Link href="/sign-up"> Get Planit Free</Link>

        <ArrowRight className="size-4 ml-2" />
      </Button>
      <div className="py-20 px-6 md:px-8  max-w-5xl mx-auto mt-8">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Simplify Your Workflow
        </h3>
        <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
          Planit brings all your projects, tasks, and communication together in
          one place. Manage teams and workflows effortlessly so you can focus on
          what matters most.
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <Badge variant="outline" className="py-3 px-5 rounded-lg">
            🚀 Fast Setup
          </Badge>
          <Badge variant="outline" className="py-3 px-5 rounded-lg">
            ✅ Task Automation
          </Badge>
          <Badge variant="outline" className="py-3 px-5 rounded-lg ">
            📊 Powerful Insights
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default Hero;
