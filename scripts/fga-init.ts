import "dotenv/config";

import { CredentialsMethod, OpenFgaClient } from "@openfga/sdk";

/**
 * Initializes the OpenFgaClient, writes an authorization model, and configures pre-defined tuples.
 *
 * This function performs the following steps:
 *    1. Creates an instance of OpenFgaClient with the necessary configuration.
 *    2. Writes an authorization model with specified schema version and type definitions.
 *    3. Configures pre-defined tuples using the newly created authorization model.
 */
async function main() {
  const fgaClient = new OpenFgaClient({
    apiUrl: process.env.FGA_API_URL || "https://api.us1.fga.dev",
    storeId: process.env.FGA_STORE_ID!,
    credentials: {
      method: CredentialsMethod.ClientCredentials,
      config: {
        apiTokenIssuer: process.env.FGA_API_TOKEN_ISSUER || "auth.fga.dev",
        apiAudience: process.env.FGA_API_AUDIENCE || "https://api.us1.fga.dev/",
        clientId: process.env.FGA_CLIENT_ID!,
        clientSecret: process.env.FGA_CLIENT_SECRET!,
      },
    },
  });

  const authorizationModel = {
    schema_version: "1.1",
    type_definitions: [
      {
        type: "user",
        relations: {
          is_employee: {
            this: {},
          },
          is_manager: {
            this: {},
          },
          is_hr: {
            this: {},
          },
          is_admin: {
            this: {},
          },
        },
      },
      {
        type: "employee_document",
        relations: {
          viewer: {
            union: {
              child: [
                {
                  // Document owner can view their own documents
                  computedUserset: {
                    relation: "owner",
                  },
                },
                {
                  // Manager can view their team members' documents
                  computedUserset: {
                    relation: "manager",
                  },
                },
                {
                  // HR can view all employee documents
                  tupleToUserset: {
                    tupleset: {
                      relation: "is_hr",
                    },
                    computedUserset: {
                      object: "user",
                    },
                  },
                },
                {
                  // Admin can view all documents
                  tupleToUserset: {
                    tupleset: {
                      relation: "is_admin",
                    },
                    computedUserset: {
                      object: "user",
                    },
                  },
                },
              ],
            },
          },
          owner: {
            this: {},
          },
          manager: {
            this: {},
          },
        },
      },
      {
        type: "team_document",
        relations: {
          viewer: {
            union: {
              child: [
                {
                  // Team members can view team documents
                  computedUserset: {
                    relation: "team_member",
                  },
                },
                {
                  // HR can view all team documents
                  tupleToUserset: {
                    tupleset: {
                      relation: "is_hr",
                    },
                    computedUserset: {
                      object: "user",
                    },
                  },
                },
                {
                  // Admin can view all documents
                  tupleToUserset: {
                    tupleset: {
                      relation: "is_admin",
                    },
                    computedUserset: {
                      object: "user",
                    },
                  },
                },
              ],
            },
          },
          team_member: {
            this: {},
          },
        },
      },
      {
        type: "company_document",
        relations: {
          viewer: {
            union: {
              child: [
                {
                  // All employees can view company documents
                  tupleToUserset: {
                    tupleset: {
                      relation: "is_employee",
                    },
                    computedUserset: {
                      object: "user",
                    },
                  },
                },
                {
                  // HR can view all company documents
                  tupleToUserset: {
                    tupleset: {
                      relation: "is_hr",
                    },
                    computedUserset: {
                      object: "user",
                    },
                  },
                },
                {
                  // Admin can view all documents
                  tupleToUserset: {
                    tupleset: {
                      relation: "is_admin",
                    },
                    computedUserset: {
                      object: "user",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  };

  // 01. WRITE MODEL
  const model = await fgaClient.writeAuthorizationModel(authorizationModel);

  console.log("NEW MODEL ID: ", model.authorization_model_id);

  // 02. CONFIGURE PRE-DEFINED TUPLES
  await fgaClient.write(
    {
      writes: [
        // Set up some test users with different roles
        { user: "user:john", relation: "is_employee", object: "user:john" },
        { user: "user:jane", relation: "is_hr", object: "user:jane" },
        { user: "user:alice", relation: "is_manager", object: "user:alice" },
        { user: "user:admin", relation: "is_admin", object: "user:admin" },

        // Set up document ownership and relationships
        { user: "user:john", relation: "owner", object: "employee_document:john_profile" },
        { user: "user:alice", relation: "manager", object: "employee_document:john_profile" },
        
        // Set up team membership
        { user: "user:john", relation: "team_member", object: "team_document:engineering" },
        { user: "user:alice", relation: "team_member", object: "team_document:engineering" },
      ],
    },
    {
      authorizationModelId: model.authorization_model_id,
    }
  );

  console.log("Successfully initialized FGA store with authorization model and test data");
}

main().catch(console.error);
