import http from 'http';
import https from 'https';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import url from 'url';

import { SimpleResponse, HttpClient } from '../types/transport';

const request: HttpClient['request'] = (
  requestUrl: string,
  method: string,
  headers: Record<string, string>,
  data?: Record<string, string>,
): Promise<SimpleResponse> => {
  const urlParams = url.parse(requestUrl);
  if (method === 'GET' && data) {
    urlParams.path = `${urlParams.path}?${querystring.encode(
      data as ParsedUrlQueryInput,
    )}`;
  }
  const options = {
    ...urlParams,
    method,
    headers,
  };

  return new Promise((resolve, reject) => {
    const protocol = urlParams.protocol === 'http:' ? http : https;
    const req = protocol.request(options, (res) => {
      res.setEncoding('utf-8');
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: responseBody,
        });
      });
    });

    req.on('error', reject);
    if (method !== 'GET' && data) {
      req.write(data);
    }
    req.end();
  });
};

export const FetchHttpClient: HttpClient = {
  request,
};
