import { Icon } from '@src/ui/components/Icon';
import { IData } from '@src/ui/types';
import { withState } from '@src/ui/withState';
import * as React from 'react';

interface SpriteProps {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  className?: string;
}

export const Sprite = (props: SpriteProps) => (
  <div className={props.className}>
    <svg
      style={{ width: '100%', height: '100%' }}
      viewBox={`0 0 ${props.width} ${props.height}`}
    >
      <defs>
        <clipPath id='square'>
          <rect width={props.width} height={props.height} />
        </clipPath>
      </defs>
      <g clipPath='url(#square)'>
        <image
          href={props.src}
          transform={`translate(-${props.x} -${props.y})`}
        />
      </g>
    </svg>
  </div>
);
