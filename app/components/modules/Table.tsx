export default function ModuleTable(props) {
  const {value} = props;
  return (
    <div className="mx-auto min-h-full max-w-[400px] overflow-hidden">
        <br />
      <p className="text-center">{value.title || ''}</p>
      <br />
      <table>
        {value.table.rows.map((row, index) => (
          <tr key={row._key}>
            {row.cells.map((cell, index) => (
              <td key={`${row._key}-${index}`} className="pr-12">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
