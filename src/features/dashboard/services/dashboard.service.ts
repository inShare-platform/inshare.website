import { createApiClient } from "../../../client/client"
import { baseUrls } from "../../../config/endpoints";

const client = createApiClient(baseUrls.main);

export const dashboardService = () => {
    return client.get('/users');
}


