import * as React from "react";
import Layout from "../../components/common/layout";
import ApplicationForm from "../../components/applications/applicationForm";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id

  return (
    <Layout title='Application' subtext="Edit your application here">
      <main>
        <div className="row">
          <div className="col-12">
            <ApplicationForm {...{ id }} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
