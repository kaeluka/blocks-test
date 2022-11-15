import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Button, Box } from "@primer/react";
import React from "react";
import "./index.css";

const renderCoordinateSystem = function (maxX: number, maxY: number) {
  const renderCoordinateBar = (d: string) => <path
    markerEnd="url(#head)"
    strokeWidth={1}
    stroke="black"
    fill="black"
    style={{ vectorEffect: "non-scaling-stroke" }}
    d={d}
  ></path>
  return <React.Fragment>
    {renderCoordinateBar(`M0,0 h ${maxX * 1.02}`)}
    {renderCoordinateBar(`M0,0 v ${maxY * 1.02}`)}
    // circle at origin
    <circle cx={0} cy={0} r={maxX/20} style={{
      fill: "none",
      stroke: "black",
      strokeWidth: 1,
      vectorEffect: "non-scaling-stroke"
    }} />

  </React.Fragment>
}

const fixedSizeDot = function (p: { x: number, y: number }, color: string) {
  const { x, y } = p;
  return <line x1={x} y1={y} x2={x} y2={y} style={
    {
      strokeLinecap: "round",
      stroke: color,
      strokeWidth: "5px",
      vectorEffect: "non-scaling-stroke"
    }
  } />;
}

export default function (props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";

  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const points = lines.map(l => {
    const [x, y] = l.split(',');
    return { x: Number(x), y: Number(y) };
  });

  const scaleFactor = 15;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const margin = "20"

  return <svg height="100%" width="100%">
    <defs>
      <marker id='head' orient="auto"
        markerWidth='10' markerHeight='10'
        viewBox="0 0 10 6"
        refX='9' refY='3'
      >
        <path d='M 0 0 L 10 3 L 0 6 z' fill='black' />
      </marker>
    </defs>

    <g transform={`translate(${margin}, ${margin})
                   scale(${scaleFactor}, ${-scaleFactor})
                   translate(0, ${-maxY})`}>
      // for each point, draw a circle
      {points.map(p => fixedSizeDot(p, "blue"))}

      // for each point, draw line from zero to height of point:
      {points.map(p => <line x1={p.x} y1={0} x2={p.x} y2={p.y} style={
        {
          strokeWidth: "1px",
          // do not scale stroke width:
          vectorEffect: "non-scaling-stroke",
          stroke: "blue",
        }
      } />)}

      {renderCoordinateSystem(maxX, maxY)}


    // draw a grid
      {/* {
        Array.from({ length: (maxY - minY) + 1 }).map((_, i) => {
          const y = i + minY;
          return <line x1={minX} y1={y} x2={maxX} y2={y} style={
            {
              stroke: "black",
              strokeWidth: "0.1px",
              vectorEffect: "non-scaling-stroke"
            }
          } />;
        })
      } */}
    </g>

  </svg>
}
