# Environment Strategy

## Overview

The application supports multiple environments for development, testing, staging, and production. Each environment has its own frontend, backend, and database configuration.

| Environment    | Frontend       | Backend             | Database                 | Purpose                                                          |
| -------------- | -------------- | ------------------- | ------------------------ | ---------------------------------------------------------------- |
| **local-dev**  | localhost:4200 | localhost:3333      | Local `freespot_dev`     | Daily development using a local MongoDB instance.                |
| **dev-atlas**  | localhost:4200 | localhost:3333      | Atlas `freespot_dev`     | Local development against the shared Atlas development database. |
| **local-e2e**  | localhost:4200 | localhost:3333      | Local `freespot_e2e`     | Cypress end-to-end testing against an isolated local database.   |
| **staging**    | Netlify        | Render (staging)    | Atlas `freespot_staging` | Shared environment for QA and remote Cypress execution.          |
| **production** | Vercel         | Render (production) | Atlas `freespot_prod`    | Production environment.                                          |

## Environment Responsibilities

### local-dev

* Local Angular application
* Local Express backend
* Local MongoDB
* Fastest development workflow
* Safe for experimentation

### dev-atlas

* Local Angular application
* Local Express backend
* Shared Atlas development database
* Useful for validating changes against cloud infrastructure without deploying

### local-e2e

* Local Angular application
* Local Express backend
* Local MongoDB (`freespot_e2e`)
* Database is reset and seeded before test execution
* Used exclusively by Cypress

### staging

* Frontend deployed to Netlify
* Backend deployed to Render
* Dedicated Atlas database (`freespot_staging`)
* Database seeded with deterministic test data
* Used for manual QA and remote Cypress execution

### production

* Frontend deployed to Vercel
* Backend deployed to Render
* Dedicated Atlas database (`freespot_prod`)
* No automated seeding
* Used by end users

## Design Principles

* Every deployed environment has its own database.
* Production data is never shared with development or testing.
* Cypress tests are environment-independent and rely only on configuration.
* Local development should remain fully functional without internet connectivity.
* Environment-specific behavior should be implemented through Angular environment files, backend `.env` files, and Nx configurations rather than application code.
