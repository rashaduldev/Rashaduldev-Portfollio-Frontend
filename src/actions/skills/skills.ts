"use server";

import { updateMyProfile, type Skill } from "../profile/profile";

// Skills are stored on the profile as an array. The backend replaces the whole
// array on update, so we always send the full, already-mutated list.
export async function saveSkills(skills: Skill[]) {
  return updateMyProfile({ skills });
}
