import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState(() => {
    // Получаем значение из localStorage (или задаём дефолтное)
    return localStorage.getItem("name") || "";
  });

  useEffect(() => {
    // Сохраняем значение в localStorage при изменении name
    localStorage.setItem("name", name);
  }, [name]);

  return (
    <div>
      <h1>Hello, {name || "Guest"}!</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

export default App;
