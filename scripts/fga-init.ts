import * as fs from 'fs';
import * as path from 'path';

import { CredentialsMethod, OpenFgaClient } from '@openfga/sdk';

/**
 * Initializes the OpenFgaClient, writes an authorization model, and configures pre-defined tuples.
 *
 * This function performs the following steps:
 *    1. Creates an instance of OpenFgaClient with the necessary configuration.
 *    2. Writes an authorization model with specified schema version and type definitions.
 *    3. Configures pre-defined tuples using the newly created authorization model.
 */
async function main() {
  require('dotenv').config({ path: ['.env.local', '.env'] });
  const fgaClient = new OpenFgaClient({
    apiUrl: process.env.FGA_API_URL || 'https://api.us1.fga.dev',
    storeId: process.env.FGA_STORE_ID!,
    credentials: {
      method: CredentialsMethod.ClientCredentials,
      config: {
        apiTokenIssuer: process.env.FGA_API_TOKEN_ISSUER || 'auth.fga.dev',
        apiAudience: process.env.FGA_API_AUDIENCE || 'https://api.us1.fga.dev/',
        clientId: process.env.FGA_CLIENT_ID!,
        clientSecret: process.env.FGA_CLIENT_SECRET!,
      },
    },
  });

  const authorizationModel = {
    schema_version: '1.1',
    type_definitions: [
      {
        metadata: {
          relations: {
            can_manage: {},
            team: {
              directly_related_user_types: [
                {
                  type: 'team',
                },
              ],
            },
          },
        },
        relations: {
          can_manage: {
            tupleToUserset: {
              computedUserset: {
                relation: 'manager',
              },
              tupleset: {
                relation: 'team',
              },
            },
          },
          team: {
            this: {},
          },
        },
        type: 'user',
      },
      {
        metadata: {
          relations: {
            is_admin: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
            is_hr: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
            member: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
          },
        },
        relations: {
          is_admin: {
            this: {},
          },
          is_hr: {
            this: {},
          },
          member: {
            union: {
              child: [
                {
                  this: {},
                },
                {
                  computedUserset: {
                    relation: 'is_admin',
                  },
                },
                {
                  computedUserset: {
                    relation: 'is_hr',
                  },
                },
              ],
            },
          },
        },
        type: 'company',
      },
      {
        metadata: {
          relations: {
            manager: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
            member: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
          },
        },
        relations: {
          manager: {
            this: {},
          },
          member: {
            union: {
              child: [
                {
                  this: {},
                },
                {
                  computedUserset: {
                    relation: 'manager',
                  },
                },
              ],
            },
          },
        },
        type: 'team',
      },
      {
        metadata: {
          relations: {
            can_read: {},
            company: {
              directly_related_user_types: [
                {
                  type: 'company',
                },
              ],
            },
            owner: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
          },
        },
        relations: {
          can_read: {
            union: {
              child: [
                {
                  computedUserset: {
                    relation: 'owner',
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'is_hr',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'is_admin',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
              ],
            },
          },
          company: {
            this: {},
          },
          owner: {
            this: {},
          },
        },
        type: 'salary_information',
      },
      {
        metadata: {
          relations: {
            can_read: {},
            company: {
              directly_related_user_types: [
                {
                  type: 'company',
                },
              ],
            },
            owner: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
          },
        },
        relations: {
          can_read: {
            union: {
              child: [
                {
                  computedUserset: {
                    relation: 'owner',
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'is_hr',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'can_manage',
                    },
                    tupleset: {
                      relation: 'owner',
                    },
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'is_admin',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
              ],
            },
          },
          company: {
            this: {},
          },
          owner: {
            this: {},
          },
        },
        type: 'performance_review',
      },
      {
        metadata: {
          relations: {
            can_read: {},
            company: {
              directly_related_user_types: [
                {
                  type: 'company',
                },
              ],
            },
            owner: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
          },
        },
        relations: {
          can_read: {
            union: {
              child: [
                {
                  computedUserset: {
                    relation: 'owner',
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'is_hr',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'is_admin',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
              ],
            },
          },
          company: {
            this: {},
          },
          owner: {
            this: {},
          },
        },
        type: 'employee_information',
      },
      {
        metadata: {
          relations: {
            can_read: {},
            company: {
              directly_related_user_types: [
                {
                  type: 'company',
                },
              ],
            },
            owner: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
            team: {
              directly_related_user_types: [
                {
                  type: 'team',
                },
              ],
            },
          },
        },
        relations: {
          can_read: {
            union: {
              child: [
                {
                  computedUserset: {
                    relation: 'owner',
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'member',
                    },
                    tupleset: {
                      relation: 'team',
                    },
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'is_admin',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
              ],
            },
          },
          company: {
            this: {},
          },
          owner: {
            this: {},
          },
          team: {
            this: {},
          },
        },
        type: 'team_document',
      },
      {
        metadata: {
          relations: {
            can_read: {},
            company: {
              directly_related_user_types: [
                {
                  type: 'company',
                },
              ],
            },
            owner: {
              directly_related_user_types: [
                {
                  type: 'user',
                },
              ],
            },
          },
        },
        relations: {
          can_read: {
            union: {
              child: [
                {
                  computedUserset: {
                    relation: 'owner',
                  },
                },
                {
                  tupleToUserset: {
                    computedUserset: {
                      relation: 'member',
                    },
                    tupleset: {
                      relation: 'company',
                    },
                  },
                },
              ],
            },
          },
          company: {
            this: {},
          },
          owner: {
            this: {},
          },
        },
        type: 'public_document',
      },
    ],
  };

  // 01. WRITE MODEL
  // @ts-ignore
  const model = await fgaClient.writeAuthorizationModel(authorizationModel);

  console.log('NEW MODEL ID: ', model.authorization_model_id);

  const users = [
    'admin',
    'sabitha',
    'priya',
    'david',
    'deepa',
    'michael',
    'jose',
    'anastasia',
    'james',
    'wei',
    'ronja',
    'karthik',
  ];

  const userTuples = users.map((user) => ({
    user: `user:${user}`,
    relation: 'member',
    object: 'company:zeko',
  }));

  //   01. WRITE USER TUPLES
  await fgaClient.write(
    { writes: userTuples },
    {
      authorizationModelId: model.authorization_model_id,
    },
  );

  console.log('USER TUPLES: done');

  const userDocTuples: any[] = [];
  const employeeFiles = readDocuments('src/data/employees');

  users.forEach((user) => {
    const employeePrivateFiles = employeeFiles.filter((file) => file.includes(user) && file.includes('private'));
    employeePrivateFiles.forEach((file) => {
      userDocTuples.push({
        user: `user:${user}`,
        relation: 'owner',
        object: file,
      });
    });
  });

  //   02. WRITE USER DOC TUPLES
  await fgaClient.write(
    { writes: userDocTuples },
    {
      authorizationModelId: model.authorization_model_id,
    },
  );

  console.log('USER DOC TUPLES: done');

  const publicFiles = readDocuments('src/data/policies');
  const publicDocTuples = publicFiles.map((file) => ({
    user: 'company:zeko',
    relation: 'company',
    object: file,
  }));

  //   03. WRITE PUBLIC DOC TUPLES
  await fgaClient.write(
    { writes: publicDocTuples },
    {
      authorizationModelId: model.authorization_model_id,
    },
  );

  console.log('PUBLIC DOC TUPLES: done');

  const publicEmployeeDocTuples = employeeFiles
    .filter((file) => file.includes('public'))
    .map((file) => ({
      user: 'company:zeko',
      relation: 'company',
      object: file,
    }));

  //   04. WRITE PUBLIC DOC TUPLES
  await fgaClient.write(
    { writes: publicEmployeeDocTuples },
    {
      authorizationModelId: model.authorization_model_id,
    },
  );

  console.log('PUBLIC EMPLOYEE DOC TUPLES: done');

  // 05. WRITE OTHER TUPLES
  await fgaClient.write(
    {
      // prettier-ignore
      writes: [
        { user: 'user:admin', relation: 'is_admin', object: 'company:zeko' },
        { user: 'user:priya', relation: 'is_hr', object: 'company:zeko' },

        // Team managers
        { user: 'user:david', relation: 'manager', object: 'team:backend' },
        { user: 'user:deepa', relation: 'manager', object: 'team:frontend' },
        { user: 'user:michael', relation: 'manager', object: 'team:platform' },
        { user: 'user:karthik', relation: 'manager', object: 'team:devops' },
        
        // Team memberships
        { user: 'user:sabitha', relation: 'manager', object: 'team:frontend' },
        { user: "user:anastasia", relation: "member", object: "team:backend" },
        { user: "user:jose", relation: "member", object: "team:platform" },
        { user: "user:sabitha", relation: "member", object: "team:frontend" },
        { user: "user:wei", relation: "member", object: "team:backend" },
        { user: "user:ronja", relation: "member", object: "team:devops" },

        // Team public documents
        { user: "company:zeko", relation: "company", object: "public_document:eng_team_okrs_public.pdf" },
        { user: "company:zeko", relation: "company", object: "public_document:eng_team_structure_public.pdf" },
        { user: "company:zeko", relation: "company", object: "public_document:weekly_updates_public.pdf" },

        // Team private documents
        { user: "team:backend", relation: "team", object: "team_document:meeting_notes.pdf" },
        { user: "team:backend", relation: "team", object: "team_document:backend_team_private.md" },
        { user: "team:devops", relation: "team", object: "team_document:devops_team_private.md" },
        { user: "team:frontend", relation: "team", object: "team_document:frontend_team_private.md" },
        { user: "team:platform", relation: "team", object: "team_document:platform_team_private.md" },
        ],
    },
    {
      authorizationModelId: model.authorization_model_id,
    },
  );

  console.log('Successfully initialized FGA store with authorization model and test data');
}

function readDocuments(docPath: string) {
  const dir = path.join(process.cwd(), docPath);

  try {
    // Verify the directory exists
    if (!fs.existsSync(dir)) {
      console.error(`Directory ${dir} does not exist`);
      return [];
    }

    // Read all files in the directory
    return fs.readdirSync(dir);
  } catch (error) {
    console.error('Error reading documents:', error);
    return [];
  }
}

main().catch(console.error);
