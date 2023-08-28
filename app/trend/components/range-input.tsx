/* global requestAnimationFrame, cancelAnimationFrame */
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { styled, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/IconButton";

const PositionContainer = styled("div")({
  position: "absolute",
  zIndex: 1,
  bottom: "40px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const SliderInput = withStyles({
  root: {
    marginLeft: 12,
    width: "40%",
  },
  valueLabel: {
    "& span": {
      background: "none",
      color: "#000",
    },
  },
})(Slider);

type props = {
  min: number;
  max: number;
  value: number[];
  onChange: Dispatch<SetStateAction<any>>;
  weeks: string[];
};

type Animation = {
  id?: number;
};

export default function RangeInput({
  min,
  max,
  value,
  onChange,
  weeks,
}: props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animation] = useState<Animation>({});

  // prettier-ignore
  useEffect(() => {
    return () => {
      if (animation.id) {
        cancelAnimationFrame(animation.id);
      }
    };
  }, [animation]);

  if (isPlaying && !animation.id) {
    const span = value[1] - value[0];
    let nextValueMin = value[0] + 1;
    if (nextValueMin + span >= max) {
      nextValueMin = min;
    }
    animation.id = requestAnimationFrame(() => {
      setTimeout(() => {
        animation.id = 0;
        onChange([nextValueMin, nextValueMin + span]);
      }, 50);
    });
  }

  const PauseIcon = (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );

  const PlayIcon = (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );

  const isButtonEnabled = value[0] > min || value[1] < max;

  return (
    <PositionContainer>
      <Button
        color="primary"
        disabled={!isButtonEnabled}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? PauseIcon : PlayIcon}
      </Button>
      <SliderInput
        min={min}
        max={max}
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={(value, index) => {
          if (!weeks || value < 0 || value >= weeks.length) {
            return "";
          }
          const week = weeks[value];
          return `${week}`;
        }}
      />
    </PositionContainer>
  );
}
