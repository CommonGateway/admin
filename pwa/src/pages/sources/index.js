import * as React from "react"
import { useEffect, useState } from "react";
import { Link } from "gatsby"
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";

const IndexPage = () => {
  const context = useUrlContext();

  const pageDescription = "On this page u can view and create your gateways sources.";

  const [sources, setSources] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/gateways", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
          setSources(data['hydra:member']);
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getSources();
  }, []);


  return (
    <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            <title>Gateway - Sources</title>

            <div className="utrecht-card card">

              <div className="utrecht-card-header card-header">
                <div className="utrecht-card-head-row card-head-row row">
                  <div className="col-6">
                    <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Sources</h4>
                  </div>
                  <div className="col-6 text-right">
                    <a class="utrecht-link">
                      <i className="fas fa-question mr-1"></i>
                      <span className="mr-2">Help</span>
                    </a>
                    <a class="utrecht-link" onClick={getSources}>
                      <i className="fas fa-sync-alt mr-1"></i>
                      <span className="mr-2">Refresh</span>
                    </a>
                    <Link to="/sources/new">
                      <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i className="fas fa-plus mr-2"></i>Add</button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="utrecht-card-body card-body">
                <div className="row">
                  <div className="col-12">
                    {
                      showSpinner == true ?
                    <div className="text-center pt-5">
                      <div class="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div> :
                    <div className="utrecht-html">
                      <table lang="nl" summary="Overview of sources fetched from the gateway." className="table">
                        {/*<caption></caption>*/}
                        <thead>
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Location</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        {
                          sources !== null &&
                            <tbody>
                              {
                                sources.map((row) => (
                                  <tr>
                                    <td>{row.name}</td>
                                    <td>{row.location}</td>
                                    <td className="text-right"><Link to={"/sources/" + row.id}><button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1"></i>Edit</button></Link></td>
                                  </tr>
                                ))
                              }
                            </tbody>
                         }
                      </table>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </main>
      </Layout>

      )
}

      export default IndexPage
