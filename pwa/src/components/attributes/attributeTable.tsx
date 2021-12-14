import * as React from "react";
// import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import Spinner from "../common/spinner";
import { isLoggedIn } from "../../services/auth";
import Table from "../common/table";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";
import {Link} from "gatsby";

export default function AttributeTable({ id }) {
  const [attributes, setAttributes] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
        setShowSpinner(true);
        fetch(`${context.apiUrl}/attributes?entity.id=${id}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              setShowSpinner(false);
              setAttributes(null);
              throw new Error(response.statusText);
            }
          })
          .then((data) => {
            setAttributes(data["hydra:member"]);
            setShowSpinner(false);
          })
          .catch((error) => {
            console.error("Error:", error);
            setShowSpinner(false);
            setAttributes(null);
          });
      }
    }
  }, [context]);

  return (
    <Card title={"Attributes"}
          cardHeader={function () {
            return (
              <>
                <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
                  <i className="fas fa-question mr-1"/>
                  <span className="mr-2">Help</span>
                </button>
                {/*<a className="utrecht-link" onClick={getAttributes}>*/}
                <a className="utrecht-link">
                  <i className="fas fa-sync-alt mr-1"/>
                  <span className="mr-2">Refresh</span>
                </a>
                <Link to={"/attributes/new/" + id}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i
                    className="fas fa-plus mr-2"/>Add
                  </button>
                </Link>
              </>
            )
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner />
                  ) : (
                    // <Table columns={[{
                    //   headerName: "Name",
                    //   field: "name"
                    // }, {
                    //   headerName: "Type",
                    //   field: "type"
                    // }]} rows={attributes}/>

                    <Table properties={[{ th: "Name", property: "name" }, { th: "Type", property: "type" }]} items={attributes} editLink="/attributes" parentLink={id}/>
                  )}
                </div>
              </div>
            )
          }}
    />
  );
}
