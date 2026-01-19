import { Type } from "class-transformer";
import { Min } from "class-validator";

export class CreateNoteDto {
    title: string;
    
    @Type(() => Number)
    @Min(0)
    lineCount: number;
}
