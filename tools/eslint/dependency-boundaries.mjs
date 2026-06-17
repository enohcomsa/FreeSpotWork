const layers = {
  APP: 'layer:app',
  FEATURE: 'layer:feature',
  DATA_ACCESS: 'layer:data-access',
  DOMAIN: 'layer:domain',
  UI: 'layer:ui',

  CORE_FEATURE: 'layer:core-feature',
  CORE_DATA_ACCESS: 'layer:core-data-access',
  CORE_DOMAIN: 'layer:core-domain',
  CORE_UI: 'layer:core-ui',

  SHARED_DOMAIN: 'layer:shared-domain',
  SHARED_UI: 'layer:shared-ui',
  SHARED_UTIL: 'layer:shared-util',

  API_CLIENT: 'layer:api-client',
};

const roles = {
  APP_SHELL: 'role:app-shell',
  COMPOSITION: 'role:composition',
  ENTRY_FEATURE: 'role:entry-feature',
  LEAF: 'role:leaf',
};

const businessDomains = [
  'academic-schedule',
  'activity-bookings',
  'activity-rescheduling',
  'admin-academic-structure',
  'admin-events',
  'admin-timetabling',
  'admin-university-map',
  'admin-user-access',
  'event-registration',
  'events-catalog',
  'my-events',
  'university-map',
  'user-setup',
];

const businessDomainsRules = businessDomains.map((domain) => ({
  sourceTag: `domain:${domain}`,
  onlyDependOnLibsWithTags: [
    `domain:${domain}`,

    layers.CORE_DOMAIN,
    layers.CORE_DATA_ACCESS,

    layers.SHARED_DOMAIN,
    layers.SHARED_UI,
    layers.SHARED_UTIL,

    layers.API_CLIENT,
  ],
}));

export const dependencyBoundaries = {
  allow: [],

  depConstraints: [
    // platform
    {
      sourceTag: 'platform:frontend',
      notDependOnLibsWithTags: ['platform:backend'],
    },
    {
      sourceTag: 'platform:backend',
      notDependOnLibsWithTags: ['platform:frontend'],
    },

    // product
    {
      sourceTag: 'product:freespot',
      onlyDependOnLibsWithTags: ['product:freespot'],
    },

    // domain
    ...businessDomainsRules,

    // roles
    {
      sourceTag: roles.APP_SHELL,
      onlyDependOnLibsWithTags: [
        roles.COMPOSITION,
        roles.ENTRY_FEATURE,
        layers.CORE_DATA_ACCESS,
        layers.CORE_DOMAIN
      ],
    },
    {
      sourceTag: roles.COMPOSITION,
      onlyDependOnLibsWithTags: [
        roles.LEAF,
        layers.CORE_DATA_ACCESS,
      ],
    },

    // layers
    {
      sourceTag: layers.APP,
      onlyDependOnLibsWithTags: [
        layers.FEATURE,
        layers.CORE_FEATURE,
        layers.CORE_DATA_ACCESS,
        layers.CORE_DOMAIN
      ],
    },
    {
      allSourceTags: [
        layers.FEATURE,
        roles.ENTRY_FEATURE,
      ],
      onlyDependOnLibsWithTags: [
        layers.DATA_ACCESS,
        layers.DOMAIN,
        layers.UI,
        layers.CORE_DOMAIN,
        layers.CORE_DATA_ACCESS,
        layers.SHARED_UI,
        layers.SHARED_UTIL,
        layers.SHARED_DOMAIN
      ],
    },
    {
      allSourceTags: [
        layers.FEATURE,
        roles.LEAF,
      ],
      onlyDependOnLibsWithTags: [
        layers.DATA_ACCESS,
        layers.DOMAIN,
        layers.UI,
        layers.CORE_DOMAIN,
        layers.CORE_DATA_ACCESS,
        layers.SHARED_UI,
        layers.SHARED_UTIL,
        layers.SHARED_DOMAIN
      ],
    },
    {
      sourceTag: layers.DATA_ACCESS,
      onlyDependOnLibsWithTags: [
        layers.DOMAIN,
        layers.CORE_DOMAIN,
        layers.CORE_DATA_ACCESS,
        layers.SHARED_DOMAIN,
        layers.SHARED_UTIL,
        layers.API_CLIENT,
      ],
    },
    {
      sourceTag: layers.DOMAIN,
      onlyDependOnLibsWithTags: [
        layers.SHARED_DOMAIN,
        layers.CORE_DOMAIN,
      ],
    },
    {
      sourceTag: layers.UI,
      onlyDependOnLibsWithTags: [
        layers.SHARED_UI,
        layers.SHARED_UTIL,
        layers.SHARED_DOMAIN
      ],
    },

    // core layers
    {
      sourceTag: layers.CORE_DOMAIN,
      onlyDependOnLibsWithTags: [
        layers.SHARED_DOMAIN,
      ],
    },
    {
      sourceTag: layers.CORE_DATA_ACCESS,
      onlyDependOnLibsWithTags: [
        layers.CORE_DOMAIN,
        layers.SHARED_DOMAIN,
        layers.SHARED_UTIL,
        layers.API_CLIENT,
      ],
    },
    {
      sourceTag: layers.CORE_FEATURE,
      onlyDependOnLibsWithTags: [
        layers.CORE_DOMAIN,
        layers.CORE_DATA_ACCESS,
        layers.SHARED_UI,
        layers.SHARED_UTIL,
      ],
    },
    {
      sourceTag: layers.CORE_UI,
      onlyDependOnLibsWithTags: [
        layers.SHARED_UI,
        layers.SHARED_UTIL,
      ],
    },

    // shared / api
    {
      sourceTag: layers.SHARED_DOMAIN,
      onlyDependOnLibsWithTags: [],
    },
    {
      sourceTag: layers.SHARED_UI,
      onlyDependOnLibsWithTags: [
        layers.SHARED_UTIL,
        layers.SHARED_DOMAIN
      ],
    },
    {
      sourceTag: layers.SHARED_UTIL,
      onlyDependOnLibsWithTags: [],
    },
    {
      sourceTag: layers.API_CLIENT,
      onlyDependOnLibsWithTags: [
        layers.API_CLIENT,
      ],
    },
  ],
};
