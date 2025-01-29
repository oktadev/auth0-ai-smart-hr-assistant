import { AuthorizationModel } from "@openfga/sdk";

export const authorizationModel: AuthorizationModel = {
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
                // All employees can view public company documents
                tupleToUserset: {
                  tupleset: {
                    relation: "is_employee",
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