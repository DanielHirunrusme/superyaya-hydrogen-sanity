import cn from "classnames";
export default function ModuleTable(props) {
  const {value} = props;
  return (
    <div className="mx-auto min-h-full overflow-hidden">
       
      {value.title && <p className="text-center uppercase !tracking-widest">{value.title || ''}</p>}
 
      <table className="mx-auto">
        {value.table.rows.map((row, index) => (
          <tr key={row._key}>
            {row.cells.map((cell, index) => (
              <td key={`${row._key}-${index}`} className={cn(index < row.cells.length - 1 ? "pr-[1em] sm:pr-[2em]" : "", "")}>
                <span className="min-h-[1em] block">{cell}</span>
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
