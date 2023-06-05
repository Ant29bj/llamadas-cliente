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

  const [src, setScr] = useState("");
  const [dst, setDst] = useState("");

  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState("");

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

  const fetchSucursales = async () => {
    const url = `${apiUrl}/clid`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSucursales(data);
      });
  };

  const getLlamadasSrc = async (e) => {
    const url = `${apiUrl}/src?page=1&page_size=${pageSize}&src=${e}`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCdrs(data);
      });
  };

  const getLlamadasDst = async (e) => {
    const url = `${apiUrl}/dst?page=1&page_size=${pageSize}&dst=${e}`;
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

  const getLlamadasPorSucursal = async (e) => {
    const url = `${apiUrl}/clid/filtro`;
    console.log(e);
    try {
      const response = await axios.post(url, {
        clid: e,
      });
      setCdrs(response.data);
    } catch (error) {
      console.log(error);
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
      setFiltro("disposition");
    } else if (value === "src") {
      setFiltro("src");
    } else if (value === "dst") {
      setFiltro("dst");
    } else if (value === "fecha") {
      setFiltro("fecha");
    } else if (value === "sucursal") {
      setFiltro("sucursal");
      fetchSucursales();
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
      {filtro === "dst" ? (
        <div className="input-group input-group-sm mb-3">
          <span className="input-group-text" id="inputGroup-sizing-sm">
            Destino
          </span>
          <input
            type="text"
            className="form-control"
            aria-describedby="inputGroup-sizing-sm"
            value={dst}
            onChange={(e) => {
              setDst(e.target.value);
            }}
          />
          <button
            type="button"
            className="btn"
            onClick={() => {
              getLlamadasDst(dst);
            }}
          >
            Buscar
          </button>
        </div>
      ) : null}
      {filtro === "src" ? (
        <div className="input-group input-group-sm mb-3">
          <span className="input-group-text" id="inputGroup-sizing-sm">
            Fuente
          </span>
          <input
            type="text"
            className="form-control"
            aria-describedby="inputGroup-sizing-sm"
            value={src}
            onChange={(e) => {
              setScr(e.target.value);
            }}
          />
          <button
            type="button"
            className="btn"
            onClick={() => {
              getLlamadasSrc(src);
            }}
          >
            Buscar
          </button>
        </div>
      ) : null}
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
        <option value="dst">Destino</option>
        <option value="sucursal">Sucursal</option>
      </select>

      {filtro === "sucursal" ? (
        <div className="date-picker-container">
          <select
            className="form-select"
            aria-label="Select sucursal"
            value={selectedSucursal}
            onChange={(e) => {
              setSelectedSucursal(e.target.value);
            }}
          >
            <option value="">Default</option>
            {sucursales.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn"
            onClick={() => {
              const formatSucursal = (value) => {
                const transformedValue = `"${value.replace(/"/g, '\\"')}"`;
                return transformedValue;
              };

              const data = formatSucursal(selectedSucursal);
              getLlamadasPorSucursal(selectedSucursal);
            }}
          >
            Buscar
          </button>
        </div>
      ) : null}
      {filtro === "disposition" ? (
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
      ) : null}
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
