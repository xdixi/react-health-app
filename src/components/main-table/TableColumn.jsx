// import React, { useEffect, useMemo, useRef, useState } from "react";
// import TableCell from "./TableCell";
// const TableColumn = ({
//   title,
//   dataKey,
//   rowData,
//   rowIndex,
//   activeCell,
//   onActivate,
//   onChange,
//   onBlur,
// }) => (
//   <>
//     <th>{title}</th>
//     {rowData.map((row, i) => (
//       <TableCell
//         key={i}
//         rowIndex={rowIndex}
//         columnKey={dataKey}
//         value={row[dataKey] || ""}
//         isActive={activeCell?.row === rowIndex && activeCell?.key === dataKey}
//         onActivate={onActivate}
//         onChange={onChange}
//         onBlur={onBlur}
//       />
//     ))}
//   </>
// );

// export default TableColumn;
