'use client';

import Button from '../elements/Button';

export default function SizeChart({sizeChart, setSizeChartVisible}: any) {
  return (
    <div className="grid w-full grid-flow-row">
      <h4>Size-Guide</h4>
      <div className='mb-4 divide-y'>
      {sizeChart.rows.map((row: any) => (
        <div className="flex w-full flex-1" key={row._key}>
          {row.cells.map((cell: any, index: number) => (
            <div
              key={`${row._key}-${index}`}
              className="flex-1 px-2 py-1"
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
      </div>
      <Button onClick={()=>setSizeChartVisible(false)}>Close</Button>
    </div>
  );
}
