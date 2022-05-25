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
    baseURL
});

function obterEstados() {
    return ibgeApi.get("/estados");
};

function inserirEstados(UFs) {
    const sql = "INSERT INTO UFs SET ?";
    return connection.query(sql, UFs);
};

async function main() {
    console.log("Iniciando request");
    const estados = (await obterEstados()).data;
    console.log("Estados retornados: ", estados.length);
};

main();