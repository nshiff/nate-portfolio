import { useState } from "react";
import styles from "./ColorToggle.module.css";

type TextColor = "red" | "blue";

export default function ColorToggle() {
  const [color, setColor] = useState<TextColor>("red");

  const toggle = () => setColor((c) => (c === "red" ? "blue" : "red"));
  const next: TextColor = color === "red" ? "blue" : "red";

  return (
    <div className={styles.container}>
      <p className={`${styles.text} ${styles[color]}`}>Hello, world!</p>
      <button
        type="button"
        className={styles.button}
        onClick={toggle}
        aria-pressed={color === "blue"}
      >
        Make it {next}
      </button>
    </div>
  );
}