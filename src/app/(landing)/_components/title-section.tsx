import React, { Fragment } from "react";

interface TitleSectionProps {
  title: string;
  subheading?: string;
  pill: string;
}

const TitleSection = ({ title, subheading, pill }: TitleSectionProps) => {
  return (
    <Fragment>
      <section className="flex flex-col gap-4 justify-center items-start md:items-center">
        <article className="rounded-full p-[1px] text-sm bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-700 dark:to-sky-800">
          <div className="rounded-full px-3 py-1 text-white">{pill}</div>
        </article>
        {subheading ? (
          <>
            <h2 className="text-left text-3xl sm:text-5xl sm:max-w-[750px] md:text-center font-semibold">
              {title}
            </h2>
            <p className="dark:text-washed-purple-700 sm:max-w-[450px]md:text-center">
              {subheading}
            </p>
          </>
        ) : (
          <h1 className=" text-left text-4xl sm:text-6xl  sm:max-w-[850px] md:text-center font-semibold ">
            {title}
          </h1>
        )}
      </section>
    </Fragment>
  );
};

export default TitleSection;
