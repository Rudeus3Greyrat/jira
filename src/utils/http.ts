import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // axios 和 fetch 的表现不一样，axios可以直接在返回状态不为2xx的时候抛出异常
  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout();
        window.location.reload();
        return Promise.reject({ message: "请重新登录" });
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};

export const useHttp = () => {
  const { user } = useAuth();
  // TODO 讲解 TS Utility Types
  //js中的typeof是在runtime时运行的，ts中的typeof是在静态环境运行的
  // utility type的用法：用泛型给它传入一个其它类型，然后utility type对这个类型进行某种操作
  return (...[endpoint, config]: Parameters<typeof http>) =>
    http(endpoint, { ...config, token: user?.token });
};

// interface在这种情况下没法替代type
type FavoriteNumber=string|number

//interface也没法实现Utility type
type Person={
  name:string,
  age:number
}

const xiaoming:Partial<Person>={name:'xiaoming'}
const shenMiRen:Omit<Person, 'name'|'age'>= { age:10}
type PersonKeys= keyof Person
type PersonOnlyName=Pick<Person, 'name'>
type PersonExcludeName=Exclude<PersonKeys, 'name'>

//Partial的实现
type Partial<T> = {
  [P in keyof T]?: T[P];
};

//Pick的实现
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

//Exclude的实现
type Exclude<T, U> = T extends U ? never : T;

//Omit
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
