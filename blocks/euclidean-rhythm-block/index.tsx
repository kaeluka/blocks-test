import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";

import * as Tone from "tone";
import * as Tonal from "tonal";

import React, { Fragment } from "react";
import "./index.css";

function euclidean(ones: number, length: number, rotate: number): number[] {
  console.log(`euclidean(${ones}, ${length})`);
  const slope = ones / length;
  console.log(`slope: ${slope}`);

  const ret = [1];
  let lastY = 0;
  let curTargetY = 0;

  for (let x = 0; x < length - 1; x++) {
    curTargetY += slope;
    const curY = Math.floor(curTargetY);
    if (curY === lastY) {
      ret.push(0);
    } else {
      ret.push(1);
    }
    lastY = curY;
  }

  while (rotate-- > 0) {
    ret.push(ret.shift() as number);
  }

  return ret;
}

const transpose = (note: string) => Tonal.transpose(note) as ((_: string) => string);

const scale = Tonal.scale("major").map(transpose("C4"));

const makeNoise = (rhythm: number[]) => {
  console.log(`makeNoise(${JSON.stringify(rhythm)})`);
  const synth = new Tone.Synth().toDestination();

  let t = 0;
  const dt = 0.25;
  // 3 times:
  for (let i = 0; i < 3; i++) {
    for (const state of rhythm) {
      if (state) {
        const note = scale[Math.floor(Math.random()*scale.length)];
        // const note = 'C4';
        console.log(`beat ${i}: ${note}`);
        synth.triggerAttackRelease(note, "16n", `+${t + 0.1}`);
      }
      t += dt;
    }
  }
}

const rhythmDot = (on: boolean, x: number, y: number) => <circle cx={x} cy={y} r={10} fill={on ? "black" : "white"} stroke="black" strokeWidth={1} />;

const euclideanRhythmRow = (ones: number, length: number, offset: number) => {
  const rhythm = euclidean(ones, length, offset);
  return <Fragment>
    <button onClick={() => makeNoise(rhythm)}>E({ones}, {length}, {offset})</button>
    <svg height={30} width="100%">{rhythm.map((state, i) => rhythmDot(state === 1, 30 + i * 50, 15))}</svg>
  </Fragment>
}

export default function (props: FileBlockProps) {

  const lines = props.content.split('\n').filter(l => l.trim().length > 0);

  const input = lines.map(l => l.split(',').map(b => Number.parseInt(b.trim())));

  return <div>
    {input.map((rhythm) => euclideanRhythmRow(rhythm[0], rhythm[1], rhythm[2] ?? 0))}
  </div>

}
