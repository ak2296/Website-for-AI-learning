// test.ts
import { Request, Response, NextFunction } from 'express';

function test(req: Request, res: Response, next: NextFunction) {
  res.send("Test");
}

console.log("Express types loaded successfully!");
