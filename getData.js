const getData = async () => {
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const data = await response.json();
    return data;
  } catch {
    console.log("Fetch error", error);
  }
};

export default getData;
