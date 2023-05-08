import React from "react";

export function MyButton(props: {
  style: React.StyleHTMLAttributes<HTMLStyleElement>;
  text: string;
}) {
  return <button style={props.style}>{props.text}</button>;
}

export function Hello({ text }: { text: string }) {
  return <p>{text}</p>;
}

export function Container(props: { children: React.ReactElement<any> }) {
  return <div>{props.children}</div>;
}

type CardProps = {
  title: string;
  paragraph: string;
};

export const Card = ({ title, paragraph }: CardProps) => (
  <aside>
    <h2>{title}</h2>
    <p>{paragraph}</p>
  </aside>
);
