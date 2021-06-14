const getData = async () => {
  try {
    let random = Math.floor(Math.random() * 33) + 1;
    const response = await fetch(
      random === 1
        ? "https://rickandmortyapi.com/api/character"
        : `https://rickandmortyapi.com/api/character?page=${random}`
    );
    const data = await response.json();
    return data;
  } catch {
    console.log("Fetch error", error);
  }
};

export default getData;
