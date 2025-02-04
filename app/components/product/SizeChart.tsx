'use client';

import Button from '../elements/Button';
import {Container} from '../global/Container';
import clsx from 'clsx';

export default function SizeChart({
  frenchCm,
  frenchIn,
  international,
  setSizeChartVisible,
}: any) {
  return (
    <Container type="sizeChart">
      <div className="grid w-full grid-flow-row gap-[2em] mb-[3em]">
        {/* Centimeters */}
        <div>
          <h4 className="cell-header">French Sizes (cm)</h4>
          <Chart table={frenchCm} />
        </div>

        {/* Inches */}
        <div>
          <h4 className="cell-header">French Sizes (in)</h4>
          <Chart table={frenchIn} />
        </div>

        {/* International */}
        <div>
          <h4 className="cell-header">International</h4>
          <Chart table={international} />
        </div>

        <Container type="pdpForm">
          <Button onClick={() => setSizeChartVisible(false)}>Close</Button>
        </Container>
      </div>
    </Container>
  );
}

function Chart({table}: any) {
  // row 0 size
  // row 1 bust
  // row 2 waist
  // row 3 hips
  return (
    <>
      <div className="flex flex-col divide-y md:hidden">
        {table?.sizeChart.rows[0].cells
          .slice(1, table?.sizeChart.rows[0].cells.length)
          .map((cell: any, index: number) => {
            if (table.title !== 'International') {
              return (
                <div className="cell">
                  {cell}
                  <div>
                    {table?.sizeChart.rows?.[1]?.cells?.[0]}:{" "}
                    {table?.sizeChart.rows?.[1]?.cells?.[index + 1]}
                  </div>
                  {table?.sizeChart.rows?.[2]?.cells?.[index + 1] && (
                    <div>
                      {table?.sizeChart.rows?.[2]?.cells?.[0]}:{" "}
                      {table?.sizeChart.rows?.[2]?.cells?.[index + 1]}
                    </div>
                  )}

                  {table?.sizeChart.rows?.[3]?.cells?.[index + 1] && (
                    <div>
                      {table?.sizeChart.rows?.[3]?.cells?.[0]}:{" "}
                      {table?.sizeChart.rows?.[3]?.cells?.[index + 1]}
                    </div>
                  )}
                </div>
              );
            } else {
              return <div className="cell">{cell}: {table?.sizeChart.rows?.[1]?.cells?.[index + 1]}</div>;
            }
          })}
      </div>
      <table className="hidden w-full divide-y md:table">
        {table?.sizeChart.rows.map((row: any) => (
          <tr key={row._key} className="">
            {row.cells.map((cell: any, index: number) => (
              <td
                key={`${row._key}-${index}`}
                className={clsx('cell flex-1', index === 0 && 'w-[4em]')}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </>
  );
}
