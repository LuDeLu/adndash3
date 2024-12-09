declare namespace gapi {
  let client: {
    init: (args: { apiKey: string; discoveryDocs: string[] }) => Promise<void>;
    calendar: {
      events: {
        list: (args: any) => Promise<any>;
        insert: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
        delete: (args: any) => Promise<any>;
      };
    };
    getToken: () => { access_token: string } | null;
  };

  function load(api: string, callback: () => void): void;
}

declare namespace google.accounts.oauth2 {
  class TokenClient {
    callback: (response: { access_token: string; error?: string }) => void;
    requestAccessToken: (args?: { prompt?: string }) => void;
  }

  function initTokenClient(args: {
    client_id: string;
    scope: string;
    callback: string;
  }): TokenClient;
}

