import cn from "classnames";
export default function ModuleTable(props:any) {
  const {value} = props;
  return (
    <div className="mx-auto min-h-full overflow-hidden">
       
      {value.title && <p className="text-center uppercase !tracking-widest">{value.title || ''}</p>}
 
      <table className="mt-[1em]">
        <tbody>
        {value.table.rows.map((row:any) => (
          <tr className="flex flex-col md:table-row align-top" key={row._key}>
            {row.cells.map((cell:any, index:number) => (
              <td key={`${row._key}-${index}`} className={cn(index < row.cells.length - 1 ? "pr-[1em] sm:pr-[2em]" : "", "")}>
                <span className="empty:hidden md:empty:block min-h-[1em] block">{cell}</span>
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
