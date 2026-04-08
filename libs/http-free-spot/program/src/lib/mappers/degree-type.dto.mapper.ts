import { DegreeType } from "@free-spot-domain/program";
import { DegreeDTO } from "@free-spot/api-client";

export const dtoToDegreeType = (dto: DegreeDTO): DegreeType => dto as unknown as DegreeType;
export const degreeTypeToDto = (value: DegreeType): DegreeDTO => value as unknown as DegreeDTO;
