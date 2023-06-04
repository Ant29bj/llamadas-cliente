// eslint-disable-next-line react/prop-types
export default function Tabla({ llamadas = [] }) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Call date</th>
            <th scope="col">Disposition</th>
            <th scope="col">Src</th>
            <th scope="col">Dst</th>
          </tr>
        </thead>
        <tbody>
          {llamadas.map((llamada, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{llamada.call_date}</td>
              <td>{llamada.disposition}</td>
              <td>{llamada.src}</td>
              <td>{llamada.dst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
