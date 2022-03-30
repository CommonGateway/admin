import * as React from "react";
import { Card, InfoTooltip } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { AlertContext } from "../../context/alertContext";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { navigate } from "gatsby-link";
import "./collectionStoreCard.css";
import LabelWithBackground from "../LabelWithBackground/LabelWithBackground";

interface CollectionStoreCardProps {
  repository: any;
}

export const CollectionStoreCard: React.FC<CollectionStoreCardProps> = ({ repository }) => {
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useState<boolean>(false);
  const [_, setAlert] = React.useContext(AlertContext);
  const API: APIService = React.useContext(APIContext);

  const installRepository = useMutation<any, Error, any>(["repositories", repository.id], () => API.Repository.install(repository.id), {
    onMutate: () => {
      setLoadingOverlay(true);
    },
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    onSuccess: async (_) => {
      setAlert({ message: "Installed repository", type: "success" });
      navigate("/collections");
    },
    onSettled: () => {
      setLoadingOverlay(false);
    }
  });

  console.log({repository})

  React.useEffect(() => {
    setHeader("Repositories");
  }, [setHeader]);

  return (
    <Card
      key={repository.id}
      title={repository.name}
      cardHeader={function() {
        return (
          <div>
            <Link className="utrecht-link" to={`/collectionStore/${repository.id}`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <FontAwesomeIcon icon={faInfo} />
              </button>
            </Link>
            <button
              onClick={() => installRepository.mutateAsync({ id: repository.id })}
              className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
              type="submit"
            >
              Install
            </button>
          </div>
        );
      }}
      cardBody={function() {
        return (
          <div>
            <div className="container">
              <img src={repository?.owner?.avatar_url} alt="url" />
              <div className="row">
                <div className="col-4">
                  <span className="card-text">{repository.owner?.type === "Organization" ? "Org: " : "User"}</span>
                  <span className="text-truncate">{repository.owner["login"]}</span>
                </div>
                <div className="col-4">
                  <span className="card-text">Repo: </span>
                  <span className="text-truncate">{repository.name}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <span className="card-text">Languages: </span>
                  {repository.languages?.map(([$key, _], idx) => (
                    <span key={idx} className="text-truncate">{$key} </span>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <span className="card-text">Labels: </span>
                  {repository.labels?.map(($item, idx) => (
                    <span key={idx} className="text-truncate">
                    <InfoTooltip
                      content={$item.description}
                      placement={"bottom"}
                      layoutClassName="genericInput-tooltip"
                    />
                    <LabelWithBackground color={$item.color} label={$item.name} />
                  </span>
                  ))}
                </div>
              </div>
              <div className="row card-description">
                <div className="col-12">
                  <span>{repository.description}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};
