import { ProgramVM } from "./program.vm";
import { Program } from "@free-spot-domain/program";

export function toProgramVM(program: Program): ProgramVM {
  return {
    id: program.id,
    facultyId: program.facultyId,
    name: program.name,
    degree: program.degree,
    active: program.active,
  };
}
