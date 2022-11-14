import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";

import * as Tone from "tone";
import * as Tonal from "tonal";

import React from "react";
import "./index.css";

const transpose = (note: string) => Tonal.transpose(note) as ((_: string) => string);

const scale = Tonal.scale("major").map(transpose("C4"));

const makeNoise = (beatCode: number[]) => {
  console.log(`makeNoise(${JSON.stringify(beatCode)})`);
  // for each beat, play a note
  const synth = new Tone.Synth().toDestination();
  beatCode.forEach((beat, i) => {
    const note = scale[beat % scale.length];
    console.log(`beat ${i}: ${note}`);
    synth.triggerAttackRelease(note, "16n", `+${i*0.100}`);
  });
  // new Tone.Synth().toDestination().triggerAttackRelease("C4", "8n");
}

export default function (props: FileBlockProps) {
  const beatCode = props.content.split('\n').flatMap(l => l.split(',')).map(b => Number.parseInt(b.trim()));
  return <div>
    <div>Scale: {JSON.stringify(scale)}</div>
    <div>
      <button onClick={() => {
        makeNoise(beatCode);
      }}>Click me</button>;
    </div>
  </div>
}
