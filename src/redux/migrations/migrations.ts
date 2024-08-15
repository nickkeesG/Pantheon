import { MigrationManifest } from "redux-persist";
import { V0to1Migration } from "./v0to1migration";
import { V0InitialMigration } from "./v0InitialMigration";
import { V1to2Migration } from "./v1to2migration";
import { V2to3Migration } from "./v2to3migration";
import { V3to4Migration } from "./v3to4migration";

// Steps to create a new migration for Redux changes:
// 1. Create a file for the migration, following the naming convention
// 2. Describe the *previous state* (before the changes you've made), and write the migration, describing how data in the form of the previous state should be moved to the new state
// 3. Change the *previous migration* to point to the *previous state*, for which you just wrote a definition
// 4. Add the new migration to this list
// 5. Test very well

const migrations: MigrationManifest = {
  0: V0InitialMigration,
  1: V0to1Migration,
  2: V1to2Migration,
  3: V2to3Migration,
  4: V3to4Migration
}

export default migrations;