import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Entity {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = (): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", "/attributes");
  };

  public getOne = (id: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/attributes/${id}`);
  };

  public create = (data: any): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "POST", "/attributes", data);
  };

  public update = (data: any, id: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "PUT", `/attributes/${id}`, data);
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/attributes?entity.id=${entityId}`);
  };

  public delete = (id: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "DELETE", `/attributes/${id}`);
  };
}
