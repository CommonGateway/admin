import * as React from "react";
import {Link} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
} from "../utility/inputHandler";
import {
  GenericInputComponent,
  Accordion,
  Card,
  Alert,
  Spinner,
  Checkbox,
  SelectInputComponent
} from "@conductionnl/nl-design-system/lib";
import FlashMessage from 'react-flash-message';
import {isLoggedIn} from "../../services/auth";
import ElementCreationNew from "../common/elementCreationNew"


export default function EntityForm({id}) {
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [entity, setEntity] = React.useState(null);
  const [sources, setSources] = React.useState(null);
  const [soaps, setSoaps] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      if (id !== 'new') {
        getEntity();
      }
      getSources();
      getSoaps();
    }
  }, [context]);

  const getEntity = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/entities/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setEntity(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getSources = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/gateways`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setSources(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getSoaps = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/soaps`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setSoaps(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  }

  const saveEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let transformations = retrieveFormArrayAsOArray(event.target, "transformations");
    let translationConfig = retrieveFormArrayAsOArray(event.target, "translationConfig");
    let usedProperties = retrieveFormArrayAsOArray(event.target, "usedProperties");
    let availableProperties = retrieveFormArrayAsOArray(event.target, "availableProperties");
    let collectionConfig = retrieveFormArrayAsOArray(event.target, "collectionConfig");

    let body = {
      name: event.target.name.value,
      description: event.target.description.value ? event.target.description.value : null,
      route: event.target.route.value ? event.target.route.value : null,
      endpoint: event.target.endpoint.value ? event.target.endpoint.value : null,
      gateway: event.target.gateway.value
        ? event.target.gateway.value
        : null,
      extend: event.target.extend.checked,
      function: event.target.function.value ? event.target.function.value : null,
      transformations,
      translationConfig,
      usedProperties,
      availableProperties,
      collectionConfig,
    };



    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name])) {
      return;
    }

    let url = context.adminUrl + "/entities";
    let method = null;
    if (id === "new") {
      method = "POST";
    } else {
      url = `${url}/${id}`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setShowSpinner(false);
        setEntity(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  }

  return (<>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="dataForm" onSubmit={saveEntity}>
        <Card title="Values"
              cardHeader={function () {
                return (<>
                  <Link className="utrecht-link" to={"/entities"}>
                    <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                      <i className="fas fa-long-arrow-alt-left mr-2"/>
                      Back
                    </button>
                  </Link>
                  <button
                    className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                    type="submit"
                  >
                    <i className="fas fa-save mr-2"/>
                    Save
                  </button>
                </>)
              }}
              cardBody={function () {
                return (
                  <div className="row">
                    <div className="col-12">
                      {showSpinner === true ? (
                        <Spinner/>
                      ) : (
                        <>
                          <div className="row">
                            <div className="col-6">
                              {entity !== null && entity.name !== null ? (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={entity.name}
                                                       nameOverride={"Name"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                                       nameOverride={"Name"}/>
                              )}
                            </div>
                            <div className="col-6">
                              {entity !== null && entity.description !== null ? (
                                <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                       data={entity.description} nameOverride={"Description"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                       nameOverride={"Description"}/>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <SelectInputComponent
                                  options={[{name: 'Organization', value: 'organization'}, {
                                    name: 'User',
                                    value: 'user'
                                  }, {name: 'User group', value: 'userGroup'}]}
                                  data={entity && entity.function ? entity.function : null}
                                  name={"function"}
                                  id={"functionInput"}
                                  nameOverride={"Function"}
                                  required={true}/>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {entity !== null && entity.endpoint !== null ? (
                                <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                                                       data={entity.endpoint}
                                                       nameOverride={"Endpoint"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                                                       nameOverride={"Endpoint"}/>
                              )}
                            </div>
                            <div className="col-6">
                              {entity !== null && entity.route !== null ? (
                                <GenericInputComponent type={"text"} name={"route"} id={"routeInput"}
                                                       data={entity.route} nameOverride={"Route"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"route"} id={"routeInput"}
                                                       nameOverride={"Route"}/>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                {
                                  sources !== null && sources.length > 0 ? (
                                    <>
                                      {entity !== null &&
                                      entity.gateway !== undefined &&
                                      entity.gateway !== null ? (
                                          <SelectInputComponent
                                            options={sources}
                                            data={entity.gateway.name}
                                            name={"gateway"} id={"gatewayInput"} nameOverride={"Source"}
                                            value={"/admin/gateways/"}/>
                                        )
                                        : (
                                          <SelectInputComponent
                                            options={sources}
                                            name={"gateway"} id={"gatewayInput"} nameOverride={"Source"}
                                            value={"/admin/gateways/"}/>
                                        )}
                                    </>
                                  ) : (
                                    <SelectInputComponent
                                      options={[{
                                        name: "Please create a Source before creating an Entity",
                                        value: null
                                      }]}
                                      name={"gateway"} id={"gatewayInput"} nameOverride={"Source"}/>
                                  )}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                {
                                  soaps !== null && soaps.length > 0 ? (
                                    <>
                                      {entity !== null &&
                                      entity.toSoap !== undefined &&
                                      entity.toSoap !== null ? (
                                          <SelectInputComponent
                                            options={sources}
                                            data={entity.toSoap.name}
                                            name={"toSoap"} id={"toSoapInput"} nameOverride={"To Soap"}
                                            value={"/admin/soaps/"}/>
                                        )
                                        : (
                                          <SelectInputComponent
                                            options={sources}
                                            name={"toSoap"} id={"toSoapInput"} nameOverride={"To Soap"}
                                            value={"/admin/soaps/"}/>
                                        )}
                                    </>
                                  ) : (
                                    <SelectInputComponent
                                      options={[{name: "Please create a soaps first to use it", value: null}]}
                                      name={"toSoap"} id={"toSoapInput"} nameOverride={"To Soap"}
                                    />
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <div className="form-check">
                                {entity !== null ? (
                                  <>
                                    {entity.extend ? (
                                      <Checkbox type={"checkbox"} id={"extendInput"}
                                                nameLabel={"Extend"} nameAttribute={"extend"}
                                                data={entity.extend}/>
                                    ) : (
                                      <Checkbox type={"checkbox"} id={"extendInput"}
                                                nameLabel={"Extend"} nameAttribute={"extend"}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <Checkbox type={"checkbox"} id={"extendInput"}
                                            nameLabel={"Extend"} nameAttribute={"extend"}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <Accordion
                            id="entityAccordion"
                            items={[{
                              title: "Transformations",
                              id: "transformationsAccordion",
                              render: function () {
                                return <ElementCreationNew
                                  id="transformations"
                                  label="Transformations"
                                  data={entity.transformations}
                                />
                              }
                            },
                              {
                                title: "Translation Config",
                                id: "translationConfigAccordion",
                                render: function () {
                                  return <ElementCreationNew
                                    id="translationConfig"
                                    label="Translation Config"
                                    data={entity.translationConfig}
                                  />
                                }
                              },
                              {
                                title: "Collection Config",
                                id: "collectionConfigAccordion",
                                render: function () {
                                  return <ElementCreationNew
                                    id="collectionConfig"
                                    label="Collection Config"
                                    data={entity.collectionConfig}
                                  />
                                }
                              },
                              {
                                title: "Used Properties",
                                id: "usedPropertiesAccordion",
                                render: function () {
                                  return <ElementCreationNew
                                    id={"usedProperties"}
                                    label={"Used Properties"}
                                    data={entity.usedProperties}
                                  />
                                }
                              },
                              {
                                title: "Available Properties",
                                id: "availablePropertiesAccordion",
                                render: function () {
                                  return <ElementCreationNew
                                    id={"availableProperties"}
                                    label={"Available Properties"}
                                    data={entity.availableProperties}
                                  />
                                }
                              }]}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )
              }}
        />
      </form>
    </>
  );
}
