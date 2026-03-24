import { Request, Response } from "express";
import { ProblemService } from "../services/problem.service";
import { ProblemRepository } from "../repository/problem.repository";
// import { Problem } from "../models/problem.models";


// export interface IProblemController{
//     createProblem(req:Request,res:Response):Promise<void>;
//     getProblemById(req:Request,res:Response):Promise<void>;
//     getAllProblems(req:Request,res:Response):Promise<void>;
//     updateProblem(req:Request,res:Response):Promise<void>;
//     deleteProblem(req:Request,res:Response):Promise<void>;
//     findByDifficulty(req:Request,res:Response):Promise<void>;
//     searchProblems(req:Request,res:Response):Promise<void>;
// }

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);

export const ProblemController ={
    
    async createProblem(req: Request, res: Response):Promise<void>{
        const problem = await problemService.createproblem(req.body);
        res.status(201).json({
            message:"Problem Created Successfully",
            data:problem,
            success:true,

        })
    },
    async getProblemById(req: Request, res: Response): Promise<void> {
        const problem = await problemService.getProblemsById(req.params.id);
        res.status(200).json({
            message:"Problem Fetched Successfully",
            data:problem,
            success:true,
            
        })
    },

    async getAllProblems(req: Request, res: Response): Promise<void> {
        const problems = await problemService.getAllProblems();
        res.status(200).json({
            message:"Problems Fetched Successfully",
            data:problems,
            success:true,
        })
    },

    async updateProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.updateProblem(req.params.id,req.body);
        res.status(200).json({
            message:"Problem updated Successfully",
            data:problem,
            success:true,
        })
    },

    async deleteProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.deleteProblem(req.params.id);
        res.status(200).json({
            message:"Problem deleted Successfully",
            data:problem,
            success:true,
        })
    },

    async findByDifficulty(req: Request, res: Response): Promise<void> {
        const difficulty = req.params.difficulty as "easy" | "medium"| "hard";
        const problem = await problemService.findByDifficulty(difficulty);
        res.status(200).json({
            message:"Problems Fetched Successfully by difficulty",
            data:problem,
            success:true,
        })
    },

    async searchProblems(req: Request, res: Response): Promise<void> {
        const problem = await problemService.searchProblems(req.query.query as string);
        res.status(200).json({
            message:"Problems fetched Successfully",
            data:problem,
            success:true,
        })
    }
}