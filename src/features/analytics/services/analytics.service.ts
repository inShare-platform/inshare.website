import { createApiClient } from "../../../client/client"; 
import { baseUrls } from "../../../config/endpoints";

const client = createApiClient(baseUrls.main);

export const analyticsService = () => {
  return client.get('/docs/auth');
}
