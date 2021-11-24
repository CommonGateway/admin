import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import TableCells from "../common/tableCells";
import Card from "../common/card";
import { Link } from "gatsby";
import Table from "../common/table";
import TableHeaders from "../common/tableHeaders";
import DeleteModal from "../modals/deleteModal";
import Spinner from "../common/spinner";

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const context = useUrlContext();
  const [showSpinner, setShowSpinner] = useState(false);

  const getEntities = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/entities", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setShowSpinner(false);
          setEntities(null);
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setEntities(data["hydra:member"]);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setShowSpinner(false);
        setEntities(null);
      });
  };
  useEffect(() => {
    getEntities();
  }, []);

  return (
    <Card title="Entities" modal="#helpModal" refresh={getEntities} add="/entities/new" >
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <Spinner />
            ) : (
              <div className="utrecht-html">
                <table
                  lang="nl"
                  summary="Overview of object entities fetched from the gateway."
                  className="table"
                >
                  <TableHeaders
                    headerItems={[
                      {
                        name: "Name",
                      },
                      { name: "Endpoint" },
                      { name: "Route" },
                      { name: "Source" },
                      { name: "" },
                    ]}
                  />
                  <tbody>
                    {entities !== null && entities.length > 0 ? (
                      entities.map((row) => (
                        <TableCells
                          cellItems={[
                            { name: row.name },
                            { name: row.endpoint },
                            { name: row.route },
                            { name: row.gateway.name },
                            {
                              renderItem: () => {
                                return (
                                  <>
                                    <div className="d-flex">
                                      <Link
                                        className="ml-auto"
                                        to={`/entities/${row.id}`}
                                      >
                                        <button className="utrecht-button btn-sm btn-success">
                                          <i className="fas fa-edit pr-1"></i>
                                          Edit
                                        </button>
                                      </Link>
                                      <button
                                        className="utrecht-button btn-sm btn-danger ml-2"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#item-${row.id.replaceAll(
                                          "-",
                                          ""
                                        )}`}
                                      >
                                        <i className="fas fa-trash" />
                                      </button>
                                    </div>
                                  </>
                                );
                              },
                            },
                          ]}
                        />
                      ))
                    ) : (
                      <TableCells
                        cellItems={[
                          { name: "No results found" },
                          { name: "" },
                          { name: "" },
                          { name: "" },
                          { name: "" },
                        ]}
                      />
                    )}
                  </tbody>
                </table>
                {entities !== null &&
                  entities.map((item) => (
                    <>
                      <DeleteModal data={item} useFunction={getEntities} />
                    </>
                  ))}
              </div>
            )}
          </div>
        </div>
    </Card>
  );
}
