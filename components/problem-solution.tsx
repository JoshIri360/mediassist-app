"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export function ProblemSolution() {
  return (
    <>
      <div className=" text-6xl pt-20 pb-2 flex justify-center w-full bg-gray-100 dark:bg-black">
        <h1>Health Spotlight</h1>
      </div>
      <div id="issues" className="py-20 flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-black w-full gap-4 mx-auto px-8">
        <Card title="Improving recruitment through technology, forming strategic alliances for temporary staffing, and enhancing pay and working conditions can help alleviate these staffing issues​." text="The healthcare industry is experiencing significant challenges in hiring and keeping staff, with job vacancies peaking at 9.2% in 2022, far above the usual 4.2%​​​." link="https://www.advisory.com/daily-briefing/2023/01/04/healthcare-2023">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-emerald-900"
          />
        </Card>
        <Card title="The generics industry can help mitigate these shortages by increasing off-patent drug production, enhancing supply chain resilience through better coordination and diversifying manufacturing locations." text="Global medicine shortages, worsened by the COVID-19 pandemic and supply chain issues, delay treatment and worsen health outcomes." link="https://www.healthdata.org/news-events/insights-blog/acting-data/11-global-health-issues-watch-2023-according-ihme-experts">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-sky-600"
            colors={[[125, 211, 252]]}
          />
        </Card>
        <Card title="Adaptation strategies such as using drought-resistant crops, increasing urban vegetation, and improving overall health and socioeconomic conditions can mitigate these impacts​." text="Climate change is worsening public health by increasing the incidence of heat-related illnesses, malnutrition, and respiratory conditions." link="https://www.weforum.org/agenda/2023/02/why-is-world-experiencing-medicine-shortages-and-how-can-the-generics-industry-address-supply-challenges/#:~:text=URL%3A%20https%3A%2F%2Fwww.weforum.org%2Fagenda%2F2023%2F02%2Fwhy">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={2}
          />
          {/* Radial gradient for the cute fade */}
          <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
        </Card>
      </div>
    </>
  );
}

const Card = ({
  title,
  text,
  link,
  children,
}: {
  title: string;
  text: string;
  link: string;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div className="w-full max-w-sm flex-1 mx-auto">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem]"
      >
        <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
        <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
        <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
        <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-full absolute inset-0"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-20">
          <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex flex-col gap-[50px] items-center justify-center pt-64">
            <h2 className="text-[24px]">Problem:</h2>
            {text}
          </div>
          <div className="dark:text-white text-lg opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black pb-40 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200 flex flex-col gap-[50px] text-[15px] text-center md:text-[20px]">
            <h2 className="text-[24px]">Solution:</h2>
            {title}
            <a href={link} target="_blank" rel="noopener noreferrer" className="mt-auto">
              <button className="font-bold bg-white rounded-full md:px-4 md:py-2 px-4 py-2 relative top-[-460px] z-30 md:text-base text-black text-large  w-fit mx-auto ">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
