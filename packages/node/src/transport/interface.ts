export interface HttpClient {
  request(
    requestUrl: string,
    method: string,
    headers: Record<string, string>,
    data?: Record<string, string>,
  ): Promise<Response>;
}
