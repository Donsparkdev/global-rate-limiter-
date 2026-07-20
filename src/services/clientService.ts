export interface Client {
  id: string;
  apiKey: string;
  requestsPerMinute: number;
}

const clients: Client[] = [
  {
    id: "clientA",
    apiKey: "clientA-key",
    requestsPerMinute: 100,
  },
  {
    id: "clientB",
    apiKey: "clientB-key",
    requestsPerMinute: 5000,
  },
];

export function getClient(apiKey: string): Client | undefined {
  return clients.find(client => client.apiKey === apiKey);
}
