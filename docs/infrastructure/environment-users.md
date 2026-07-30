# Default Environment Users

This document defines the default users for each environment.

## Local Development (`local-dev`)

### Administrator

| Property | Value                          |
| -------- | ------------------------------ |
| Name     | Admin                          |
| Email    | `admin@local.dev`              |
| Password | `<your standard dev password>` |
| Role     | `ADMIN`                        |

### Normal User

| Property | Value                          |
| -------- | ------------------------------ |
| Name     | Student                        |
| Email    | `student@local.dev`            |
| Password | `<your standard dev password>` |
| Role     | `USER`                         |

---

## Atlas Development (`dev-atlas`)

### Administrator

| Property | Value                          |
| -------- | ------------------------------ |
| Name     | Admin                          |
| Email    | `admin@dev.atlas`              |
| Password | `<your standard dev password>` |
| Role     | `ADMIN`                        |

### Normal User

| Property | Value                          |
| -------- | ------------------------------ |
| Name     | Student                        |
| Email    | `student@dev.atlas`            |
| Password | `<your standard dev password>` |
| Role     | `USER`                         |

---

## Local E2E (`local-e2e`)

### Administrator

| Property | Value                          |
| -------- | ------------------------------ |
| Name     | Admin                          |
| Email    | `admin@local.e2e`              |
| Password | `<your standard dev password>` |
| Role     | `ADMIN`                        |

### Normal User

| Property | Value                          |
| -------- | ------------------------------ |
| Name     | Student                        |
| Email    | `student@local.e2e`            |
| Password | `<your standard dev password>` |
| Role     | `USER`                         |

---

## Staging

### Administrator

| Property | Value                    |
| -------- | ------------------------ |
| Name     | Admin                    |
| Email    | `admin@staging.freespot` |
| Password | `<staging password>`     |
| Role     | `ADMIN`                  |

### Normal User

| Property | Value                      |
| -------- | -------------------------- |
| Name     | Student                    |
| Email    | `student@staging.freespot` |
| Password | `<staging password>`       |
| Role     | `USER`                     |

---

## Production

### Administrator

| Property | Value                   |
| -------- | ----------------------- |
| Name     | Admin                   |
| Email    | `admin@freespot.app`    |
| Password | `<production password>` |
| Role     | `ADMIN`                 |

### Normal User

| Property | Value                   |
| -------- | ----------------------- |
| Name     | Student                 |
| Email    | `student@freespot.app`  |
| Password | `<production password>` |
| Role     | `USER`                  |

## Notes

* `local-dev` users are created manually through the application after bootstrapping the reference data.
* `dev-atlas` users are intended for development against the shared Atlas database.
* `local-e2e` users are managed by the E2E seed and should remain deterministic.
* `staging` users are intended for QA and remote Cypress execution.
* `production` users are the initial bootstrap accounts and should be created only once.
