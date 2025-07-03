import { useRef, useEffect } from "react";
import debounce from "lodash.debounce";

const useDebouncedCellChange = (
  setActualWeek: React.Dispatch<React.SetStateAction<ActualWeek>>,
  updateDataInStorage: (dateKey: string, row: DayDataRow) => void,
  getUpdatedValue: (
    e: React.ChangeEvent<HTMLTextAreaElement> | string,
    key: DayDataKeys,
    prev: string,
    rowIndex: number
  ) => string
) => {
  const fnRef = useRef<any>(null);

  useEffect(() => {
    fnRef.current = debounce(
      (
        e: React.ChangeEvent<HTMLTextAreaElement> | string,
        rowIndex: number,
        key: DayDataKeys
      ) => {
        setActualWeek((prevWeek) => {
          const updated = [...prevWeek];
          const dateKey = Object.keys(prevWeek[rowIndex])[0];
          const prevValue = updated[rowIndex][dateKey][key];
          const newValue = getUpdatedValue(e, key, prevValue, rowIndex);

          updated[rowIndex][dateKey][key] = newValue;
          updateDataInStorage(dateKey, updated[rowIndex]);

          return updated;
        });
      },
      300
    );

    return () => {
      fnRef.current?.cancel();
    };
  }, [getUpdatedValue, updateDataInStorage, setActualWeek]);

  return fnRef.current;
};

export default useDebouncedCellChange;
