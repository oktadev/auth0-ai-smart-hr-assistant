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
        relations: {},
      },
      {
        type: "employee_document",
        relations: {
          owner: {
            this: {},
          },
          viewer: {
            union: {
              child: [
                { this: {} },
                { computedUserset: { object: "user:*" } },
                {
                  tupleToUserset: {
                    tupleset: { relation: "member" },
                    computedUserset: { object: "team" },
                  },
                },
                {
                  tupleToUserset: {
                    tupleset: { relation: "member" },
                    computedUserset: { object: "role" },
                  },
                },
              ],
            },
          },
          can_view: {
            union: {
              child: [
                { computedUserset: { relation: "owner" } },
                { computedUserset: { relation: "viewer" } },
              ],
            },
          },
        },
      },
      {
        type: "team_document",
        relations: {
          owner: {
            this: {},
          },
          viewer: {
            union: {
              child: [
                { this: {} },
                { computedUserset: { object: "user:*" } },
                {
                  tupleToUserset: {
                    tupleset: { relation: "member" },
                    computedUserset: { object: "team" },
                  },
                },
                {
                  tupleToUserset: {
                    tupleset: { relation: "member" },
                    computedUserset: { object: "role" },
                  },
                },
              ],
            },
          },
          can_view: {
            union: {
              child: [
                { computedUserset: { relation: "owner" } },
                { computedUserset: { relation: "viewer" } },
              ],
            },
          },
        },
      },
      {
        type: "company_document",
        relations: {
          owner: {
            this: {},
          },
          viewer: {
            union: {
              child: [{ computedUserset: { object: "user:*" } }],
            },
          },
          can_view: {
            union: {
              child: [
                { computedUserset: { relation: "owner" } },
                { computedUserset: { relation: "viewer" } },
              ],
            },
          },
        },
      },
      {
        type: "team",
        relations: {
          member: {
            union: {
              child: [
                { this: {} },
                {
                  tupleToUserset: {
                    tupleset: { relation: "member" },
                    computedUserset: { object: "team" },
                  },
                },
              ],
            },
          },
        },
      },
      {
        type: "role",
        relations: {
          member: {
            union: {
              child: [
                { this: {} },
                {
                  tupleToUserset: {
                    tupleset: { relation: "member" },
                    computedUserset: { object: "role" },
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
        // User role assignments
        { user: "user:admin", relation: "member", object: "role:admin" },
        { user: "user:priya", relation: "member", object: "role:hr" },
        { user: "user:david", relation: "member", object: "role:manager" },
        { user: "user:deepa", relation: "member", object: "role:manager" },
        { user: "user:michael", relation: "member", object: "role:manager" },
        { user: "user:karthik", relation: "member", object: "role:manager" },
        { user: "user:james", relation: "member", object: "role:manager" },

        // Team memberships
        { user: "user:anastasia", relation: "member", object: "team:backend" },
        { user: "user:jose", relation: "member", object: "team:platform" },
        { user: "user:sabitha", relation: "member", object: "team:frontend" },
        { user: "user:wei", relation: "member", object: "team:backend" },
        { user: "user:ronja", relation: "member", object: "team:devops" },

        // Public documents - accessible to all users
        { user: "user:*", relation: "viewer", object: "employee_document:anastasia_kuznetsova_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:david_kim_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:deepa_krishnan_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:james_wilson_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:jose_garcia_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:karthik_subramanian_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:michael_rodriguez_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:priya_venkatesh_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:ronja_kohler_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:sabitha_hari_public" },
        { user: "user:*", relation: "viewer", object: "employee_document:wei_chen_public" },

        // Private documents - owner relationships
        { user: "user:anastasia", relation: "owner", object: "employee_document:anastasia_kuznetsova_private" },
        { user: "user:david", relation: "owner", object: "employee_document:david_kim_private" },
        { user: "user:deepa", relation: "owner", object: "employee_document:deepa_krishnan_private" },
        { user: "user:james", relation: "owner", object: "employee_document:james_wilson_private" },
        { user: "user:jose", relation: "owner", object: "employee_document:jose_garcia_private" },
        { user: "user:karthik", relation: "owner", object: "employee_document:karthik_subramanian_private" },
        { user: "user:michael", relation: "owner", object: "employee_document:michael_rodriguez_private" },
        { user: "user:priya", relation: "owner", object: "employee_document:priya_venkatesh_private" },
        { user: "user:ronja", relation: "owner", object: "employee_document:ronja_kohler_private" },
        { user: "user:sabitha", relation: "owner", object: "employee_document:sabitha_hari_private" },
        { user: "user:wei", relation: "owner", object: "employee_document:wei_chen_private" },

        // HR and Admin access to private documents
        { user: "role:hr#member", relation: "viewer", object: "employee_document:anastasia_kuznetsova_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:david_kim_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:deepa_krishnan_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:james_wilson_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:jose_garcia_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:karthik_subramanian_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:michael_rodriguez_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:priya_venkatesh_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:ronja_kohler_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:sabitha_hari_private" },
        { user: "role:hr#member", relation: "viewer", object: "employee_document:wei_chen_private" }
      ],
    },
    {
      authorizationModelId: model.authorization_model_id,
    }
  );

  console.log(
    "Successfully initialized FGA store with authorization model and test data"
  );
}

main().catch(console.error);
