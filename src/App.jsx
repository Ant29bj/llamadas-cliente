/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Tabla from "./components/tabla";

import axios from "axios";
import "./App.css";

function App() {
  const [cdrs, setCdrs] = useState("");

  const [filtro, setFiltro] = useState("");
  const [filterOpt, setFilterOpt] = useState("");

  const [dispositionSelected, setDispositionSelected] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const pageSize = 300;
  const apiUrl = "http://localhost:8080/llamadas";

  const fetchData = async () => {
    const url = `${apiUrl}?page=1&page_size=${pageSize}`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCdrs(data);
      });
  };

  const getLlamadasPorDisposition = async (e) => {
    setDispositionSelected(e);
    const url = `${apiUrl}?page=1&page_size=${pageSize}`;
    try {
      const response = await axios.post(url, {
        disposition: e,
        page: 1,
        page_size: pageSize,
      });
      setCdrs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const convertirFecha = (fecha) => {
    return fecha.format("YYYY-MM-DD HH:mm:ss");
  };
  const getLlamadasPorFecha = async () => {
    const url = `${apiUrl}/fecha?page=1&page_size=${pageSize}`;
    try {
      const response = await axios.post(url, {
        start_date: convertirFecha(fechaInicio),
        end_date: convertirFecha(fechaFinal),
        page: 1,
        page_size: pageSize,
      });

      setCdrs(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectFilter = (e) => {
    const value = e.target.value;
    setFiltro(value);

    if (value === "disposition") {
      setFilterOpt(["ANSWERED", "BUSY", "FAILED"]);
    } else if (value === "fecha") {
      console.log("hola");
    } else {
      setFilterOpt("");
    }
  };
  /*
    const handlePageChange = (page) => {
      setPage(page);
      if (dispositionSelected != "") {
        getLlamadasPorDisposition(dispositionSelected);
      } else if (filtro === "") {
        fetchData();
      }
    };
  */

  useEffect(() => {
    if (filtro == "") {
      fetchData();
    }
  });
  return (
    <div className="wrapper">
      {filtro === "fecha" ? (
        <div className="date-picker-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Fecha de inicio"
              onChange={(value) => setFechaInicio(value)}
            />
          </LocalizationProvider>
          {fechaFinal !== "" && fechaFinal !== "" ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                getLlamadasPorFecha();
              }}
            >
              Buscar
            </button>
          ) : null}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Fecha final"
              onChange={(value) => setFechaFinal(value)}
            />
          </LocalizationProvider>
        </div>
      ) : null}
      <select
        className="form-select"
        aria-label="Select Filter"
        value={filtro}
        onChange={(event) => handleSelectFilter(event)}
      >
        <option value="">Default</option>
        <option value="disposition">Estado</option>
        <option value="fecha">Fecha</option>
        <option value="src">Fuente</option>
        <option value="destino">Destino</option>
      </select>
      {filterOpt.length > 0 && (
        <select
          className="form-select"
          value={dispositionSelected}
          onChange={(event) => getLlamadasPorDisposition(event.target.value)}
        >
          <option value="">Default</option>
          {filterOpt.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      <div className="tabla-container">
        <Tabla llamadas={cdrs.records} />
        {/*
        <div className="button-wrapper">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>
          <div className="current-page">{page}</div>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
        */}
      </div>
    </div>
  );
}
export default App;
