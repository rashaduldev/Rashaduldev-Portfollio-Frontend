import { Slot, Slottable } from "@radix-ui/react-slot";
import { useId } from "react";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import styles from "./Blobsbutton.module.css";

type BlobsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  asChild?: boolean;
  blobColor?: string;
  backgroundColor?: string;
};

/** Reusable gooey-background button. Use `asChild` to style a Link or anchor. */
export default function BlobsButton({
  children,
  asChild = false,
  blobColor = "var(--primary)",
  backgroundColor = "var(--background)",
  className = "",
  style,
  type,
  ...props
}: BlobsButtonProps) {
  const filterId = `blobs-${useId().replace(/:/g, "")}`;
  const buttonStyle = {
    "--blob-color": blobColor,
    "--blob-background": backgroundColor,
    ...style,
  } as CSSProperties;

  const animation = (
    <>
      <span className={styles.inner} aria-hidden="true">
        <span className={styles.blobs} style={{ filter: `url(#${filterId})` }}>
          <span className={styles.blob} />
          <span className={styles.blob} />
          <span className={styles.blob} />
          <span className={styles.blob} />
        </span>
      </span>
      <span className={styles.content}>
        <Slottable>{children}</Slottable>
      </span>
      <svg className={styles.filter} aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </>
  );

  if (asChild) {
    return (
      <span className={`${styles.button} ${className}`} style={buttonStyle}>
        {animation}
        <Slot className={styles.link}>{children}</Slot>
      </span>
    );
  }

  return (
    <button
      {...props}
      type={type ?? "button"}
      className={`${styles.button} ${className}`}
      style={buttonStyle}
    >
      {animation}
      <span className={styles.content}>{children}</span>
    </button>
  );
}
