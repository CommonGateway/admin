import axios, { AxiosInstance } from 'axios';
import Application from './resources/application';
import Attribute from './resources/attribute';
import Source from './resources/source';
import Entity from './resources/entity';
import Entity_objects from "./resources/entity_objects";
import Login from './services/login';

export default class APIService {
  private _jwtToken: string;

  constructor (_jwtToken: string) {
    this._jwtToken = _jwtToken
  }

  public get adminClient (): AxiosInstance {
    return axios.create({
      baseURL: process.env.GATSBY_ADMIN_URL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: "Bearer " + this._jwtToken,
      }
    });
  }

  public get apiClient (): AxiosInstance {
    return axios.create({
      baseURL: process.env.GATSBY_API_URL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  }

  // Resources
  public get Application (): Application { return new Application(this.adminClient) }
  public get Attribute (): Attribute { return new Attribute(this.adminClient) }
  public get Source (): Source { return new Source(this.adminClient) }
  public get Entity (): Entity { return new Entity(this.adminClient) }
  public get Entity_objects (): Entity_objects { return new Entity_objects(this.adminClient) }

  // Services
  public get Login (): Login { return new Login(this.apiClient) }
}
