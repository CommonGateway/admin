import * as React from "react";
import Layout from "../../components/common/layout";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import EndpointForm from "../../components/endpoints/form";
import HandlerTable from "../../components/handlers/handlerTable";

const IndexPage = (props) => {
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    }
  }, [context]);

  return (
    <Layout title={"Endpoints"} subtext={"Create or modify your endpoint"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    { name: "Overview", id: "overview", active: true },
                    {
                      name: "Handlers",
                      id: "handlers",
                    },
                  ]}
                />
              ) : (
                <Tabs
                  items={[{ name: "Overview", id: "overview", active: true }]}
                />
              )}
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview-tab"
              >
                <br />
                <EndpointForm id={props.params.id}/>
              </div>
              <div
                className="tab-pane"
                id="handlers"
                role="tabpanel"
                aria-labelledby="handlers-tab"
              >
                <br />
                <HandlerTable id={props.params.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
