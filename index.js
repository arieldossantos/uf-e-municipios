const axios = require("axios").default;
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "las",
  password: "admin",
  database: "las",
});

const baseURL = "https://servicodados.ibge.gov.br/api/v1/localidades";
const ibgeApi = axios.create({
  baseURL,
});

function obterEstados() {
  return ibgeApi.get("/estados");
}

function inserirEstado(UFs) {
  const sql = "INSERT INTO UFs SET ?";
  return connection.query(sql, UFs);
}
function obterMunicipios(idEstado, siglaEstado) {
  const path = `/estados/${idEstado}/municipios`;
  return ibgeApi.get(path).then((resultado) => {
    const { data } = resultado;
    const municipios = [];
    for (let i = 0; i < data.length; i++) {
      const municipio = data[i];
      municipios.push({ siglaEstado, id: municipio.id, nome: municipio.nome });
    }
    return municipios;
  });
}
function inserirMunicipios(municipios) {
  const sql = "INSERT INTO Municipios SET ?";
  return connection.query(sql, municipios);
}

async function main() {
  const resultado = [];
  console.log("Iniciando request");
  const estados = (await obterEstados()).data;
  console.log("Estados retornados: ", estados.length);
  for (let i = 0; i < estados.length; i++) {
    const { id, sigla } = estados[i];
    resultado.push(await inserirEstado({ id, sigla }));
    const municipios = await obterMunicipios(id, sigla);
    console.log(`Municipios retornados para ${sigla} :`, municipios.length);
    const resultadoMunicipios = await inserirMunicipios(municipios);
    console.log("Municipios inseridos com sucesso");
  }
  console.log("Registros inseridos: ", resultado.length);
}

main();
