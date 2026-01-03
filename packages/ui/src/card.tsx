import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className="border border-slate-700 bg-surface text-white p-6 rounded-xl shadow-xl backdrop-blur-sm"
    >
      <h1 className="text-xl border-b border-slate-700 pb-2 mb-4 font-bold text-primary-foreground">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}
