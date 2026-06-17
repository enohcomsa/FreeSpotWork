cat > docs/architecture/dependency-boundaries.md <<'EOF'
# Dependency boundaries

This document describes the Nx dependency boundary rules for the FreeSpot frontend architecture.

## Tag taxonomy

### Platform

platform:frontend
platform:backend

### Product

product:freespot

### Business domain

domain:<business-domain>

Current business domains:

- academic-schedule
- activity-bookings
- activity-rescheduling
- admin-academic-structure
- admin-events
- admin-timetabling
- admin-university-map
- admin-user-access
- event-registration
- events-catalog
- my-events
- university-map
- user-setup

### Layer

- layer:app
- layer:feature
- layer:data-access
- layer:domain
- layer:ui

- layer:core-feature
- layer:core-data-access
- layer:core-domain
- layer:core-ui

- layer:shared-domain
- layer:shared-ui
- layer:shared-util

- layer:api-client

### Role

- role:app-shell
- role:composition
- role:entry-feature
- role:leaf

## Layer dependency matrix

| Source | Allowed |
|----------|----------|
| app | feature |
| feature + entry-feature | data-access, domain, ui, core-domain, core-data-access, shared-ui, shared-util |
| feature + leaf | data-access, domain, ui, core-domain, core-data-access, shared-ui, shared-util |
| data-access | domain, core-domain, core-data-access, shared-domain, shared-util, api-client |
| domain | shared-domain, core-domain |
| ui | shared-ui, shared-util |
| core-domain | shared-domain |
| core-data-access | core-domain, shared-domain, shared-util, api-client |
| core-feature | core-domain, core-data-access, shared-ui, shared-util |
| core-ui | shared-ui, shared-util |
| shared-domain | none |
| shared-ui | shared-util |
| shared-util | none |
| api-client | api-client |

## Role dependency matrix

| Source | Allowed |
|----------|----------|
| app-shell | composition, entry-feature, core-data-access |
| composition | leaf, core-data-access |

## Business domain boundary

A business domain may depend on:

- same domain
- layer:core-domain
- layer:core-data-access
- layer:shared-domain
- layer:shared-ui
- layer:shared-util
- layer:api-client

Cross-domain imports are forbidden.

## Architectural intent

### App shell

Responsible for bootstrap and routing.

Allowed:
- role:composition
- role:entry-feature
- layer:core-data-access

### Composition feature

Thin orchestration layer.

Should compose leaf features and contain minimal logic.

### Entry feature

Standalone page that can be imported directly by the app shell while still behaving as a normal feature internally.

### Leaf feature

Normal business feature implementation.

### Data access

Stores, HTTP orchestration, DTO mapping, API client usage.

Must not depend on UI.

### Domain

Business models and domain contracts.

### UI

Presentation components and UI view models.
EOF
