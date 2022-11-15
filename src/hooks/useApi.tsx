import { AxiosResponse } from "axios";
import { useCallback } from "react";
import { HTTP_CLIENT } from "../client/httpClient";
import { REQUEST_TYPE } from "../Enums/RequestType";

export const useApi = () => {
  const accessToken = sessionStorage.getItem("jwt");

  const callApi = useCallback(
    async function <T>(
      requestType: REQUEST_TYPE,
      endpoint: string,
      params?: any
    ): Promise<AxiosResponse<T>> {
      if (!accessToken) {
        throw new Error("No access token");
      }
      const bearer = `Bearer ${accessToken}`;

      let response: AxiosResponse;

      switch (requestType) {
        case REQUEST_TYPE.GET:
          response = await HTTP_CLIENT.get<T>(`${endpoint}`, {
            headers: { Authorization: bearer },
          });
          break;
        case REQUEST_TYPE.POST:
          response = await HTTP_CLIENT.post<T>(`${endpoint}`, params, {
            headers: { Authorization: bearer },
          });
          break;
        case REQUEST_TYPE.PUT:
          response = await HTTP_CLIENT.put<T>(`${endpoint}`, params, {
            headers: { Authorization: bearer },
          });
          break;
        case REQUEST_TYPE.DELETE:
          response = await HTTP_CLIENT.delete<T>(`${endpoint}`, {
            headers: { Authorization: bearer },
          });
          break;
        default:
          throw new Error("Unknown request type");
      }

      if (!response) {
        throw new Error("No response");
      }

      return response;
    },
    [accessToken]
  );

  return {
    callApi,
  };
};
