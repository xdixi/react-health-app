const updateDataInStorage = (dateKey: string, updatedRow: object) => {
  const year = new Date(dateKey).getFullYear();

  const storedData = JSON.parse(
    localStorage.getItem(`yearData${year}`) || "[]"
  );

  const updated = storedData.map((day: object) => {
    const dayKey = Object.keys(day)[0];
    if (dateKey === dayKey) {
      return updatedRow;
    }
    return day;
  });

  localStorage.setItem(`yearData${year}`, JSON.stringify(updated));
};

export { updateDataInStorage };
