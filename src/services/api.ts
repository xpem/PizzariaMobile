import axios from "axios";

const api = axios.create({
  //para testes locais, utilizar ip da máquina
  baseURL: "https://xpemstudies.herokuapp.com/",
});

export { api };
