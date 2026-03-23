import { CreateProblemDto, UpdateProblemDto } from "../dtos/problem.dto";
import { IProblem } from "../models/problem.models";
import { IProblemRepository } from "../repository/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";

export interface IProblemService{
    createproblem(problem:CreateProblemDto):Promise<IProblem>;
    getProblemsById(id:string):Promise<IProblem | null>;
    getAllProblems():Promise<{problems:IProblem[],total:number}>;
    updateProblem(id:string,updateData:UpdateProblemDto):Promise<IProblem | null>;
    deleteProblem(id:string):Promise<boolean>;
    findByDifficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]>;
    searchProblems(query:string):Promise<IProblem[]>;

}

export class ProblemService implements IProblemService{
    private problemRepository:IProblemRepository;

    constructor(problemRepository:IProblemRepository){
        this.problemRepository = problemRepository;
    }

    async createproblem(problem: CreateProblemDto): Promise<IProblem> {
        const sanitizedpayload = {
            ...problem,
            description: await sanitizeMarkdown(problem.description),
            editiorial:problem.editorial && await sanitizeMarkdown(problem.editorial)
        }
        return await this.problemRepository.createProblem(sanitizedpayload);
    }

    async getProblemsById(id: string): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem){
            throw new NotFoundError("Problem Not Found");
        }
        return problem;
    }

    async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
        return await this.problemRepository.getAllProblems();
    }

    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem){
            throw new NotFoundError("Problem Not Found");
        }
        const sanitizedpayload:Partial<IProblem>={
            ...updateData,

        }
        if(updateData.description){
            sanitizedpayload.description = await sanitizeMarkdown(updateData.description)
        }
        if(updateData.editorial){
            sanitizedpayload.editorial = await sanitizeMarkdown(updateData.editorial)
        }
        return await this.problemRepository.updateProblem(id,sanitizedpayload);
    }

    async deleteProblem(id: string): Promise<boolean> {
        const result = await this.problemRepository.deleteProblem(id);
        if(!result){
            throw new NotFoundError("Problem Not Found");
        }
        return result;
    }

    async findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]> {
        return await this.problemRepository.findByDifficulty(difficulty);
    }

    async searchProblems(query: string): Promise<IProblem[]> {
        if(!query || query.trim() === ""){
            throw new BadRequestError("Query is Required");
        }
        return await this.problemRepository.searchProblems(query);
    }
}